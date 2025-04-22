<?php
include "connect.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

$Username = $_POST['username'];
$NewPassword = $_POST['newpassword'];
$ConfirmPassword = $_POST['confirmpassword'];

$response = array();

if ($NewPassword == $ConfirmPassword) {
    $sql = "UPDATE `login` SET `password`='$ConfirmPassword' WHERE username = '$Username'";

    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Password updated successfully';
        $response['redirect_url'] = 'login.html';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Error updating password: ' . $conn->error;
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Passwords do not match';
}

header('Content-Type: application/json');
echo json_encode($response);
