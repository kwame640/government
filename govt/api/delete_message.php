<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


header("Content-Type: application/json");
include 'db_connect.php'; // Make sure $pdo is defined here

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode([
        "success" => false,
        "error" => "No ID provided"
    ]);
    exit;
}

$id = intval($data['id']);

try {
    $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = ?");
    $stmt->execute([$id]);

    $deletedRows = $stmt->rowCount();

    if ($deletedRows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Message deleted successfully."
        ]);
    } else {
        // Gracefully handle case where no row matched
        echo json_encode([
            "success" => true,
            "message" => "No message found with that ID (it may have been already deleted)."
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
