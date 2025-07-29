<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

// ✅ Keep these constants as requested
define('SITE_URL', 'http://localhost:8000');
define('UPLOADS_DIR', __DIR__ . '/../uploads/');
define('UPLOADS_URL', SITE_URL . '/uploads');

function sendEmail($to, $subject, $body) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'enterprisekiln@gmail.com';     // ✅ Your Gmail
        $mail->Password   = 'sqkq vopb flyg qsgv';          // ✅ Your App Password
        $mail->SMTPSecure = 'ssl';                          // ✅ Use SSL
        $mail->Port       = 465;                            // ✅ Use port 465

        $mail->setFrom('enterprisekiln@gmail.com', 'Kiln Enterprise');
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;

        $mail->send();
        return ["success" => true, "message" => "Email sent"];
    } catch (Exception $e) {
        return ["success" => false, "message" => "Mailer Error: " . $mail->ErrorInfo];
    }
}
