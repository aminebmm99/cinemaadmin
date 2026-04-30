<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', '0');

$host = '127.0.0.1';
$dbname = 'cinemamanager';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['username']) || trim($data['username']) === '') {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Username is required"]));
}

$username = trim($data['username']);

try {
    $stmt = $pdo->prepare('SELECT username, email, tel FROM users WHERE username = :username');
    $stmt->execute(['username' => $username]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        http_response_code(404);
        die(json_encode(["success" => false, "message" => "User not found"]));
    }

    echo json_encode(["success" => true, "profile" => $profile]);
} catch (Exception $e) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Database error"]));
}
