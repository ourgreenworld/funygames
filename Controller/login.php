<?php
session_start();
require_once '../db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userid = $_POST['userid'];
    $password = $_POST['password'];
    
    $sql = "SELECT userid, name, email, password FROM user WHERE userid = ? AND password = ?";
    
    if ($stmt = $mysqli->prepare($sql)) {
        $stmt->bind_param("ss", $userid, $password);
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            
            if ($result->num_rows == 1) {
                $user = $result->fetch_assoc();
                $_SESSION["loggedin"] = true;
                $_SESSION["userid"] = $user['userid'];
                $_SESSION["name"] = $user['name'];
                $_SESSION["email"] = $user['email'];
                
                header("Location: /funygames/index.html");
                exit();
            } else {
                $error = "Tên đăng nhập hoặc mật khẩu không đúng.";
            }
        } else {
            $error = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
        }

        $stmt->close();
    }
    
    $mysqli->close();

    if (isset($error)) {
        $_SESSION['login_error'] = $error;
        header("Location: ../Loginform.php");
        exit();
    }
} else {
    header("Location: ../Loginform.html");
    exit();
}
?>
