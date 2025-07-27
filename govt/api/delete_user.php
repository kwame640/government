<?php
// 🔐 Allow cross-origin requests (update '*' to specific domain in production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 🔁 Handle CORS preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ⛓ Include DB connection
require 'db_connect.php';
header('Content-Type: application/json');

// ✅ Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// 📦 Parse JSON input
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['user_id'], $data['admin_email'])) {
    echo json_encode(['success' => false, 'message' => 'Missing user_id or admin_email']);
    exit;
}

$userId = (int) $data['user_id'];
$adminEmail = trim($data['admin_email']);

// 🔍 Check admin role
try {
    $stmt = $pdo->prepare("SELECT id, role FROM users WHERE email = ?");
    $stmt->execute([$adminEmail]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$admin || strtolower($admin['role']) !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Access denied. Only admins can delete users.']);
        exit;
    }

    // 🗑 Delete user
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$userId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'User deleted successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found or already deleted.']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
