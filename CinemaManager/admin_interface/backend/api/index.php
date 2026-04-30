<?php
// API Router
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$requestURI = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove base path from URI
$basePath = '/CinemaManager/admin-interface/backend/api';
$route = str_replace($basePath, '', $requestURI);
$route = trim($route, '/');

// Parse route
$parts = explode('/', $route);
$resource = $parts[0] ?? '';
$action = $parts[1] ?? '';

// Route film requests
if ($resource === 'films') {
    if ($action === 'get' || $method === 'GET') {
        require_once __DIR__ . '/film/get-films.php';
    } else {
        require_once __DIR__ . '/film/film.php';
    }
}
// Route seance requests
elseif ($resource === 'seances') {
    require_once __DIR__ . '/seance/seances.php';
}
// Route reservation requests
elseif ($resource === 'reservations') {
    require_once __DIR__ . '/reservation/reservations.php';
}
// Route salle requests
elseif ($resource === 'salles') {
    require_once __DIR__ . '/salle/salles.php';
}
else {
    http_response_code(404);
    echo json_encode(['error' => 'Route not found']);
}
?>
