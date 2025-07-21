<?php
header("Access-Control-Allow-Origin: *"); // Adjust for production (e.g., only your frontend domain)
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'db_connect.php'; // Ensure this has a valid $pdo instance

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $year = $_POST['year'] ?? '';

    // Validate fields
    if (!$title || !$description || !$year || !isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    $file = $_FILES['file'];
    $uploadDir = 'uploads/';
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('project_', true) . '.' . $ext;
    $uploadPath = $uploadDir . $filename;

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        $stmt = $pdo->prepare("INSERT INTO projects (title, description, year, image) VALUES (?, ?, ?, ?)");
        if ($stmt->execute([$title, $description, $year, $uploadPath])) {
            echo json_encode(['message' => 'Project uploaded successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Database insert failed']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload file']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST method allowed']);
}
