<?php
    header('Content-Type: application/json');
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    
        $servername="localhost";
        $username="root";
        $password="";
        $database="cafe erp";

        $conn=mysqli_connect($servername,$username,$password,$database);

        if(!$conn){
                die(json_encode(['status'=> 'error','message' => 'Database connection failed']));
        }
?>