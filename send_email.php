<?php
// Stellen Sie sicher, dass die Anfrage per POST erfolgt
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sammeln Sie die Daten aus dem POST-Request
    $to = 'ausflug2024@gmail.com';
    $subject = 'Spiel Ergebnisse';
    $message = '';

    // Stellen Sie sicher, dass die Daten vorhanden sind
    if (isset($_POST['tableData'])) {
        $tableData = json_decode($_POST['tableData'], true);

        foreach ($tableData as $row) {
            $message .= "Name: " . $row['name'] . ", Punkte: " . $row['points'] . ", Zeit: " . $row['time'] . "\n";
        }

        // Verwenden Sie zusätzliche Header für Absenderinformationen etc.
        $headers = 'From: ausflug2024@melanie-bueckner.de' . "\r\n" .
                    'Reply-To: ausflug2024@gmail.com' . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();

        // Versenden der E-Mail
        if (mail($to, $subject, $message, $headers)) {
            echo json_encode(array("success" => true));
        } else {
            echo json_encode(array("success" => false));
        }
    } else {
        echo json_encode(array("success" => false, "error" => "No data provided"));
    }
} else {
    // Nicht erlaubte Anfragemethode
    header('HTTP/1.1 405 Method Not Allowed');
    exit();
}


require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

// Pfad zur Excel-Datei
$excelFile = __DIR__ . '/IMG/ExcelTabelle/Tabelle.xlt';

// Daten aus POST-Request lesen (hier als JSON)
$tableDataJson = $_POST['tableData'] ?? '';
$tableData = json_decode($tableDataJson, true);

if (!empty($tableData)) {
    // Spreadsheet-Objekt laden oder erstellen
    if (file_exists($excelFile)) {
        $spreadsheet = IOFactory::load($excelFile);
    } else {
        $spreadsheet = new Spreadsheet();
    }

    // Wählen Sie das Arbeitsblatt aus oder erstellen Sie ein neues
    $sheet = $spreadsheet->getActiveSheet();

    // Fügen Sie die Daten hinzu
    foreach ($tableData as $index => $rowData) {
        // Hier fügen wir die Daten ab Zeile 2 ein, Spalte A-C (1-3)
        $rowNumber = $index + 2; // Beginnen bei Zeile 2
        $sheet->setCellValue('A' . $rowNumber, $rowData['name']);
        $sheet->setCellValue('B' . $rowNumber, $rowData['points']);
        $sheet->setCellValue('C' . $rowNumber, $rowData['time']);
    }

    // Speichern der Excel-Datei
    $writer = IOFactory::createWriter($spreadsheet, 'xls');
    $writer->save($excelFile);

    echo json_encode(array("success" => true));
} else {
    echo json_encode(array("success" => false, "error" => "No data provided"));
}
?>