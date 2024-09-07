<?php
$serverName = "localhost"; // Update this with your server name
$connectionOptions = array(
    "Database" => "bird",
    "Uid" => "your_username", // Update with your SQL Server username
    "PWD" => "your_password", // Update with your SQL Server password
    "CharacterSet" => "UTF-8"
);

// Establishes the connection
$conn = sqlsrv_connect($serverName, $connectionOptions);

if ($conn === false) {
    die(print_r(sqlsrv_errors(), true));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash the password

    $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    $params = array($name, $email, $password);

    $stmt = sqlsrv_query($conn, $sql, $params);

    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
    } else {
        // Redirect to the main.html page after successful registration
        header("Location: main.html");
        exit();
    }
}

// Close the connection
sqlsrv_close($conn);
?>
