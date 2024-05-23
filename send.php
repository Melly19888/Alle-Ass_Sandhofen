
<?php
if (isset($_POST['tableData'])) {
    $tableData = json_decode($_POST['tableData'], true);
    if ($tableData === null) {
        echo json_encode(array('success' => false, 'error' => 'Invalid JSON data'));
        exit;
    }

    $to = "ausflug2024@gmail.com";
    $subject = "Tabelle der Spielergebnisse";
    $message = "<html><body>";
    $message .= "<table border='1'>";
    $message .= "<tr><th>Name</th><th>Punkte</th><th>Zeit</th></tr>";

    foreach ($tableData as $row) {
        $message .= "<tr>";
        $message .= "<td>" . htmlspecialchars($row['name']) . "</td>";
        $message .= "<td>" . htmlspecialchars($row['points']) . "</td>";
        $message .= "<td>" . htmlspecialchars($row['time']) . "</td>";
        $message .= "</tr>";
    }

    $message .= "</table></body></html>";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(array('success' => true));
    } else {
        echo json_encode(array('success' => false));
    }
}
?>