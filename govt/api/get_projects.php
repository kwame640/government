
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db_connect.php';

$base_url = 'http://localhost:8000/api/uploads/'; // Update this if your uploads folder is in a different location

try {
    $stmt = $pdo->prepare("SELECT id, title, description, year, image FROM projects ORDER BY id DESC");
    $stmt->execute();

    $projects = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Build image URL for frontend
        $image_filename = basename($row['image']);
        $ext = strtolower(pathinfo($image_filename, PATHINFO_EXTENSION));
        if ($ext === 'png' || $ext === 'jpg' || $ext === 'jpeg') {
            $image_path = __DIR__ . '/uploads/' . $image_filename;
            if (file_exists($image_path)) {
                $image_url = $base_url . $image_filename;
            } else {
                $image_url = $base_url . 'default.png'; // fallback image
            }
            $projects[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'description' => $row['description'],
                'year' => $row['year'],
                'image' => $image_url
            ];
        }
    }

    echo json_encode($projects);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch projects: ' . $e->getMessage()]);
}
