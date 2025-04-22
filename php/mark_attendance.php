<?php
include 'connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['staff_id']) && isset($_POST['date'])) {
        $date = mysqli_real_escape_string($conn, $_POST['date']);
        $present = isset($_POST['present']) ? mysqli_real_escape_string($conn, $_POST['present']) : '1'; // Default to '1' (present)

        if (is_array($_POST['staff_id'])) {
            foreach ($_POST['staff_id'] as $staff_id) {
                $staff_id = mysqli_real_escape_string($conn, $staff_id);

                // Fetch staff name
                $result = $conn->query("SELECT name FROM staff WHERE staff_id = '$staff_id'");
                $row = $result->fetch_assoc();

                // Insert with name
                $sql = "INSERT INTO attendance (staff_id, date, present) VALUES ('$staff_id', '$date', '$present')";

                if (!$conn->query($sql)) {
                    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
                    $conn->close();
                    exit;
                }
            }
            echo json_encode(["message" => "Attendance marked successfully"]);
        } else {
            echo json_encode(["error" => "Staff ID must be an array."]);
        }
    } else {
        echo json_encode(["error" => "Required parameters are not set."]);
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
?>
