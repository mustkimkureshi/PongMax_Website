<?php
// filepath: /c:/xampp/htdocs/CAFE-ERP/php/get_inventory.php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connect.php';

$sql = "SELECT * FROM inventory";
$result = mysqli_query($conn, $sql);

if ($result) {
    $inventory = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $inventory[] = $row;
    }
    echo json_encode(['status' => 'success', 'inventory' => $inventory]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch inventory data']);
}

mysqli_close($conn);
?>