<?php
// Allow CORS for Angular frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'db_connect.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$admin_email = trim($input['admin_email'] ?? '');
$user_id = $input['user_id'] ?? null;

// Validate input
if (!$admin_email || !$user_id) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Missing required data: admin_email or user_id.'
    ]);
    exit;
}

// Check if requester is an admin
$stmt = $pdo->prepare("SELECT role FROM users WHERE email = ?");
$stmt->execute([$admin_email]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$admin || strtolower($admin['role']) !== 'admin') {
    echo json_encode([
        'success' => false,
        'message' => '❌ Access denied. Only admins can promote users.'
    ]);
    exit;
}

// Promote the user to admin and approve them
$updateStmt = $pdo->prepare("UPDATE users SET role = 'admin', status = 'approved' WHERE id = ?");
if ($updateStmt->execute([$user_id])) {
    echo json_encode([
        'success' => true,
        'message' => '✅ User successfully promoted to admin and approved.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => '❌ Failed to update user role.'
    ]);
}
?>
