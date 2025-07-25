<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

define('SITE_URL', 'http://localhost:8000');
define('UPLOADS_DIR', __DIR__ . '/../uploads/');
define('UPLOADS_URL', SITE_URL . '/uploads');

$imageFilename = $_POST['image'] ?? 'project_sample.jpg';
$imageURL = UPLOADS_URL . '/' . $imageFilename;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'your-email@gmail.com';
    $mail->Password   = 'your-app-password';
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    $mail->setFrom('your-email@gmail.com', 'Project Upload');
    $mail->addAddress('recipient@example.com', 'User');

    $mail->isHTML(true);
    $mail->Subject = 'New Project Uploaded';
    $mail->Body = "
        <h3>New Project Uploaded</h3>
        <p>Your project has been successfully uploaded to the system.</p>
        <p><strong>Image Preview:</strong></p>
        <img src='$imageURL' alt='Uploaded Image' style='max-width:300px;'>
    ";

    $mail->send();
    echo json_encode(['status' => 'success', 'message' => 'Email sent']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $mail->ErrorInfo]);
}
