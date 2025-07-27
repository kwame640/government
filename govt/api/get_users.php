<?php
// Allow CORS for Angular frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, admin-email");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header("Content-Type: application/json");
require_once 'db_connect.php';

// Get raw POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['admin_email'])) {
    echo json_encode(["success" => false, "message" => "Admin email required."]);
    exit;
}

$admin_email = $data['admin_email'];

// Fetch users if email is valid
$stmt = $pdo->prepare("SELECT * FROM users WHERE role != 'admin'");
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "users" => $users]);
?>
