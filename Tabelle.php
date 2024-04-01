<?php 
require 'vendor/autoload.php'; 
use PhpOffice\PhpSpreadsheet\IOFactory; 
use PhpOffice\PhpSpreadsheet\Spreadsheet;

// Setzen des Content-Type-Headers auf application/json
header('Content-Type: application/json');

// Pfad zur Excel-Datei (geändert auf .xlsx)
$excelFile = __DIR__ . '/IMG/ExcelTabelle/Tabelle.xlsx';

// Daten aus POST-Request lesen (hier als JSON) 
$tableDataJson = file_get_contents('php://input');
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

    // Speichern der Excel-Datei im XLSX-Format
    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save($excelFile);

    echo json_encode(array("success" => true));
} else { 
    echo json_encode(array("success" => false, "error" => "No data provided"));
}
?>