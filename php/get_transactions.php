<?php
header('Content-Type: application/json');

include 'connect.php';

// Fetch transactions from the database
$sql = "SELECT orders.id, orders.customer_name, orders.total_amount, orders.created_at, 
        GROUP_CONCAT(CONCAT(order_items.item_name, ' (', order_items.item_option, ') - ', order_items.quantity, ' x ', order_items.item_price, ' = ', order_items.total) SEPARATOR ', ') AS order_items
        FROM orders
        JOIN order_items ON orders.id = order_items.order_id
        GROUP BY orders.id
        ORDER BY orders.created_at DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        $transactions[] = [
            'customerName' => $row['customer_name'],
            'orderItems' => explode(', ', $row['order_items']),
            'totalAmount' => $row['total_amount'],
            'date' => $row['created_at']
        ];
    }
    echo json_encode(['status' => 'success', 'transactions' => $transactions]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No transactions found.']);
}

$conn->close();
?>