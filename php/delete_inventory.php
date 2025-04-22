<?php
// filepath: /c:/xampp/htdocs/CAFE-ERP/php/delete_inventory.php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connect.php';

$itemName = $_GET['itemName'] ?? null;

if (!$itemName) {
    die(json_encode(['status' => 'error', 'message' => 'Item name is required']));
}

$sql = "DELETE FROM inventory WHERE item_name = '$itemName'";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['status' => 'success', 'message' => 'Item deleted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $sql . '<br>' . mysqli_error($conn)]);
}

mysqli_close($conn);
?>