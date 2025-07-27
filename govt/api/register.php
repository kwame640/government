<?php
// Allow CORS and headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require 'db_connect.php';

// Get and decode input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => '❌ Failed to decode JSON.']);
    exit;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Basic validation
if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => '❌ Name, email, and password are required.']);
    exit;
}

// Password strength check
$validPassword = preg_match('@[A-Z]@', $password) &&
                 preg_match('@[a-z]@', $password) &&
                 preg_match('@[0-9]@', $password) &&
                 preg_match('@[^\w]@', $password) &&
                 strlen($password) >= 8;

if (!$validPassword) {
    echo json_encode(['success' => false, 'message' => '❌ Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.']);
    exit;
}

try {
    // Check if email already exists
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);

    if ($checkStmt->fetch()) {
        echo json_encode(['success' => false, 'message' => '❌ Email already registered.']);
        exit;
    }

    // First registered user becomes admin
    $adminCheck = $pdo->query("SELECT COUNT(*) FROM users");
    $isFirstUser = $adminCheck->fetchColumn() == 0;

    $role = $isFirstUser ? 'admin' : 'viewer';
    $status = $isFirstUser ? 'approved' : 'pending';

    // Insert new user
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $hashedPassword, $role, $status]);

    echo json_encode([
        'success' => true,
        'message' => "✅ $name registered successfully as $role and is $status."
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => '❌ Database error: ' . $e->getMessage()]);
}
