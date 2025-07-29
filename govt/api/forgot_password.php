<?php
error_reporting(E_ERROR | E_PARSE); // Hide warnings/notices

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header("Content-Type: application/json");

include 'db_connect.php';
require_once 'email.php';  // ✅ Include reusable mail function


$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Email is required."]);
    exit;
}

// ✅ Check user
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(["success" => false, "message" => "No account found with that email."]);
    exit;
}

// ✅ Generate reset token
$token = bin2hex(random_bytes(32));
$expires = date("Y-m-d H:i:s", strtotime("+1 hour"));

$stmt = $pdo->prepare("UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?");
$stmt->execute([$token, $expires, $email]);

// ✅ Build reset link
$resetLink = "http://localhost:4200/reset-password?token=" . urlencode($token);


// ✅ Send using reusable function
$subject = "Password Reset Request";
$body = "
    <h3>Password Reset</h3>
    <p>Click the link below to reset your password:</p>
    <p><a href='$resetLink' style='background:#d00;color:#fff;padding:10px 20px;text-decoration:none;'>Reset Password</a></p>
    <p>If you didn't request this, ignore this email.</p>
";

$response = sendEmail($email, $subject, $body);
echo json_encode($response);
