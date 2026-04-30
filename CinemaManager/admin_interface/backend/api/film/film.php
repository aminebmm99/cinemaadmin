<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../helpers.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $genre = isset($_GET['genre']) ? trim($_GET['genre']) : '';

    $sql = 'SELECT id, title, genre, duration_minutes, classification, synopsis, poster_url FROM films WHERE is_active = 1';

    if ($search != '') {
        $search = mysqli_real_escape_string($conn, $search);
        $sql .= " AND (title LIKE '%$search%' OR synopsis LIKE '%$search%')";
    }

    if ($genre != '') {
        $genre = mysqli_real_escape_string($conn, $genre);
        $sql .= " AND genre = '$genre'";
    }

    $sql .= ' ORDER BY created_at DESC';

    $result = mysqli_query($conn, $sql);

    while ($film = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $synopsis = $film['synopsis'] ? $film['synopsis'] : '-';
        $poster_cell = $film['poster_url'] 
            ? "<img src='" . htmlspecialchars($film['poster_url']) . "' alt='Affiche' style='width: 50px; height: 75px; object-fit: cover; border-radius: 4px;'>" 
            : "<div style='width: 50px; height: 75px; background: #eee; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 10px; color: #999;'>N/A</div>";
            
        echo "<tr>
            <td>$poster_cell</td>
            <td><strong>" . htmlspecialchars($film['title']) . "</strong></td>
            <td>" . htmlspecialchars($film['genre']) . "</td>
            <td>" . $film['duration_minutes'] . " min</td>
            <td>" . htmlspecialchars($film['classification']) . "</td>
            <td><div class='cell-preview'>" . nl2br(htmlspecialchars($synopsis)) . "</div></td>
            <td>
                <button class='btn btn-sm' onclick='editFilm(" . $film['id'] . ")'>Modifier</button>
                <button class='btn btn-sm btn-danger' onclick='deleteFilm(" . $film['id'] . ")'>Supprimer</button>
            </td>
        </tr>";
    }
    exit;
}

if ($method === 'POST') {
    $is_update = isset($_GET['id']);
    $id = $is_update ? (int)$_GET['id'] : 0;

    if ($is_update && $id <= 0) {
        echo "ERROR: Invalid ID";
        exit;
    }

    $required_fields = ['title', 'genre', 'duration_minutes', 'classification'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || trim((string)$_POST[$field]) === '') {
            echo "ERROR: Missing required field: " . $field;
            exit;
        }
    }

    $title = mysqli_real_escape_string($conn, trim((string)$_POST['title']));
    $genre = mysqli_real_escape_string($conn, trim((string)$_POST['genre']));
    $duration = (int)$_POST['duration_minutes'];
    $classification = mysqli_real_escape_string($conn, trim((string)$_POST['classification']));
    $synopsis = mysqli_real_escape_string($conn, trim((string)($_POST['synopsis'] ?? '')));

    $poster_url = '';
    $target_dir = __DIR__ . '/../../../../images/';
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    if (isset($_FILES['poster_file']) && $_FILES['poster_file']['error'] === UPLOAD_ERR_OK) {
        $file_tmp = $_FILES['poster_file']['tmp_name'];
        $file_name_original = $_FILES['poster_file']['name'];
        $file_ext = strtolower(pathinfo($file_name_original, PATHINFO_EXTENSION));
        
        $safe_title = preg_replace('/[^a-zA-Z0-9]+/', '_', strtolower(trim((string)$_POST['title'])));
        $safe_title = trim($safe_title, '_');
        if (empty($safe_title)) {
            $safe_title = 'film_' . time();
        }
        
        $new_file_name = $safe_title . '.' . $file_ext;
        $target_file = $target_dir . $new_file_name;
        
        if (move_uploaded_file($file_tmp, $target_file)) {
            $poster_url = '/CinemaManager/images/' . $new_file_name;
            $poster_url = mysqli_real_escape_string($conn, $poster_url);
        }
    }

    if ($is_update) {
        $poster_update_sql = "";
        if ($poster_url !== '') {
            $poster_update_sql = ", poster_url = '$poster_url'";
        }

        $sql = "UPDATE films 
                SET title = '$title', 
                    genre = '$genre', 
                    duration_minutes = $duration, 
                    classification = '$classification', 
                    synopsis = '$synopsis'
                    $poster_update_sql,
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id = $id AND is_active = 1";
    } else {
        $sql = "INSERT INTO films (title, genre, duration_minutes, classification, synopsis, poster_url)
                VALUES ('$title', '$genre', $duration, '$classification', '$synopsis', '$poster_url')";
    }

    if (mysqli_query($conn, $sql)) {
        echo "OK";
        exit;
    } else {
        echo "ERROR: " . mysqli_error($conn);
        exit;
    }
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        echo "ERROR: Invalid ID";
        exit;
    }

    $sql = "DELETE FROM films WHERE id = $id";

    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) > 0) {
            echo "OK";
        } else {
            echo "ERROR: Film not found";
        }
    } else {
        echo "ERROR: " . mysqli_error($conn);
    }
    exit;
}

// PUT method logic merged into POST above because PHP cannot natively parse multipart/form-data for PUT.

echo "ERROR: Method not allowed";
?>
