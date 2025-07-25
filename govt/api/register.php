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

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($name) || empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Name, email, and password are required.'
    ]);
    exit;
}

// Validate password strength
$uppercase = preg_match('@[A-Z]@', $password);
$lowercase = preg_match('@[a-z]@', $password);
$number    = preg_match('@[0-9]@', $password);
$special   = preg_match('@[^\w]@', $password);
$length    = strlen($password) >= 8;

if (!$uppercase || !$lowercase || !$number || !$special || !$length) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
    ]);
    exit;
}

try {
    // Check if email is already registered
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);

    if ($checkStmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => '❌ Email already registered.'
        ]);
        exit;
    }

    // Determine role and status
    $adminCheck = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    $adminExists = $adminCheck->fetchColumn();

    $role = $adminExists ? 'viewer' : 'admin';
    $status = $adminExists ? 'pending' : 'approved';

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $hashedPassword, $role, $status]);

    echo json_encode([
        'success' => true,
        'message' => "✅ $name registered successfully as $role and is $status."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Database error: ' . $e->getMessage()
    ]);
}
