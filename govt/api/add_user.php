<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$adminEmail = $data['admin_email'] ?? '';
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'viewer';
$status = 'pending';

if (!$adminEmail || !$name || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

// ✅ Check admin privileges
$stmt = $pdo->prepare("SELECT role, status FROM users WHERE email = ?");
$stmt->execute([$adminEmail]);
$admin = $stmt->fetch();

if (!$admin || $admin['role'] !== 'admin' || $admin['status'] !== 'approved') {
    echo json_encode(['success' => false, 'message' => 'Access denied.']);
    exit;
}

// ✅ Prevent duplicate email
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'User already exists.']);
    exit;
}

// ✅ Insert user
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare("
    INSERT INTO users (name, email, password, role, status, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
");
$stmt->execute([$name, $email, $hashedPassword, $role, $status]);

echo json_encode(['success' => true, 'message' => 'User added successfully.']);
