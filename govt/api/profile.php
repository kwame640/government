<?php
// ✅ Allow requests from Angular (CORS fix)
header("Access-Control-Allow-Origin: *"); // For local dev; replace * with http://localhost:4200 for tighter security
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// ✅ Set JSON response
header('Content-Type: application/json');

include 'db_connect.php'; // Connects using PDO and defines $pdo

// ✅ Get the email from the query string
$email = $_GET['email'] ?? '';

if (!$email) {
    echo json_encode(['error' => 'No email provided']);
    exit;
}

try {
    // ✅ Now includes 'role' to support admin-only access in Angular
    $stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();

    // ✅ Fetch and return user details
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode($user);
    } else {
        echo json_encode(['error' => 'User not found']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
