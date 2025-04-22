<?php
// filepath: /C:/xampp/htdocs/CAFE-ERP/php/place_order.php
header('Content-Type: application/json');
include 'connect.php';

// Decode the order data from the POST request
$orderData = isset($_POST['order']) ? json_decode($_POST['order'], true) : null;
$customerName = isset($_POST['customerName']) ? $_POST['customerName'] : 'Customer';

if (!$orderData) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid order data']);
    exit;
}

$totalAmount = array_sum(array_column($orderData, 'total'));

// Insert the overall order into the orders table
$sql = "INSERT INTO orders (customer_name, total_amount) VALUES ('$customerName', '$totalAmount')";
if (mysqli_query($conn, $sql)) {
    $orderId = mysqli_insert_id($conn);

    // Insert each item in the order into the order_items table
    foreach ($orderData as $item) {
        $itemName = $item['name'];
        $itemOption = $item['option'];
        $itemPrice = $item['price'];
        $itemQuantity = $item['quantity'];
        $itemTotal = $item['total'];

        $sql = "INSERT INTO order_items (order_id, item_name, item_option, item_price, item_quantity, item_total) VALUES ('$orderId', '$itemName', '$itemOption', '$itemPrice', '$itemQuantity', '$itemTotal')";
        if (!mysqli_query($conn, $sql)) {
            error_log("Error inserting order item: " . mysqli_error($conn));
            echo json_encode(['status' => 'error', 'message' => 'Failed to insert order item']);
            exit;
        }
    }

    echo json_encode(['status' => 'success', 'message' => 'Order placed successfully']);
} else {
    error_log("Error inserting order: " . mysqli_error($conn));
    echo json_encode(['status' => 'error', 'message' => 'Failed to place order']);
}

mysqli_close($conn);
?>