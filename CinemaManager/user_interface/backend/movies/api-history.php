<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

$username = $_GET['username'] ?? '';

if (empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Username is required']);
    exit;
}

try {
    // Resolve account email so we can match bookings even when customer_name differs.
    $userStmt = $pdo->prepare("SELECT email FROM users WHERE username = :username LIMIT 1");
    $userStmt->execute(['username' => $username]);
    $userRow = $userStmt->fetch(PDO::FETCH_ASSOC);
    $userEmail = $userRow['email'] ?? '';

    // We join reservations, seances, and films to get a complete history
    $stmt = $pdo->prepare("
        SELECT 
            r.id, r.booking_code, r.customer_name, r.tickets_count, r.total_amount, r.status, r.reserved_at,
            s.start_time,
            f.title as film_title, f.poster_url, f.duration_minutes
        FROM reservations r
        JOIN seances s ON r.seance_id = s.id
        JOIN films f ON s.film_id = f.id
        WHERE r.customer_name = :username
           OR (:email <> '' AND r.customer_email = :email)
        ORDER BY r.reserved_at DESC
    ");
    
    $stmt->execute([
        'username' => $username,
        'email' => $userEmail
    ]);
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $history
    ]);
    
} catch (PDOException $e) {
    error_log("Failed to fetch history: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
