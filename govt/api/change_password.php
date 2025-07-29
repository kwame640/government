<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

header("Content-Type: application/json");
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$oldPassword = $data['oldPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';

$stmt = $pdo->prepare("SELECT password FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($oldPassword, $user['password'])) {
    echo json_encode(["success" => false, "error" => "Old password is incorrect."]);
    exit;
}

$newHashed = password_hash($newPassword, PASSWORD_BCRYPT);

$update = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
if ($update->execute([$newHashed, $email])) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to update password."]);
}
