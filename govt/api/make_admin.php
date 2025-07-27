<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db_connect.php'; // ✅ $pdo should be connected here

$data = json_decode(file_get_contents("php://input"), true);
$adminEmail = $data['admin_email'] ?? '';
$userId = $data['user_id'] ?? null;

if (!$adminEmail || !$userId) {
    echo json_encode(['success' => false, 'message' => 'Missing admin email or user ID.']);
    exit;
}

// ✅ Confirm the requester is an approved admin
$stmt = $pdo->prepare("SELECT role, status FROM users WHERE email = ?");
$stmt->execute([$adminEmail]);
$admin = $stmt->fetch();

if (!$admin || $admin['role'] !== 'admin' || $admin['status'] !== 'approved') {
    echo json_encode(['success' => false, 'message' => 'Access denied. Only admins can promote users.']);
    exit;
}

// ✅ Promote the user
$stmt = $pdo->prepare("UPDATE users SET role = 'admin', status = 'approved' WHERE id = ?");
$stmt->execute([$userId]);

echo json_encode(['success' => true, 'message' => 'User promoted to admin successfully.']);
