<?php
header('Content-Type: application/json');
include 'connect.php';

// Read the JSON input from JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// Validate data
if (!isset($data['customerName'], $data['orderItems'], $data['totalAmount'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

$customerName = $conn->real_escape_string($data['customerName']);
$totalAmount = floatval($data['totalAmount']);
$orderItems = $data['orderItems'];

// Step 1: Insert into orders table
$insertOrder = "INSERT INTO orders (customer_name, total_amount, created_at) VALUES ('$customerName', $totalAmount, NOW())";
if ($conn->query($insertOrder)) {
    $orderId = $conn->insert_id;

    // Step 2: Insert each item into order_items table
    $insertSuccess = true;
    foreach ($orderItems as $item) {
        $itemName = $conn->real_escape_string($item['name']);
        $itemOption = $conn->real_escape_string($item['option']);
        $quantity = intval($item['quantity']);
        $itemPrice = floatval($item['price']);
        $total = floatval($item['total']);

        $insertItem = "INSERT INTO order_items (order_id, item_name, item_option, quantity, item_price, total)
                       VALUES ($orderId, '$itemName', '$itemOption', $quantity, $itemPrice, $total)";
        if (!$conn->query($insertItem)) {
            $insertSuccess = false;
            break;
        }
    }

    if ($insertSuccess) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to insert order items.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to insert order.']);
}

$conn->close();
?>
