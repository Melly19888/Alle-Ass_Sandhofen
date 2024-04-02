<?php
// Stellen Sie sicher, dass die Anfrage per POST erfolgt
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Lesen der rohen POST-Daten
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($data && isset($data['tableData'])) {
        $tableData = $data['tableData'];
        $message = ''; // Initialisieren der Nachricht Variable

        foreach ($tableData as $row) {
            $message .= "Name: " . $row['name'] . ", Punkte: " . $row['points'] . ", Zeit: " . $row['time'] . "\n";
        }

        // Pfad zur JSON-Datei
        $file_path = 'IMG/Spieldaten/spieldaten.json';

        // Lese vorhandene Daten aus der Datei
        if (file_exists($file_path)) {
            $existing_data = json_decode(file_get_contents($file_path), true);
            if (!is_array($existing_data)) {
                $existing_data = [];
            }
        } else {
            $existing_data = [];
        }

        // Füge neue Daten zu den vorhandenen Daten hinzu
        foreach ($tableData as $newRow) {
            array_push($existing_data, $newRow);
        }

        // Speichern der aktualisierten Daten in der Datei
        if (!file_exists(dirname($file_path))) {
            mkdir(dirname($file_path), 0777, true); // Erstellen des Verzeichnisses falls nicht vorhanden
        }

        file_put_contents($file_path, json_encode($existing_data));

        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false, "error" => "Invalid data"));
    }
}
?>