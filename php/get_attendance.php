<?php
include 'connect.php';
header('Content-Type: application/json');

// Step 1: Get all staff
$staffResult = $conn->query("SELECT id, name FROM staff");
$staffList = [];
while ($row = $staffResult->fetch_assoc()) {
    $staffList[$row['id']] = $row['name'];
}

// Step 2: Get all unique attendance dates
$dateResult = $conn->query("SELECT DISTINCT date FROM attendance ORDER BY date");
$dateList = [];
while ($row = $dateResult->fetch_assoc()) {
    $dateList[] = $row['date'];
}

// Step 3: For each date, get present staff, and fill others as absent
$finalData = [];

foreach ($dateList as $date) {
    $attResult = $conn->query("SELECT staff_id, present FROM attendance WHERE date = '$date'");
    $presentMap = [];

    while ($row = $attResult->fetch_assoc()) {
        $presentMap[$row['staff_id']] = $row['present'];
    }

    foreach ($staffList as $staffId => $staffName) {
        $finalData[] = [
            'staff_name' => $staffName,
            'date' => $date,
            'present' => isset($presentMap[$staffId]) ? $presentMap[$staffId] : 0
        ];
    }
}

echo json_encode($finalData);
$conn->close();
?>
