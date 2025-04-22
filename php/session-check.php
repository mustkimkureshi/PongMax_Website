<?php
session_start();

if (isset($_SESSION['username'])) {
    echo json_encode([
        'status' => 'success',
        'username' => $_SESSION['username'],
        'email' => $_SESSION['email'],
        'profile_pic' => 'http://localhost/CAFE-ERP/USERLOGO.png',
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No active session']);
}
?>
