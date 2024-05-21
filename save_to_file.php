<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $tableData = json_decode($input, true);

    if ($tableData) {
        $filePath = 'spielergebnisse.txt'; // Pfad zur Datei

        // Überprüfen ob das Verzeichnis beschreibbar ist
        if (!is_writable(dirname($filePath))) {
            error_log("Das Verzeichnis ist nicht beschreibbar: " . dirname($filePath));
            echo json_encode(array('success' => false, 'error' => 'Das Verzeichnis ist nicht beschreibbar'));
            exit;
        }

        // Datei erstellen falls sie nicht existiert
        if (!file_exists($filePath)) {
            if (!touch($filePath)) {
                error_log("Fehler beim Erstellen der Datei: " . $filePath);
                echo json_encode(array('success' => false, 'error' => 'Fehler beim Erstellen der Datei'));
                exit;
            }
        }

        // Inhalt vorbereiten
        $fileContent = "";
        foreach ($tableData as $row) {
            $fileContent .= "{$row['name']} | {$row['points']} | {$row['time']}\n";
        }

        // Inhalt in die Datei schreiben und anhängen
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