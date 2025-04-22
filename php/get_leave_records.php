<?php
include 'connect.php';

header('Content-Type: application/json');

$sql = "SELECT staff.name as staff_name, leave_records.start_date, leave_records.end_date FROM leave_records JOIN staff ON leave_records.staff_id = staff.id";
$result = $conn->query($sql);

$leaveRecords = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $leaveRecords[] = $row;
    }
}

echo json_encode($leaveRecords);

$conn->close();
?>