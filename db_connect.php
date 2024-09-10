<?php
$host = 'localhost'; // IP Database
$username = 'root'; // Database user
$password = '12345'; // Database password
$database = 'Bird'; // Database name

// Make Connection
$mysqli = new mysqli($host, $username, $password, $database);

// Check Connection
if ($mysqli->connect_error) {
    die("Database connection failed: " . $mysqli->connect_error);
}
?>