<?php
header('Content-Type: application/json'); // Tell the browser this is JSON
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "connect.php";

$Username = $_POST['name'];
$Email = $_POST['email'];
$Password = $_POST['password'];
$ConfirmPassword = $_POST['confirmpassword'];

// Check if passwords match
if ($Password !== $ConfirmPassword) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Passwords do not match'
    ]);
    exit;
}

// Check if username or email already exists
$sqlcheck = "SELECT * FROM login WHERE username = '$Username' OR email = '$Email'";
$result = mysqli_query($conn, $sqlcheck);

if (mysqli_num_rows($result) > 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Username or Email already exists'
    ]);
    exit;
}

// Insert new user
$sql = "INSERT INTO `login`(`username`, `email`, `password`) VALUES ('$Username','$Email','$Password')";
if (mysqli_query($conn, $sql)) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Signup successful!',
        'username' => $Username,
        'redirect_url' => 'dashboard2.html'
    ]);
    
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . mysqli_error($conn)
    ]);
}

mysqli_close($conn);
?>
