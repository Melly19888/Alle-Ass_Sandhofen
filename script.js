const SpielStarten = document.getElementById('SpielStarten');
let player1Points = 0;
let rolesChosenFlag = false;

document.getElementById("Datenlöschen").style.display = "block";
document.getElementById("StädteQuiz").style.display = "none";
document.getElementById("Memory").style.display = "none";
document.getElementById("Absenden").style.display = "none";
document.getElementById("BilderRaetsel").style.display = "none";
		document.getElementById("AllgemeineQuiz").style.display = "none";

function showCustomPopup(message) {
    const popup = document.createElement("div");
    popup.classList.add("custom-popup");
    popup.textContent = message;

    document.body.appendChild(popup);

    // Zentriere das Popup-Fenster auf dem Bildschirm
    popup.style.top = `${(window.innerHeight - popup.offsetHeight) / 2}px`;
    popup.style.left = `${(window.innerWidth - popup.offsetWidth) / 2}px`;

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 5000); // Schließe das Popup nach 5 Sekunden automatisch
}

SpielStarten.addEventListener('click', function(event) {
    const player1NameInput = document.getElementById("player1Name");

    if (!rolesChosenFlag && (player1NameInput.value !== "" )) {
        rolesChosenFlag = true;

        player1NameInput.readOnly = true;
		 // Speichern Sie den Namen des Spielers in localStorage
        localStorage.setItem('playerName', player1NameInput.value);
		
		document.getElementById("BilderRaetsel").style.display = "block";
		document.getElementById("AllgemeineQuiz").style.display = "block";
        document.getElementById("StädteQuiz").style.display = "block";
        document.getElementById("Memory").style.display = "block";
		document.getElementById("Absenden").style.display = "block";

        SpielStarten.style.display = "none";

        // Füge den Namen des Spielers in die Tabelle ein
        const tableBody = document.querySelector("#spielerTabelle tbody") || document.querySelector("#spielerTabelle");

        let newRow = tableBody.insertRow();

        let nameCell = newRow.insertCell(0);
        let pointsCell = newRow.insertCell(1);
        let timeCell = newRow.insertCell(2);

        nameCell.textContent = player1NameInput.value;

        // Setze Punkte und Zeit auf Standardwerte oder leere Strings
        pointsCell.textContent = '0';
        timeCell.textContent = '';
		
    } else {
       showCustomPopup("Bitte geben deinen Namen ein.");
   }
});
function insertPlayerData() {
  let moves = localStorage.getItem('memoryGameMoves');
  let time = localStorage.getItem('memoryGameTime');
  if (moves && time) {
    let playerNameCell = document.getElementById('spielerName');
    let pointsCell = document.getElementById('punkte');
    let timeCell = document.getElementById('zeit');
    let playerName = localStorage.getItem('playerName'); // Angenommen, dieser Wert wurde ebenfalls gespeichert

    // Überprüfen, ob der Spielername bereits in der Tabelle vorhanden ist
    if (!playerNameCell.textContent.includes(playerName)) {
      playerNameCell.textContent += `, ${playerName}`;
    }

    // Setzen Sie Punkte und Zeit auf Standardwerte oder leere Strings
    pointsCell.textContent = moves;
    timeCell.textContent = time;
  }
}
// Aufruf der Funktion beim Laden der Seite
window.addEventListener('load', insertPlayerData);
document.getElementById("Memory").addEventListener("click", function() {
	document.getElementById("Memory").style.display = "none";
});

document.getElementById("StädteQuiz").addEventListener("click", function() {
	document.getElementById("StädteQuiz").style.display = "none";	
});
	const table = document.getElementById('spielerTabelle'); // Ersetzen Sie dies durch die tatsächliche ID Ihrer Tabelle
    const rows = table.rows;
    let tableData = [];

    for (let i = 0; i < rows.length; i++) {
        let rowData = [];
        for (let j = 0; j < rows[i].cells.length; j++) {
            rowData.push(rows[i].cells[j].textContent);
        }
        tableData.push(rowData.join(' | '));
    }
function updatePlayerData() {
  let moves = localStorage.getItem('memoryGameMoves');
  let time = localStorage.getItem('memoryGameTime');
  let playerName = localStorage.getItem('playerName');
  if (moves && time && playerName) {
    let playerNameCell = document.getElementById('spielerName');

    // Überprüfen, ob der Spielername bereits in der Tabelle vorhanden ist
    if (!playerNameCell.textContent.includes(playerName)) {
      playerNameCell.textContent += `, ${playerName}`;
    }

    document.getElementById('punkte').textContent = moves;
    document.getElementById('zeit').textContent = time;
  }
}

// Funktion zum Aktualisieren der Tabelle alle 3 Sekunden
function startTableUpdateInterval() {
    setInterval(updatePlayerData, 3000); // Aktualisiere alle 3000ms (3 Sekunden)
	 updatePlayerData(); // Initialer Aufruf, um die Daten sofort beim Laden anzuzeigen
	 }

// Starte das Intervall beim Laden der Seite
window.addEventListener('load', function() {
     // Initialer Aufruf, um die Daten sofort beim Laden anzuzeigen
    startTableUpdateInterval(); // Starte das regelmäßige Aktualisierungsintervall
	
	
});

function saveTableData() {
    const table = document.getElementById('spielerTabelle');
    const rows = table.rows;
    let tableData = [];

    for (let i = 1; i < rows.length; i++) { // Start bei 1, um Überschriften zu überspringen
        const cells = rows[i].cells;
        let rowData = {
            name: cells[0].textContent,
            points: cells[1].textContent,
            time: cells[2].textContent
        };
        tableData.push(rowData);
    }

    localStorage.setItem('tableData', JSON.stringify(tableData));
}
function restoreTableData() {
    const tableDataString = localStorage.getItem('tableData');
    if (tableDataString) {
        const tableBody = document.querySelector('#spielerTabelle tbody');
        const tableData = JSON.parse(tableDataString);

        // Löschen Sie alle vorhandenen Zeilen im tbody, bevor Sie neue hinzufügen
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        // Fügen Sie jede gespeicherte Zeile zur Tabelle hinzu
        for (const rowData of tableData) {
            const row = tableBody.insertRow();

            const cellName = row.insertCell(0);
            cellName.textContent = rowData.name;

            const cellPoints = row.insertCell(1);
            cellPoints.textContent = rowData.points;

            const cellTime = row.insertCell(2);
            cellTime.textContent = rowData.time;
        }
    }
}

// Event-Listener für das Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
    restoreTableData();
});

// Optional: Event-Listener für das Speichern der Daten vor dem Verlassen der Seite
window.addEventListener('beforeunload', function() {
    saveTableData();
});
function addPlayerToTable(playerName) {
    const tableBody = document.querySelector("#spielerTabelle tbody") || document.querySelector("#spielerTabelle");
    let newRow = tableBody.insertRow();

    let nameCell = newRow.insertCell(0);
    let pointsCell = newRow.insertCell(1);
    let timeCell = newRow.insertCell(2);

    // Verwenden Sie Klassen statt IDs
    nameCell.className = 'spieler-name';
    pointsCell.className = 'spieler-punkte';
    timeCell.className = 'spieler-zeit';

    nameCell.textContent = playerName;
    pointsCell.textContent = '0'; // Initialwert für Punkte
    timeCell.textContent = ''; // Initialwert für Zeit

    saveTableData(); // Speichern Sie die aktualisierte Tabelle
}

function updatePlayerData() {
  let moves = localStorage.getItem('memoryGameMoves');
  let time = localStorage.getItem('memoryGameTime');
  let playerName = localStorage.getItem('playerName');

  if (moves && time && playerName) {
    const tableBody = document.querySelector("#spielerTabelle tbody") || document.querySelector("#spielerTabelle");

    // Finden Sie die Zeile des Spielers basierend auf dem Namen
    for (let row of tableBody.rows) {
      if (row.cells[0].textContent === playerName) {
        row.cells[1].textContent = moves; // Aktualisieren der Punkte
        row.cells[2].textContent = time; // Aktualisieren der Zeit
        break; // Beenden der Schleife nach dem Finden des Spielers
      }
    }

    saveTableData(); // Speichern der aktualisierten Tabelle
  }
}

// Beim Laden der Seite:
document.addEventListener('DOMContentLoaded', function() {
    restoreTableData();
});

// Optional: Event-Listener für das Speichern der Daten vor dem Verlassen der Seite
window.addEventListener('beforeunload', function() {
    saveTableData();
});
function clearTableData() {
    localStorage.removeItem('tableData'); // Entfernen Sie die Daten aus dem localStorage

    // Optional: Entfernen Sie alle Zeilen aus dem Table Body im DOM
    const tableBody = document.querySelector('#spielerTabelle tbody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
}
document.getElementById("Datenlöschen").addEventListener("click", function() {
    const tableDataString = localStorage.getItem('tableData');

    if (tableDataString) {
        fetch('send_email.php', { // Pfad zu Ihrem PHP-Skript
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'tableData=' + encodeURIComponent(tableDataString)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Email sent successfully');
            } else {
                console.error('Error sending email');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});

document.getElementById("Absenden").addEventListener("click", function() {
    const table = document.getElementById('spielerTabelle');
    const rows = table.rows;
    let tableData = [];

    for (let i = 0; i < rows.length; i++) { // Start bei 1, um Überschriften zu überspringen
        const cells = rows[i].cells;
        let rowData = {
            name: cells[0].textContent,
            points: cells[1].textContent,
            time: cells[2].textContent
        };
        tableData.push(rowData);
    }

    fetch('send_email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Änderung zu application/json
        },
        body: JSON.stringify({tableData: tableData}) // Senden als JSON-Objekt
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Daten erfolgreich gespeichert');
            // Weitere Aktionen...
        } else {
            console.error('Fehler beim Speichern der Daten in Jsondatei:', data.error || 'Unbekannter Fehler');
            // Fehlerbehandlung...
        }
    })
    .catch((error) => {
        console.error('Fehler:', error);
    });
});