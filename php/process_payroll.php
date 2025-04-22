<?php
include 'connect.php';

if (isset($_POST['staff_id']) && isset($_POST['amount'])) {
    $staff_id = $_POST['staff_id'];
    $amount = $_POST['amount'];
    $date = date('Y-m-d');

    // Fetch staff name from staff table
    $name_query = "SELECT name FROM staff WHERE id = '$staff_id'";
    $name_result = mysqli_query($conn, $name_query);

    if ($name_result && mysqli_num_rows($name_result) > 0) {
        $row = mysqli_fetch_assoc($name_result);
        $staff_name = $row['name'];

        // Insert into payroll with staff_name
        $sql = "INSERT INTO payroll (staff_id, name, amount, date) 
                VALUES ('$staff_id', '$staff_name', '$amount', '$date')";
        
        if (mysqli_query($conn, $sql)) {
            echo "Payroll approved successfully for $staff_name";
        } else {
            echo "Error: " . mysqli_error($conn);
        }
    } else {
        echo "Staff not found.";
    }
} else {
    echo "Missing required fields.";
}
?>
