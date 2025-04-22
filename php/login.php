<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "connect.php";

$Username = $_POST['username'];
$Password = $_POST['password'];

$sql = "SELECT * FROM `login` WHERE `username` = '$Username' AND `password` = '$Password'";
$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database query error: ' . mysqli_error($conn)
    ]);
    exit;
}

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'username' => $user['username'],
        'redirect_url' => 'dashboard2.html'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid username or password'
    ]);
}
mysqli_close($conn);
?>
