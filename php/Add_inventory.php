<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'connect.php'; // Ensure database connection

// Retrieve form data
$itemId = $_POST['itemId'] ?? null;
$itemName = $_POST['itemName'] ?? null;
$category = $_POST['category'] ?? null;
$quantity = $_POST['quantity'] ?? null;
$minQuantity = $_POST['minQuantity'] ?? null;

$itemImage = $_FILES['itemImage']['name'];
$target_dir = "C:/xampp/htdocs/CAFE-ERP/upload/"; // Ensure this folder exists
$target_file = $target_dir . basename($itemImage);

// Ensure upload folder exists
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0777, true);
}

// Move uploaded file
if (move_uploaded_file($_FILES['itemImage']['tmp_name'], $target_file)) {
    $sql = "INSERT INTO inventory (item_id, item_name, category, quantity, min_quantity, item_image) 
            VALUES ('$itemId', '$itemName', '$category', '$quantity', '$minQuantity', '$target_file')";

    if (mysqli_query($conn, $sql)) {
        echo json_encode(array("status" => "success", "message" => "Item added successfully"));
    } else {
        echo json_encode(array("status" => "error", "message" => "Database error: " . mysqli_error($conn)));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Failed to upload image"));
}
?>
