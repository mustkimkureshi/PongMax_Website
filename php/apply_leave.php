<?php
include 'connect.php';
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['staff_id']) && isset($_POST['start_date']) && isset($_POST['end_date'])) {
        $staff_id = mysqli_real_escape_string($conn, $_POST['staff_id']);
        $start_date = mysqli_real_escape_string($conn, $_POST['start_date']);
        $end_date = mysqli_real_escape_string($conn, $_POST['end_date']);

        $sql = "INSERT INTO leave_records (staff_id, start_date, end_date) VALUES ('$staff_id', '$start_date', '$end_date')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Leave applied successfully"]);
        } else {
            echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
        }

        $conn->close();
    } else {
        echo json_encode(["error" => "Required parameters are not set."]);
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
?>