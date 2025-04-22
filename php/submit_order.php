<?php
header('Content-Type: application/json');

include 'connect.php';
// Get the JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

$customerName = $data['customerName'];
$orderItems = $data['orderItems'];
$totalAmount = $data['totalAmount'];

// Validate input
if (empty($customerName) || empty($orderItems) || empty($totalAmount)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

// Insert order into the database
$stmt = $conn->prepare("INSERT INTO orders (customer_name, total_amount) VALUES (?, ?)");
$stmt->bind_param("sd", $customerName, $totalAmount);

if ($stmt->execute()) {
    $orderId = $stmt->insert_id;

    // Insert order items into the database
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, item_name, item_option, item_price, quantity, total) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($orderItems as $item) {
        $stmt->bind_param("issdii", $orderId, $item['name'], $item['option'], $item['price'], $item['quantity'], $item['total']);
        $stmt->execute();
    }

    echo json_encode(['status' => 'success', 'message' => 'Order placed successfully!']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to place order: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>