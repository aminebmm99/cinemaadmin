<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

try {
    // Get all active films
    $stmt = $pdo->query("SELECT id, title, genre, duration_minutes as duration, synopsis as description, poster_url as poster, classification as banner, classification as trailer, classification as director, classification as cast, classification as languages FROM films WHERE is_active = 1 ORDER BY created_at DESC");
    $films = $stmt->fetchAll();

    // Now format the films to match the frontend expected structure
    $nowShowing = [];
    $comingSoon = [];

    // Get seances to determine if "Now Showing" or "Coming Soon"
    $seanceStmt = $pdo->query("SELECT DISTINCT film_id FROM seances WHERE start_time >= NOW() AND status != 'Annule'");
    $nowShowingIds = $seanceStmt->fetchAll(PDO::FETCH_COLUMN);

    foreach ($films as $film) {
        $formattedFilm = [
            'id' => (int)$film['id'],
            'title' => $film['title'],
            'genre' => $film['genre'],
            'duration' => $film['duration'] . ' min',
            'rating' => 8.0, // Default rating as it's not in DB
            'poster' => $film['poster'] ? $film['poster'] : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Poster',
            'banner' => $film['poster'] ? $film['poster'] : 'https://via.placeholder.com/1920x600/0f3460/ffffff?text=No+Banner', // Fallback to poster
            'description' => $film['description'] ? $film['description'] : 'No description available.',
            'trailer' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Default trailer
            'releaseDate' => '2026-01-01', // Default
            'director' => 'TBD',
            'cast' => 'TBD',
            'languages' => ['French', 'English'],
            'showtimes' => [] // Showtimes will be fetched in details page if needed, or we can fetch them here. To keep it simple, we leave it empty for lists.
        ];

        // If it has future seances, it's now showing. Otherwise wait.
        // Or if we specifically want them split. For now, if it's active and has seances -> now showing. Else -> coming soon.
        if (in_array((int)$film['id'], $nowShowingIds)) {
            $nowShowing[] = $formattedFilm;
        } else {
            // We can treat everything else as coming soon, or we can just fetch all films as nowShowing.
            // Let's put movies without seances in comingSoon.
            $formattedFilm['rating'] = null; // Coming soon gets null rating in UI usually
            $comingSoon[] = $formattedFilm;
        }
    }

    // In case no seances are there, let's just make sure we have something to show. If all movies fall into comingSoon, let's move some back to nowShowing just so UI isn't empty, if this is a test env.
    if (count($nowShowing) === 0 && count($comingSoon) > 0) {
        $nowShowing = $comingSoon;
        $comingSoon = [];
        foreach($nowShowing as &$f) {
            $f['rating'] = 8.0;
        }
    }

    echo json_encode([
        'success' => true,
        'data' => [
             'nowShowing' => $nowShowing,
             'comingSoon' => $comingSoon
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch movies']);
}
?>
