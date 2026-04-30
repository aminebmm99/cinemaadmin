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
$currentUsername = isset($data['currentUsername']) ? trim($data['currentUsername']) : '';
$newUsername = isset($data['username']) ? trim($data['username']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$tel = isset($data['phone']) ? trim($data['phone']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if ($currentUsername === '' || $newUsername === '' || $email === '' || $tel === '') {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Current username, new username, e-mail and phone are required"]));
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Adresse e-mail invalide"]));
}

try {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = :currentUsername');
    $stmt->execute(['currentUsername' => $currentUsername]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        die(json_encode(["success" => false, "message" => "Utilisateur introuvable"]));
    }

    if ($newUsername !== $currentUsername) {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE username = :username');
        $stmt->execute(['username' => $newUsername]);
        if ($stmt->fetch()) {
            http_response_code(409);
            die(json_encode(["success" => false, "message" => "Ce nom d'utilisateur est déjà utilisé"]));
        }
    }

    $fields = ['username' => $newUsername, 'email' => $email, 'tel' => $tel, 'currentUsername' => $currentUsername];
    $sql = 'UPDATE users SET username = :username, email = :email, tel = :tel';

    if ($password !== '') {
        $sql .= ', password = :password';
        $fields['password'] = $password;
    }

    $sql .= ' WHERE username = :currentUsername';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($fields);

    echo json_encode(["success" => true, "message" => "Profil mis à jour avec succès", "username" => $newUsername]);
} catch (Exception $e) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Erreur lors de la mise à jour du profil"]));
}
