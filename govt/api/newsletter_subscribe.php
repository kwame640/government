<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Preflight
}

require_once 'db_connect.php';

$input = json_decode(file_get_contents("php://input"), true);
$email = $input["email"] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email"]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO newsletter (email) VALUES (:email)");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Subscription successful!"]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Duplicate entry
        echo json_encode(["success" => false, "message" => "Email already subscribed."]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error."]);
    }
}
