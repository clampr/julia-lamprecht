<?php
declare(strict_types=1);

// CORS – allow same-origin only in production; relax for local dev
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://julia-lamprecht.com', 'https://www.julia-lamprecht.com'];
if (in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} elseif ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_NAME'] === 'php') {
    header('Access-Control-Allow-Origin: *');
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit;
}

$name    = trim((string)($data['name']    ?? ''));
$email   = trim((string)($data['email']   ?? ''));
$message = trim((string)($data['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

// Sanitise for use in mail headers
$name    = mb_substr(preg_replace('/[\r\n\t]/', '', $name), 0, 120);
$email   = mb_substr($email, 0, 254);
$message = mb_substr($message, 0, 4000);

$to      = 'mail@julia-lamprecht.com'; // ← change to the real mailbox
$subject = '=?UTF-8?B?' . base64_encode('Kontaktanfrage von ' . $name) . '?=';
$body    = "Name:    {$name}\nE-Mail:  {$email}\n\nNachricht:\n{$message}";
$headers = implode("\r\n", [
    'From: noreply@julia-lamprecht.com',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . PHP_VERSION,
]);

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Mail delivery failed']);
}
