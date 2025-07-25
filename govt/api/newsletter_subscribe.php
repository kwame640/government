<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

// Get email from request
$input = json_decode(file_get_contents("php://input"), true);
$email = $input["email"] ?? '';

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email"]);
    exit;
}

// Connect to database (PDO)
require_once 'db_connect.php';

try {
    $stmt = $pdo->prepare("INSERT INTO newsletter (email) VALUES (:email)");
    $stmt->bindParam(':email', $email);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Insert failed."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
