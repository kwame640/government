<?php
// CORS headers to allow Angular frontend to access this API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// JSON response format
header('Content-Type: application/json');

include 'db_connect.php'; // assumes $pdo is defined via PDO

try {
    // ✅ Include the `status` field in the query
    $stmt = $pdo->query("SELECT id, name, email, role, status FROM users ORDER BY id DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
