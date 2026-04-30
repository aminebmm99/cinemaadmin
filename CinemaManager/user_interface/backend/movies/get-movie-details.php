<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid movie ID']);
    exit;
}

try {
    // Get film details
    $stmt = $pdo->prepare("SELECT id, title, genre, duration_minutes as duration, synopsis as description, poster_url as poster, classification FROM films WHERE id = :id AND is_active = 1");
    $stmt->execute(['id' => $id]);
    $film = $stmt->fetch();

    if (!$film) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Movie not found']);
        exit;
    }

    // Format film
    $formattedFilm = [
        'id' => (int)$film['id'],
        'title' => $film['title'],
        'genre' => $film['genre'],
        'duration' => $film['duration'] . ' min',
        'rating' => 8.0,
        'poster' => $film['poster'] ? $film['poster'] : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Poster',
        'banner' => $film['poster'] ? $film['poster'] : 'https://via.placeholder.com/1920x600/0f3460/ffffff?text=No+Banner',
        'description' => $film['description'] ? $film['description'] : 'No description available.',
        'trailer' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'releaseDate' => '2026-01-01',
        'director' => 'TBD',
        'cast' => 'TBD',
        'languages' => ['French', 'English']
    ];

    // Get showtimes (seances) specifically for this movie
    $seanceStmt = $pdo->prepare("SELECT s.id, s.start_time, s.base_price, r.name as room_name 
                                 FROM seances s 
                                 LEFT JOIN salle r ON s.room_id = r.id 
                                 WHERE s.film_id = :id AND s.start_time >= NOW() AND s.status != 'Annule' 
                                 ORDER BY s.start_time ASC");
    $seanceStmt->execute(['id' => $id]);
    $seances = $seanceStmt->fetchAll();

    // Group seances by date
    $dates = [];
    foreach ($seances as $s) {
        $datetime = new DateTime($s['start_time']);
        $dateStr = $datetime->format('Y-m-d');
        $timeStr = $datetime->format('H:i');
        
        if (!isset($dates[$dateStr])) {
            $dates[$dateStr] = [];
        }
        $dates[$dateStr][] = [
            'id' => $s['id'],
            'time' => $timeStr,
            'price' => $s['base_price'],
            'room' => $s['room_name']
        ];
    }
    
    $formattedFilm['availableDates'] = $dates;

    echo json_encode([
        'success' => true,
        'data' => $formattedFilm
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch movie details']);
}
?>
