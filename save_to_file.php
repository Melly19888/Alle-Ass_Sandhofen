<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $tableData = json_decode($input, true);

    if ($tableData) {
        $filePath = 'spielergebnisse.txt'; // Pfad zur Datei, in der die Daten gespeichert werden sollen

        // Überprüfen Sie, ob das Verzeichnis beschreibbar ist
        if (!is_writable(dirname($filePath))) {
            error_log("Das Verzeichnis ist nicht beschreibbar: " . dirname($filePath));
            echo json_encode(array('success' => false, 'error' => 'Das Verzeichnis ist nicht beschreibbar'));
            exit;
        }

        // Erstellen Sie die Datei, falls sie nicht existiert
        if (!file_exists($filePath)) {
            if (!touch($filePath)) {
                error_log("Fehler beim Erstellen der Datei: " . $filePath);
                echo json_encode(array('success' => false, 'error' => 'Fehler beim Erstellen der Datei'));
                exit;
            }
        }

        // Bereiten Sie den Inhalt vor
        $fileContent = "";
        foreach ($tableData as $row) {
            $fileContent .= "{$row['name']} | {$row['points']} | {$row['time']}\n";
        }

        // Schreiben Sie den Inhalt in die Datei und fügen Sie ihn hinzu
        if (file_put_contents($filePath, $fileContent, FILE_APPEND)) {
            echo json_encode(array('success' => true));
        } else {
            error_log("Fehler beim Speichern der Datei: " . $filePath);
            echo json_encode(array('success' => false, 'error' => 'Fehler beim Speichern der Datei'));
        }
    } else {
        error_log("Ungültige Daten empfangen: " . json_last_error_msg());
        error_log("Empfangene Eingabe: " . $input);
        echo json_encode(array('success' => false, 'error' => 'Ungültige Daten'));
    }
} else {
    error_log("Ungültige Anforderung: " . $_SERVER['REQUEST_METHOD']);
    echo json_encode(array('success' => false, 'error' => 'Ungültige Anforderung'));
}
?>