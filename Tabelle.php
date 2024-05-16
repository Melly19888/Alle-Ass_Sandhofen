<?php
// Setzen des Content-Type-Headers auf application/json
header('Content-Type: application/json');

// Pfad zur JSON-Datei
$jsonFile = __DIR__ . '/IMG/Spieldaten/spieldaten.json';

// Daten aus POST-Request lesen (hier als JSON)
$tableDataJson = file_get_contents('php://input');
$tableData = json_decode($tableDataJson, true);

// Überprüfen, ob das Decodieren erfolgreich war
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(array("success" => false, "error" => "JSON decode error: " . json_last_error_msg()));
    exit;
}

if (!empty($tableData)) {
    // Überprüfen, ob die Datei existiert und lesbar ist
    if (file_exists($jsonFile)) {
        $existingData = json_decode(file_get_contents($jsonFile), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(array("success" => false, "error" => "Error reading existing JSON data: " . json_last_error_msg()));
            exit;
        }
    } else {
        $existingData = [];
    }

    // Fügen Sie die neuen Daten hinzu
    $existingData = array_merge($existingData, $tableData);

    // Speichern der kombinierten Daten in der JSON-Datei
    try {
        file_put_contents($jsonFile, json_encode($existingData));
        echo json_encode(array("success" => true));
    } catch (Exception $e) {
        echo json_encode(array("success" => false, "error" => "Error saving file: " . $e->getMessage()));
    }
} else {
    echo json_encode(array("success" => false, "error" => "No data provided"));
}
?>