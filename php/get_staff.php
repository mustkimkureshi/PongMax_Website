<?php
include 'connect.php';

header('Content-Type: application/json');

$sql = "SELECT id, name FROM staff";
$result = $conn->query($sql);

$staffMembers = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $staffMembers[] = $row;
    }
}

echo json_encode($staffMembers);

$conn->close();
?>