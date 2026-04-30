<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    // Get all seances from today forward, joined with films
    $stmt = $pdo->query("
        SELECT 
            s.id as seance_id, s.start_time, s.available_seats, s.base_price,
            sa.name as room_name,
            f.id as film_id, f.title, f.genre, f.duration_minutes as duration, f.poster_url as poster, f.classification as rating
        FROM seances s
        JOIN films f ON s.film_id = f.id
        LEFT JOIN salle sa ON s.room_id = sa.id
        WHERE s.start_time >= CURDATE()
          AND LOWER(s.status) NOT IN ('annule', 'annulee', 'annulée')
          AND f.is_active = 1
        ORDER BY s.start_time ASC
    ");
    $seances = $stmt->fetchAll();

    // Group by date
    $moviesByDate = [];

    foreach ($seances as $s) {
        $datetime = new DateTime($s['start_time']);
        $dateStr = $datetime->format('Y-m-d');
        $timeStr = $datetime->format('H:i');

        if (!isset($moviesByDate[$dateStr])) {
            $moviesByDate[$dateStr] = [];
        }

        if (!isset($moviesByDate[$dateStr][$s['film_id']])) {
            $moviesByDate[$dateStr][$s['film_id']] = [
                'id' => (int)$s['film_id'],
                'title' => $s['title'],
                'genre' => $s['genre'],
                'duration' => $s['duration'] . ' min',
                'rating' => $s['rating'] ?: '',
                'poster' => $s['poster'] ? $s['poster'] : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Poster',
                'showtimes' => []
            ];
        }

        $moviesByDate[$dateStr][$s['film_id']]['showtimes'][] = [
            'id' => (int)$s['seance_id'],
            'time' => $timeStr,
            'price' => $s['base_price'],
            'availableSeats' => (int)$s['available_seats'],
            'room' => $s['room_name'] ?: 'Standard Hall'
        ];
    }

    echo json_encode([
        'success' => true,
        'data' => $moviesByDate
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch showtimes']);
}
?>
