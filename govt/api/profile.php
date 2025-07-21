<?php
header('Content-Type: application/json');
include 'db_connect.php'; // This connects using PDO and defines $pdo

// Get the email from the query string
$email = $_GET['email'] ?? '';

if (!$email) {
    echo json_encode(['error' => 'No email provided']);
    exit;
}

try {
    // ✅ Use $pdo instead of $conn
    $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();

    // Fetch the user
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
