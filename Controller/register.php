<?php
session_start();
require_once '../db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userid = $_POST['userid'];
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    // Check duplicate of userid and email
    $check_sql = "SELECT userid, name, email, password FROM user WHERE userid = ? OR email = ?";
    if ($check_stmt = $mysqli->prepare($check_sql)) {
        $check_stmt->bind_param("ss", $userid, $email);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if ($check_result->num_rows > 0) {
            $error = "Userid hoặc email đã tồn tại. Vui lòng chọn userid hoặc email khác.";
        } else {
            $sql = "INSERT INTO user (userid, name, email, password) VALUES (?, ?, ?, ?)";
            
            if ($stmt = $mysqli->prepare($sql)) {
                $stmt->bind_param("ssss", $userid, $name, $email, $password);
                
                if ($stmt->execute()) {
                    $_SESSION["loggedin"] = true;
                    $_SESSION["userid"] = $userid;
                    $_SESSION["name"] = $name;
                    $_SESSION["email"] = $email;
                    
                    header("Location: /funygames/index.html");
                    exit();
                } else {
                    $error = "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.";
                }

                $stmt->close();
            }
        }
        $check_stmt->close();
    }
    
    $mysqli->close();

    if (isset($error)) {
        $_SESSION['register_error'] = $error;
        header("Location: ../Loginform.php");
        exit();
    }
} else {
    header("Location: ../Loginform.html");
    exit();
}

?>