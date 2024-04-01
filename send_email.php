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

        // Definieren Sie die E-Mail-Empfänger und Betreff
        $to = 'empfaenger@beispiel.de';
        $subject = 'Spielstand';

        // Verwenden Sie zusätzliche Header für Absenderinformationen etc.
        $headers = 'From: ausflug2024@melanie-bueckner.de' . "\r\n" .
                   'Reply-To: ausflug2024@gmail.com' . "\r\n" .
                   'X-Mailer: PHP/' . phpversion();

        // Versenden der E-Mail
        if (mail($to, $subject, $message, $headers)) {
            // Speichern der Daten in einer JSON-Datei
            $file_path = 'IMG/Spieldaten/spieldaten.json'; // Pfad zur JSON-Datei
            if (!file_exists(dirname($file_path))) {
                mkdir(dirname($file_path), 0777, true); // Erstellen des Verzeichnisses falls nicht vorhanden
            }
            file_put_contents($file_path, json_encode($tableData)); // Speichern der Daten

            echo json_encode(array("success" => true));
            exit;
        } else {
            echo json_encode(array("success" => false));
            exit;
        }
    } else {
        echo json_encode(array("success" => false, "error" => "Invalid data"));
        exit;
    }
}
?>