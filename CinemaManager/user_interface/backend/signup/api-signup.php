<?php
declare(strict_types=1);

// Only output JSON
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

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Données manquantes"]));
}

$username = trim($data['username']);
$password = $data['password'];
$email = isset($data['email']) ? trim($data['email']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';

if (empty($username) || empty($password) || $email === '' || $phone === '') {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Veuillez remplir tous les champs (e-mail et téléphone inclus)"]));
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Adresse e-mail invalide"]));
}

try {
    // Check if username already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);
    if ($stmt->fetch()) {
        http_response_code(409);
        die(json_encode(["success" => false, "message" => "Ce nom d'utilisateur est déjà pris"]));
    }

    // Insert new user with email and tel
    $stmt = $pdo->prepare("INSERT INTO users (username, password, role, email, tel) VALUES (:username, :password, 'user', :email, :tel)");
    $stmt->execute(['username' => $username, 'password' => $password, 'email' => $email, 'tel' => $phone]);
    
    http_response_code(201);
    die(json_encode(["success" => true, "message" => "Compte créé avec succès !"]));
} catch (Exception $e) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Erreur lors de la création du compte"]));
}
