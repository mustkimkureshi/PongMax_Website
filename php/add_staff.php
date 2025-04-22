<?php
include 'connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['staff-name'])) {
        $name = mysqli_real_escape_string($conn, $_POST['staff-name']);

        $sql = "INSERT INTO staff (name) VALUES ('$name')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "New staff member added successfully"]);
        } else {
            echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
        }

        $conn->close();
    } else {
        echo json_encode(["error" => "Staff name is not set."]);
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
?>