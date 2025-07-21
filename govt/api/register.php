<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require 'db_connect.php'; // includes $pdo

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Get raw input and decode JSON
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

// Extract and sanitize input
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Validate required fields
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

    // Hash and save password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $hashedPassword]);

    echo json_encode([
        'success' => true,
        'message' => "✅ $name registered successfully and saved!"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Database error: ' . $e->getMessage()
    ]);
}
?>
