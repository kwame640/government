<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db_connect.php'; // This should set up your $pdo connection

try {
    $stmt = $pdo->query("SELECT email FROM newsletter ORDER BY id DESC");
    $emails = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($emails);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch emails: ' . $e->getMessage()]);
}
?>
