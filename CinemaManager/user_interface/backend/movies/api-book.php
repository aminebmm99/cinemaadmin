<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

$seanceId = $data['seance_id'] ?? null;
$customerName = trim($data['customer_name'] ?? '');
$customerEmail = trim($data['customer_email'] ?? '');
$ticketsCount = (int)($data['tickets_count'] ?? 1);
$totalAmount = (float)($data['total_amount'] ?? 0);

if (!$seanceId || empty($customerName) || empty($customerEmail) || $ticketsCount < 1) {
    echo json_encode(['success' => false, 'message' => 'Missing required booking fields.']);
    exit;
}

$bookingCode = 'BK' . strtoupper(substr(md5(uniqid('', true)), 0, 8));

try {
    $pdo->beginTransaction();

    // Check available seats
    $stmt = $pdo->prepare("SELECT available_seats FROM seances WHERE id = ? FOR UPDATE");
    $stmt->execute([$seanceId]);
    $seance = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$seance || $seance['available_seats'] < $ticketsCount) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Not enough seats available.']);
        exit;
    }

    // Insert reservation
    $stmt = $pdo->prepare("INSERT INTO reservations (booking_code, seance_id, customer_name, customer_email, tickets_count, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, 'Confirmee')");
    $stmt->execute([
        $bookingCode,
        $seanceId,
        $customerName,
        $customerEmail,
        $ticketsCount,
        $totalAmount
    ]);

    // Update seance available seats
    $stmt = $pdo->prepare("UPDATE seances SET available_seats = available_seats - ? WHERE id = ?");
    $stmt->execute([$ticketsCount, $seanceId]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'booking_code' => $bookingCode
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Booking failed: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error while booking.']);
}
?>
