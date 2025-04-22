<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "connect.php";

// Change from $_POST to $_GET
if (!isset($_GET['username'])) {
    echo json_encode(['status' => 'error', 'message' => 'Username not provided']);
    exit;
}

$Username = $_GET['username'];

$sql = "SELECT username, email FROM login WHERE `username` = '$Username'";
$result = mysqli_query($conn, $sql);

if ($result && mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    echo json_encode([
        'status' => 'success',
        'user' => $user
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
}
mysqli_close($conn);
?>
