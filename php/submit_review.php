<?php
// filepath: /c:/xampp/htdocs/CAFE-ERP/php/submit_review.php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cafe erp";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
$name = isset($_POST['name']) ? $_POST['name'] : null;
$email = isset($_POST['email']) ? $_POST['email'] : null;
$rating = isset($_POST['rating']) ? $_POST['rating'] : null;
$comments = isset($_POST['comments']) ? $_POST['comments'] : null;

// Validate input
if (empty($name) || empty($email) || empty($rating) || empty($comments)) {
    $response = array("status" => "error", "message" => "All fields are required.");
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Use prepared statements to avoid SQL injection
$stmt = $conn->prepare("INSERT INTO `reviews` (`name`, `email`, `rating`, `comments`) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssis", $name, $email, $rating, $comments); // 'ssis' = string, string, integer, string

if ($stmt->execute()) {
    $response = array("status" => "success", "message" => "Thank you for your review!");
} else {
    $response = array("status" => "error", "message" => "Error: " . $stmt->error);
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
