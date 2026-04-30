<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../helpers.php';

$method = $_SERVER['REQUEST_METHOD'];

function normalize_start_time(mysqli $conn, string $rawStartTime): string
{
    try {
        $dt = new DateTime(trim($rawStartTime));
        return mysqli_real_escape_string($conn, $dt->format('Y-m-d H:i:s'));
    } catch (Exception $e) {
        json_response(['error' => 'Format start_time invalide (YYYY-MM-DD HH:MM:SS attendu)'], 400);
    }
}

function ensure_room_slot_available(mysqli $conn, int $roomId, int $filmId, string $startTime, int $excludeSeanceId = 0): void
{
    $film_query = mysqli_query($conn, "SELECT duration_minutes FROM films WHERE id = $filmId AND is_active = 1");
    if (mysqli_num_rows($film_query) === 0) {
        json_response(['error' => 'Film non trouvé'], 404);
    }

    $film_data = mysqli_fetch_array($film_query, MYSQLI_ASSOC);
    $duration_minutes = (int)$film_data['duration_minutes'];
    $total_duration = $duration_minutes + 15;

    $start_dt = new DateTime($startTime);
    $end_dt = clone $start_dt;
    $end_dt->modify("+$total_duration minutes");

    $start_str = $start_dt->format('Y-m-d H:i:s');
    $end_str = $end_dt->format('Y-m-d H:i:s');

    $exclude_clause = $excludeSeanceId > 0 ? "AND se.id != $excludeSeanceId" : '';

    $conflict_sql = "SELECT
                        se.id,
                        f.title as film_title,
                        se.start_time,
                        DATE_ADD(se.start_time, INTERVAL f.duration_minutes + 15 MINUTE) as end_time
                    FROM seances se
                    JOIN films f ON se.film_id = f.id
                    WHERE se.room_id = $roomId
                    $exclude_clause
                    AND se.start_time < '$end_str'
                    AND DATE_ADD(se.start_time, INTERVAL f.duration_minutes + 15 MINUTE) > '$start_str'
                    ORDER BY se.start_time ASC
                    LIMIT 1";

    $conflict_result = mysqli_query($conn, $conflict_sql);
    if (!$conflict_result) {
        json_response(['error' => 'Erreur vérification disponibilité: ' . mysqli_error($conn)], 500);
    }

    if (mysqli_num_rows($conflict_result) > 0) {
        $conflict = mysqli_fetch_array($conflict_result, MYSQLI_ASSOC);
        json_response([
            'error' => 'Salle indisponible: chevauchement avec une autre séance (pause de 15 min incluse)',
            'conflict' => [
                'id' => (int)$conflict['id'],
                'film_title' => htmlspecialchars($conflict['film_title']),
                'start_time' => $conflict['start_time'],
                'end_time' => $conflict['end_time']
            ]
        ], 409);
    }
}

// Endpoint pour récupérer les données des selects (films et salles)
if (isset($_GET['action']) && $_GET['action'] === 'select-data') {
    // Récupérer les films actifs
    $films_sql = 'SELECT id, title FROM films WHERE is_active = 1 ORDER BY title ASC';
    $films_result = mysqli_query($conn, $films_sql);
    $films = [];
    while ($film = mysqli_fetch_array($films_result, MYSQLI_ASSOC)) {
        $films[] = [
            'id' => (int)$film['id'],
            'nom' => htmlspecialchars($film['title'])
        ];
    }

    // Récupérer les salles actives avec leur capacité
    $salles_sql = 'SELECT id, name, capacity FROM salle ORDER BY name ASC';
    $salles_result = mysqli_query($conn, $salles_sql);
    $salles = [];
    while ($salle = mysqli_fetch_array($salles_result, MYSQLI_ASSOC)) {
        $salles[] = [
            'id' => (int)$salle['id'],
            'nom' => htmlspecialchars($salle['name']),
            'capacite' => (int)$salle['capacity']
        ];
    }

    json_response(['films' => $films, 'salles' => $salles]);
    exit;
}

if ($method === 'GET') {
    $sql = 'SELECT 
                s.id,
                s.film_id,
                s.room_id,
                s.start_time,
                s.total_seats,
                s.available_seats,
                s.base_price,
                s.status,
                f.title as film_nom,
                sa.name as salle_nom,
                sa.capacity as salle_capacity
            FROM seances s
            LEFT JOIN films f ON s.film_id = f.id
            LEFT JOIN salle sa ON s.room_id = sa.id
            ORDER BY s.start_time DESC';

    $result = mysqli_query($conn, $sql);

    $seances = [];
    while ($seance = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        // Formater la date et l'heure
        $start_time = new DateTime($seance['start_time']);
        $date = $start_time->format('d/m/Y');
        $heure = $start_time->format('H:i');
        
        // Déterminer le statut automatiquement
        $available = (int)$seance['available_seats'];
        $status = $available == 0 ? 'Complet' : htmlspecialchars($seance['status']);

        $seances[] = [
            'id' => (int)$seance['id'],
            'film_id' => (int)$seance['film_id'],
            'room_id' => (int)$seance['room_id'],
            'film_nom' => htmlspecialchars($seance['film_nom'] ?? 'N/A'),
            'salle_nom' => htmlspecialchars($seance['salle_nom'] ?? 'N/A'),
            'salle_capacity' => (int)$seance['salle_capacity'],
            'date' => $date,
            'heure' => $heure,
            'start_time' => $seance['start_time'],
            'total_seats' => (int)$seance['total_seats'],
            'available_seats' => (int)$seance['available_seats'],
            'base_price' => (float)$seance['base_price'],
            'status' => $status
        ];
    }

    json_response(['seances' => $seances]);
    exit;
}

if ($method === 'POST') {
    $data = get_json_input();
    required_fields($data, ['film_id', 'room_id', 'start_time', 'base_price']);

    $film_id = (int)$data['film_id'];
    $room_id = (int)$data['room_id'];
    $start_time = normalize_start_time($conn, (string)$data['start_time']);
    $base_price = (float)$data['base_price'];

    // Validation
    if ($film_id <= 0) {
        json_response(['error' => 'Film invalide'], 400);
    }

    if ($room_id <= 0) {
        json_response(['error' => 'Salle invalide'], 400);
    }

    if ($base_price < 0) {
        json_response(['error' => 'Le prix ne peut pas être négatif'], 400);
    }

    // Vérifier que le film existe et est actif
    $film_check = mysqli_query($conn, "SELECT id FROM films WHERE id = $film_id AND is_active = 1");
    if (mysqli_num_rows($film_check) === 0) {
        json_response(['error' => 'Film non trouvé'], 404);
    }

    // Récupérer la salle et sa capacité
    $room_check = mysqli_query($conn, "SELECT capacity FROM salle WHERE id = $room_id");
    if (mysqli_num_rows($room_check) === 0) {
        json_response(['error' => 'Salle non trouvée'], 404);
    }
    
    $room_data = mysqli_fetch_array($room_check, MYSQLI_ASSOC);
    $total_seats = (int)$room_data['capacity'];

    ensure_room_slot_available($conn, $room_id, $film_id, $start_time);

    $sql = "INSERT INTO seances (film_id, room_id, start_time, total_seats, available_seats, base_price, status)
            VALUES ($film_id, $room_id, '$start_time', $total_seats, $total_seats, $base_price, 'Disponible')";

    if (mysqli_query($conn, $sql)) {
        $id = mysqli_insert_id($conn);
        json_response(['success' => true, 'id' => $id]);
        exit;
    } else {
        json_response(['error' => 'Erreur lors de l\'insertion: ' . mysqli_error($conn)], 500);
        exit;
    }
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        json_response(['error' => 'ID invalide'], 400);
    }

    $data = get_json_input();
    required_fields($data, ['film_id', 'room_id', 'start_time', 'base_price']);

    $film_id = (int)$data['film_id'];
    $room_id = (int)$data['room_id'];
    $start_time = normalize_start_time($conn, (string)$data['start_time']);
    $base_price = (float)$data['base_price'];

    // Validation
    if ($film_id <= 0) {
        json_response(['error' => 'Film invalide'], 400);
    }

    if ($room_id <= 0) {
        json_response(['error' => 'Salle invalide'], 400);
    }

    if ($base_price < 0) {
        json_response(['error' => 'Le prix ne peut pas être négatif'], 400);
    }

    // Vérifier que le film existe et est actif
    $film_check = mysqli_query($conn, "SELECT id FROM films WHERE id = $film_id AND is_active = 1");
    if (mysqli_num_rows($film_check) === 0) {
        json_response(['error' => 'Film non trouvé'], 404);
    }

    // Récupérer la salle et sa capacité
    $room_check = mysqli_query($conn, "SELECT capacity FROM salle WHERE id = $room_id");
    if (mysqli_num_rows($room_check) === 0) {
        json_response(['error' => 'Salle non trouvée'], 404);
    }
    
    $room_data = mysqli_fetch_array($room_check, MYSQLI_ASSOC);
    $total_seats = (int)$room_data['capacity'];

    ensure_room_slot_available($conn, $room_id, $film_id, $start_time, $id);

    $sql = "UPDATE seances 
            SET film_id = $film_id, 
                room_id = $room_id, 
                start_time = '$start_time', 
                total_seats = $total_seats, 
                base_price = $base_price,
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = $id";

    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) > 0) {
            json_response(['success' => true]);
        } else {
            json_response(['error' => 'Séance non trouvée'], 404);
        }
    } else {
        json_response(['error' => 'Erreur lors de la mise à jour: ' . mysqli_error($conn)], 500);
    }
    exit;
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        json_response(['error' => 'ID invalide'], 400);
    }

    // Hard delete
    $sql = "DELETE FROM seances WHERE id = $id";

    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) > 0) {
            json_response(['success' => true]);
        } else {
            json_response(['error' => 'Séance non trouvée'], 404);
        }
    } else {
        json_response(['error' => 'Erreur lors de la suppression: ' . mysqli_error($conn)], 500);
    }
    exit;
}

json_response(['error' => 'Méthode non autorisée'], 405);
