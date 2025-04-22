<?php
include 'connect.php';

header('Content-Type: application/json');

$sql = "SELECT staff.name as staff_name, payroll.amount, payroll.date FROM payroll JOIN staff ON payroll.staff_id = staff.id";
$result = $conn->query($sql);

$payrollRecords = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $payrollRecords[] = $row;
    }
}

echo json_encode($payrollRecords);

$conn->close();
?>