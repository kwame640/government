<?php
$host = 'localhost';
$port = 8080;
$db   = 'project';
$user = 'root';
$pass = 'kingRaymond@12345';

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // ✅ Don't echo anything here
} catch (PDOException $e) {
    // ❌ Only echo error if connection fails
    echo json_encode([
        "success" => false,
        "message" => "❌ Database connection failed: " . $e->getMessage()
    ]);
    exit;
}
?>
