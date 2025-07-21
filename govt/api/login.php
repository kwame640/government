<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'db_connect.php'; // Includes $pdo

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Failed to decode JSON.',
        'raw_input' => $input
    ]);
    exit;
}

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Validate input
if (empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Email and password are required.'
    ]);
    exit;
}

try {
    // Find user
    $stmt = $pdo->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            'success' => false,
            'message' => '❌ No account found with this email.'
        ]);
        exit;
    }

    // Verify password
    if (!password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => false,
            'message' => '❌ Incorrect password.'
        ]);
        exit;
    }

    // Success: return full user info
    echo json_encode([
        'success' => true,
        'message' => "✅ Welcome back, {$user['name']}!",
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email']
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Database error: ' . $e->getMessage()
    ]);
}
