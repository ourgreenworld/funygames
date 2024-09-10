<?php
require_once 'db_connect.php';

try {
    $conn = connectDB();
    echo "Kết nối thành công!<br>";
    
    // Thử thực hiện một truy vấn đơn giản
    $stmt = $conn->query("SELECT 1");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo "Truy vấn thử nghiệm thành công.<br>";
    }
    
    // Hiển thị thông tin về phiên bản MySQL
    $stmt = $conn->query("SELECT VERSION() as version");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Phiên bản MySQL: " . $result['version'] . "<br>";
    
    // Hiển thị danh sách các bảng trong cơ sở dữ liệu
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($tables) > 0) {
        echo "Danh sách các bảng trong cơ sở dữ liệu:<br>";
        foreach ($tables as $table) {
            echo "- " . $table . "<br>";
        }
    } else {
        echo "Không có bảng nào trong cơ sở dữ liệu.<br>";
    }
    
} catch (PDOException $e) {
    die("Lỗi kết nối: " . $e->getMessage());
}