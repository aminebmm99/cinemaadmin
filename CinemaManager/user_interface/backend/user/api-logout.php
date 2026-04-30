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

// Logout is client-side: clear localStorage
// This endpoint confirms logout was successful

http_response_code(200);
echo json_encode([
    "success" => true,
    "message" => "Logged out successfully"
]);
?>
