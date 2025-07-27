<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Failed to decode JSON.'
    ]);
    exit;
}

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Email and password are required.'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, name, email, password, role, status FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            'success' => false,
            'message' => '❌ No account found with this email.'
        ]);
        exit;
    }

    if (!password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => false,
            'message' => '❌ Incorrect password.'
        ]);
        exit;
    }

    if (strtolower($user['status']) !== 'approved') {
        echo json_encode([
            'success' => false,
            'message' => '⏳ Your account is pending approval. Please wait for an admin.'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => "✅ Welcome back, {$user['name']}!",
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role']
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Database error: ' . $e->getMessage()
    ]);
}
