<?php
// ✅ Allow requests from Angular app
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// ✅ Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once 'db_connect.php'; // Ensure $pdo is defined here

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $year = $_POST['year'] ?? '';

    // Validate required fields
    if (!$title || !$description || !$year || !isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    $file = $_FILES['file'];
    $uploadDir = 'uploads/';
    $filename = $file['name'];
    $uploadPath = $uploadDir . $filename;

    // Create uploads directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Move file and generate public URL
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        // Save only the image filename in the database
        $stmt = $pdo->prepare("INSERT INTO projects (title, description, year, image) VALUES (?, ?, ?, ?)");
        if ($stmt->execute([$title, $description, $year, $filename])) {
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
