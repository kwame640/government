<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

header("Content-Type: application/json");
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$token = trim($data['token'] ?? '');
$newPassword = trim($data['password'] ?? '');

if (empty($token) || empty($newPassword)) {
    echo json_encode(["success" => false, "message" => "Invalid request."]);
    exit;
}

// ✅ Check token validity
$stmt = $pdo->prepare("SELECT id, reset_expires FROM users WHERE reset_token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => false, "message" => "Invalid or expired token."]);
    exit;
}

// ✅ Check expiration
if (strtotime($user['reset_expires']) < time()) {
    echo json_encode(["success" => false, "message" => "Token has expired."]);
    exit;
}

// ✅ Update password & clear token
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?");
$stmt->execute([$hashedPassword, $user['id']]);

echo json_encode(["success" => true, "message" => "Password has been reset successfully."]);
