<?php
include('db.php');

$query = "SELECT username, score FROM users ORDER BY score DESC LIMIT 10";
$result = mysqli_query($conn, $query);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bảng Xếp Hạng</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Bảng Xếp Hạng</h1>
    <table>
        <tr>
            <th>Người Chơi</th>
            <th>Điểm Cao</th>
        </tr>
        <?php while ($row = mysqli_fetch_assoc($result)): ?>
        <tr>
            <td><?= $row['username']; ?></td>
            <td><?= $row['score']; ?></td>
        </tr>
        <?php endwhile; ?>
    </table>
    <a href="index.html">Quay lại chơi</a>
</body>
</html>
