<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../helpers.php';

$method = $_SERVER['REQUEST_METHOD'];

function reservation_exists(mysqli $conn, int $id): bool
{
    $check = mysqli_query($conn, "SELECT id FROM reservations WHERE id = $id");
    return $check && mysqli_num_rows($check) > 0;
}

function seance_row(mysqli $conn, int $seanceId): ?array
{
    $result = mysqli_query(
        $conn,
        "SELECT id, available_seats, status FROM seances WHERE id = $seanceId LIMIT 1"
    );

    if (!$result || mysqli_num_rows($result) === 0) {
        return null;
    }

    return mysqli_fetch_assoc($result) ?: null;
}

if ($method === 'GET') {
    $sql = "SELECT
                r.id,
                r.booking_code,
                r.seance_id,
                r.customer_name,
                r.customer_email,
                r.tickets_count,
                r.total_amount,
                r.status,
                s.film_id,
                s.start_time,
                f.title AS film_title
            FROM reservations r
            INNER JOIN seances s ON r.seance_id = s.id
            INNER JOIN films f ON s.film_id = f.id
            ORDER BY r.reserved_at DESC";

    $result = mysqli_query($conn, $sql);
    if (!$result) {
        json_response(['error' => 'Erreur lors du chargement des reservations: ' . mysqli_error($conn)], 500);
    }

    $reservations = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $start = new DateTime($row['start_time']);

        $reservations[] = [
            'id' => (int)$row['id'],
            'code' => $row['booking_code'],
            'seance_id' => (int)$row['seance_id'],
            'film_id' => (int)$row['film_id'],
            'film_title' => htmlspecialchars($row['film_title'] ?? ''),
            'customer_name' => htmlspecialchars($row['customer_name'] ?? ''),
            'customer_email' => htmlspecialchars($row['customer_email'] ?? ''),
            'tickets_count' => (int)$row['tickets_count'],
            'total' => (float)$row['total_amount'],
            'status' => $row['status'],
            'date' => $start->format('d/m/Y'),
            'heure' => $start->format('H:i')
        ];
    }

    json_response(['reservations' => $reservations]);
}

if ($method === 'POST') {
    $data = get_json_input();
    required_fields($data, ['customer_name', 'customer_email', 'seance_id', 'tickets_count', 'status']);

    $customerName = mysqli_real_escape_string($conn, trim((string)$data['customer_name']));
    $customerEmail = mysqli_real_escape_string($conn, trim((string)$data['customer_email']));
    $seanceId = (int)$data['seance_id'];
    $ticketsCount = (int)$data['tickets_count'];
    $status = normalize_reservation_status((string)$data['status']);

    if ($customerName === '' || strlen($customerName) < 2) {
        json_response(['error' => 'Nom client invalide'], 400);
    }

    if (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        json_response(['error' => 'Email client invalide'], 400);
    }

    if ($seanceId <= 0) {
        json_response(['error' => 'Seance invalide'], 400);
    }

    if ($ticketsCount <= 0) {
        json_response(['error' => 'Nombre de billets invalide'], 400);
    }

    $seance = seance_row($conn, $seanceId);
    if ($seance === null) {
        json_response(['error' => 'Seance introuvable'], 404);
    }

    if ((int)$seance['available_seats'] < $ticketsCount) {
        json_response(['error' => 'Places insuffisantes'], 409);
    }

    $priceResult = mysqli_query($conn, "SELECT base_price FROM seances WHERE id = $seanceId LIMIT 1");
    $priceRow = $priceResult ? mysqli_fetch_assoc($priceResult) : null;
    if ($priceRow === null) {
        json_response(['error' => 'Prix de seance introuvable'], 404);
    }

    $totalAmount = ((float)$priceRow['base_price']) * $ticketsCount;

    mysqli_begin_transaction($conn);
    try {
        $bookingCode = 'RES-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
        $totalAmountSql = number_format($totalAmount, 2, '.', '');

        $insertSql = "INSERT INTO reservations
            (booking_code, seance_id, customer_name, customer_email, tickets_count, total_amount, status)
            VALUES
            ('$bookingCode', $seanceId, '$customerName', '$customerEmail', $ticketsCount, $totalAmountSql, '$status')";

        if (!mysqli_query($conn, $insertSql)) {
            throw new RuntimeException('Erreur insertion reservation: ' . mysqli_error($conn));
        }

        $updateSeatsSql = "UPDATE seances
            SET available_seats = available_seats - $ticketsCount,
                status = CASE WHEN (available_seats - $ticketsCount) <= 0 THEN 'Complet' ELSE 'Disponible' END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $seanceId AND available_seats >= $ticketsCount";

        if (!mysqli_query($conn, $updateSeatsSql) || mysqli_affected_rows($conn) === 0) {
            throw new RuntimeException('Impossible de mettre a jour les places disponibles');
        }

        mysqli_commit($conn);
        json_response(['success' => true, 'id' => mysqli_insert_id($conn)]);
    } catch (Throwable $e) {
        mysqli_rollback($conn);
        json_response(['error' => $e->getMessage()], 500);
    }
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        json_response(['error' => 'ID invalide'], 400);
    }

    if (!reservation_exists($conn, $id)) {
        json_response(['error' => 'Reservation introuvable'], 404);
    }

    $data = get_json_input();
    required_fields($data, ['customer_name', 'customer_email', 'seance_id', 'tickets_count', 'status']);

    $customerName = mysqli_real_escape_string($conn, trim((string)$data['customer_name']));
    $customerEmail = mysqli_real_escape_string($conn, trim((string)$data['customer_email']));
    $newSeanceId = (int)$data['seance_id'];
    $newTicketsCount = (int)$data['tickets_count'];
    $status = normalize_reservation_status((string)$data['status']);

    if ($customerName === '' || strlen($customerName) < 2) {
        json_response(['error' => 'Nom client invalide'], 400);
    }

    if (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        json_response(['error' => 'Email client invalide'], 400);
    }

    if ($newSeanceId <= 0) {
        json_response(['error' => 'Seance invalide'], 400);
    }

    if ($newTicketsCount <= 0) {
        json_response(['error' => 'Nombre de billets invalide'], 400);
    }

    $currentResult = mysqli_query(
        $conn,
        "SELECT seance_id, tickets_count FROM reservations WHERE id = $id LIMIT 1"
    );
    $currentRow = $currentResult ? mysqli_fetch_assoc($currentResult) : null;
    if ($currentRow === null) {
        json_response(['error' => 'Reservation introuvable'], 404);
    }

    $oldSeanceId = (int)$currentRow['seance_id'];
    $oldTicketsCount = (int)$currentRow['tickets_count'];

    $priceResult = mysqli_query($conn, "SELECT base_price FROM seances WHERE id = $newSeanceId LIMIT 1");
    $priceRow = $priceResult ? mysqli_fetch_assoc($priceResult) : null;
    if ($priceRow === null) {
        json_response(['error' => 'Seance introuvable'], 404);
    }

    $totalAmount = ((float)$priceRow['base_price']) * $newTicketsCount;
    $totalAmountSql = number_format($totalAmount, 2, '.', '');

    mysqli_begin_transaction($conn);
    try {
        // Restore seats from previous reservation first.
        $restoreOldSql = "UPDATE seances
            SET available_seats = available_seats + $oldTicketsCount,
                status = 'Disponible',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $oldSeanceId";

        if (!mysqli_query($conn, $restoreOldSql)) {
            throw new RuntimeException('Erreur restauration places: ' . mysqli_error($conn));
        }

        // Reserve seats on the selected seance.
        $reserveNewSql = "UPDATE seances
            SET available_seats = available_seats - $newTicketsCount,
                status = CASE WHEN (available_seats - $newTicketsCount) <= 0 THEN 'Complet' ELSE 'Disponible' END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $newSeanceId AND available_seats >= $newTicketsCount";

        if (!mysqli_query($conn, $reserveNewSql) || mysqli_affected_rows($conn) === 0) {
            throw new RuntimeException('Places insuffisantes pour la seance selectionnee');
        }

        $updateReservationSql = "UPDATE reservations
            SET seance_id = $newSeanceId,
                customer_name = '$customerName',
                customer_email = '$customerEmail',
                tickets_count = $newTicketsCount,
                total_amount = $totalAmountSql,
                status = '$status',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $id";

        if (!mysqli_query($conn, $updateReservationSql)) {
            throw new RuntimeException('Erreur mise a jour reservation: ' . mysqli_error($conn));
        }

        mysqli_commit($conn);
        json_response(['success' => true]);
    } catch (Throwable $e) {
        mysqli_rollback($conn);
        json_response(['error' => $e->getMessage()], 500);
    }
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        json_response(['error' => 'ID invalide'], 400);
    }

    $reservationResult = mysqli_query(
        $conn,
        "SELECT seance_id, tickets_count FROM reservations WHERE id = $id LIMIT 1"
    );
    $reservation = $reservationResult ? mysqli_fetch_assoc($reservationResult) : null;

    if ($reservation === null) {
        json_response(['error' => 'Reservation introuvable'], 404);
    }

    $seanceId = (int)$reservation['seance_id'];
    $ticketsCount = (int)$reservation['tickets_count'];

    mysqli_begin_transaction($conn);
    try {
        if (!mysqli_query($conn, "DELETE FROM reservations WHERE id = $id")) {
            throw new RuntimeException('Erreur suppression reservation: ' . mysqli_error($conn));
        }

        $restoreSeatsSql = "UPDATE seances
            SET available_seats = available_seats + $ticketsCount,
                status = 'Disponible',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $seanceId";

        if (!mysqli_query($conn, $restoreSeatsSql)) {
            throw new RuntimeException('Erreur restauration places: ' . mysqli_error($conn));
        }

        mysqli_commit($conn);
        json_response(['success' => true]);
    } catch (Throwable $e) {
        mysqli_rollback($conn);
        json_response(['error' => $e->getMessage()], 500);
    }
}

json_response(['error' => 'Methode non autorisee'], 405);
