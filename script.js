const SpielStarten = document.getElementById('SpielStarten');
let player1Points = 0;
let rolesChosenFlag = false;
let clickedButtonsCount = 0;
const totalButtonsToClick = 4; // Anzahl der zu klickenden Buttons

document.getElementById("Datenlöschen").style.display = "block";
document.getElementById("StädteQuiz").style.display = "none";
document.getElementById("Memory").style.display = "none";
document.getElementById("Absenden").style.display = "none";
document.getElementById("BilderRaetsel").style.display = "none";
document.getElementById("AllgemeineQuiz").style.display = "none";
document.getElementById("Datenreinigen").style.display = "block";
document.getElementById("Neu").style.display = "none";

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
// Funktion zum Laden und Anzeigen der Ergebnisse
function loadAndDisplayResults() {
    let memoryGamePoints = localStorage.getItem('memoryGamePoints') || '';
    let memoryGameTime = localStorage.getItem('memoryGameTime') || '00:00';
    let quizPoints = localStorage.getItem('quizPoints') || '';
    let quizTime = localStorage.getItem('quizTime') || '00:00';
    let playerName = localStorage.getItem('playerName');

    if (!playerName) return; // Wenn kein Spielername vorhanden ist, beenden

    let combinedTime = formatCombinedTime(memoryGameTime, quizTime);

    const tableBody = document.getElementById('spielerTabelle').querySelector('tbody');
    let existingRow = [...tableBody.rows].find(row => row.cells[0].textContent === playerName);

    if (existingRow) {
        existingRow.cells[1].textContent = parseInt(memoryGamePoints) + parseInt(quizPoints);
        existingRow.cells[2].textContent = combinedTime;
    } else {
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${playerName}</td>
            <td>${parseInt(memoryGamePoints) + parseInt(quizPoints)}</td>
            <td>${combinedTime}</td>
        `;
        tableBody.appendChild(newRow);

        localStorage.removeItem('memoryGamePoints');
        localStorage.removeItem('memoryGameTime');
        localStorage.removeItem('quizPoints');
        localStorage.removeItem('quizTime');
        localStorage.removeItem('playerName');
    }
}

// Diese Funktion wird alle 3 Sekunden aufgerufen, um die Tabelle zu aktualisieren
function updateTablePeriodically() {
    // Hier rufen Sie Ihre Logik zum Laden und Anzeigen der Ergebnisse auf
    loadAndDisplayResults();
}
// Hilfsfunktion zum Kombinieren und Formatieren von Zeitangaben im Format "MM:SS"
function formatCombinedTime(memoryGameTime, quizTime) {
    const totalSecondsMemory = convertTimeToSeconds(memoryGameTime);
    const totalSecondsQuiz = convertTimeToSeconds(quizTime);

    const totalSecondsCombined = totalSecondsMemory + totalSecondsQuiz;

    return convertSecondsToTimeString(totalSecondsCombined);
}
// Hilfsfunktion zum Konvertieren einer Zeitangabe im Format "MM:SS" in Sekunden
function convertTimeToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
}
// Hilfsfunktion zum Konvertieren von Sekunden in eine Zeitangabe im Format "MM:SS"
function convertSecondsToTimeString(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
function EMail() {
    const tableDataString = localStorage.getItem('tableData');
    if (tableDataString) {
        fetch('send.php', { // Pfad zu Ihrem PHP-Skript
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'tableData=' + encodeURIComponent(tableDataString)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.success) {
                console.log('Email sent successfully');
                // Senden der Daten an save_to_file.php
                return fetch('save_to_file.php', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: tableDataString // Hier wird das gespeicherte tableData verwendet
                });
            } else {
                throw new Error(data.error || 'Error sending email');
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.success) {
                console.log('Daten erfolgreich in Datei gespeichert');
            } else {
                throw new Error(data.error || 'Fehler beim Speichern der Daten in Datei');
            }
        })
        .catch((error) => { 
            console.error('Fehler:', error); 
        });
    } else {
        console.error("Keine Tabellen-Daten im Local Storage gefunden.");
    }
}
function clearTableData() {
    localStorage.removeItem('tableData'); // Entfernen Sie die Daten aus dem localStorage

    // Optional: Entfernen Sie alle Zeilen aus dem Table Body im DOM
    const tableBody = document.querySelector('#spielerTabelle tbody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
}
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
// Funktion zum Speichern der Tabelle
function saveTableData() {
    const table = document.getElementById('spielerTabelle');
    const rows = table.rows;
    let tableData = [];
    for (let i = 1; i < rows.length; i++) { // Start bei 1, um Überschriften zu überspringen
        const cells = rows[i].cells;
        if (cells.length >= 3) { // Stellen Sie sicher, dass es mindestens drei Zellen gibt
            let rowData = {
                name: cells[0].textContent,
                points: cells[1].textContent !== '0' ? cells[1].textContent : '', // Verhindern des Speicherns von "0"
                time: cells[2].textContent // Stellen Sie sicher, dass diese Zelle existiert
            };
            if (rowData.name) { // Überprüfen, ob der Name vorhanden ist
                tableData.push(rowData);
            }
        }
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
// Funktion zum Aktualisieren der Tabelle alle 3 Sekunden
function startTableUpdateInterval() {
    setInterval(updatePlayerData, 3000); // Aktualisiere alle 3000ms (3 Sekunden)
	 updatePlayerData(); // Initialer Aufruf, um die Daten sofort beim Laden anzuzeigen
	 }
function updatePlayerData() {
    let moves = localStorage.getItem('memoryGameMoves');
    let time = localStorage.getItem('memoryGameTime');
    let playerName = localStorage.getItem('playerName');

    if (moves && time && playerName) {
        const tableBody = document.querySelector("#spielerTabelle tbody") || document.querySelector("#spielerTabelle");

        // Finden Sie die Zeile des Spielers basierend auf dem Namen
        let playerRowFound = false;
        for (let row of tableBody.rows) {
            if (row.cells[0].textContent === playerName) {
                row.cells[1].textContent = moves; // Aktualisieren der Punkte
                row.cells[2].textContent = time; // Aktualisieren der Zeit
                playerRowFound = true;
                break; // Beenden der Schleife nach dem Finden des Spielers
            }
        }

        // Wenn kein Eintrag für den Spieler gefunden wurde, fügen Sie einen neuen hinzu
        if (!playerRowFound) {
            let newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = playerName;
            newRow.insertCell(1).textContent = moves;
            newRow.insertCell(2).textContent = time;
        }

        saveTableData(); // Speichern der aktualisierten Tabelle
    }
}
function updateTableWithQuizResults() {
     const playerName = localStorage.getItem('playerName');
     const quizPointsStr = localStorage.getItem('quizPoints');
     const quizTimeStr= localStorage.getItem('quizTime');

     if (playerName && quizPointsStr && quizTimeStr) {
         const quizPoints= parseInt(quizPointsStr);
         const quizSeconds= parseInt(quizTimeStr);

         if (!isNaN(quizPoints) && !isNaN(quizSeconds)) {
             const tableBody= document.querySelector("#spielerTabelle tbody");

             for (let row of tableBody.rows) {
                 if (row.cells[0].textContent=== playerName) {

                     let currentPoints= parseInt(row.cells[1].textContent);
                     let currentSeconds= convertToSeconds(row.cells[2].textContent);

                     row.cells[1].textContent= currentPoints+ quizPoints;
                     row.cells[2].textContent= convertToMMSS(currentSeconds+ quizSeconds);

                     break;
                 }
             }
         } 
	 }
}

// Hilfsfunktion zur Konvertierung von MM:SS zu Sekunden
function convertToSeconds(time){
      let [minutes, seconds]= time.split(':').map(Number);
      return minutes*60+ seconds;
}

// Hilfsfunktion zur Konvertierung von Sekunden zu MM:SS
function convertToMMSS(seconds){
      let minutes= Math.floor(seconds/60);
      let remainingSeconds= seconds%60;
      return `${minutes}:${remainingSeconds.toString().padStart(2,'0')}`;
}

function checkAndShowSubmitButton() {
    if (clickedButtonsCount === totalButtonsToClick) {
        document.getElementById("Absenden").style.display = "block";
    }
}
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
// Funktion zum Laden von Punkten und Zeit aus dem Local Storage
function loadGameData() {
  let moves = localStorage.getItem('memoryGameMoves');
  let time = localStorage.getItem('memoryGameTime');

  if (moves && time) {
    // Aktualisieren Sie die Tabelle mit den geladenen Werten
    const tableBody = document.querySelector('#spielerTabelle tbody');
    const newRow = tableBody.insertRow();

    const nameCell = newRow.insertCell(0);
    const pointsCell = newRow.insertCell(1);
    const timeCell = newRow.insertCell(2);

    nameCell.textContent = localStorage.getItem('playerName') || 'Anonym';
    pointsCell.textContent = moves;
    timeCell.textContent = time;


  }
}
function displayCombinedResults() {
    let memoryGamePoints = parseInt(localStorage.getItem('memoryGamePoints') || '0');
    let quizPoints = parseInt(localStorage.getItem('quizPoints') || '0');

    let combinedPoints = memoryGamePoints + quizPoints;

    // Hier können Sie entscheiden, wo Sie die kombinierten Ergebnisse anzeigen möchten.
    // Zum Beispiel:
    const combinedResultsElement = document.getElementById('combinedResults'); // Stellen Sie sicher, dass ein Element mit dieser ID existiert
    if (combinedResultsElement) {
        combinedResultsElement.textContent = `Gesamtpunkte: ${combinedPoints}`;
    }

    // Aktualisieren oder Erstellen einer Zeile in der Tabelle mit den kombinierten Ergebnissen
    updateOrCreatePlayerRow(combinedPoints);
}

function updateOrCreatePlayerRow(points) {
    const playerName = localStorage.getItem('playerName');

    if (!playerName) {
        console.error("Spielername fehlt im Local Storage.");
        return;
    }

    const tableBody = document.getElementById('spielerTabelle').querySelector('tbody');

    let existingRow = [...tableBody.rows].find(row => row.cells[0].textContent === playerName);

    if (existingRow) {
        existingRow.cells[1].textContent = points; // Aktualisieren der Punkte
    } else {
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${playerName}</td>
            <td>${points}</td>
            <td></td> 
        `;
        tableBody.appendChild(newRow);

        localStorage.removeItem('memoryGamePoints'); // Löschen Sie den Punktewert aus dem Local Storage
        localStorage.removeItem('quizPoints'); // Löschen Sie den Punktewert aus dem Local Storage
        localStorage.removeItem('playerName');
    }
}
// Funktion zum Aktualisieren der Tabelle alle 5 Sekunden
// Event-Listener für das Starten des Spiels
SpielStarten.addEventListener('click', function(event) {
    const player1NameInput = document.getElementById("player1Name");

    if (!rolesChosenFlag && player1NameInput.value.trim() !== "") {
        rolesChosenFlag = true;
        player1NameInput.readOnly = true;

        localStorage.setItem('playerName', player1NameInput.value.trim());

        document.getElementById("BilderRaetsel").style.display = "block";
        document.getElementById("AllgemeineQuiz").style.display = "block";
        document.getElementById("StädteQuiz").style.display = "block";
        document.getElementById("Memory").style.display = "block";
		document.getElementById("Datenlöschen").style.display = "none";

        SpielStarten.style.display = "none";

        const tableBody = document.querySelector("#spielerTabelle tbody") || document.querySelector("#spielerTabelle");

        let newRow = tableBody.insertRow();

        let nameCell = newRow.insertCell(0);
        let pointsCell = newRow.insertCell(1);
        let timeCell = newRow.insertCell(2);

        nameCell.textContent = player1NameInput.value.trim();

        pointsCell.textContent = '0';
        timeCell.textContent = '';

    } else {
       showCustomPopup("Bitte geben deinen Namen ein.");
   }
});

// Funktion zum Zurücksetzen des Spiels
function resetGame() {
   localStorage.removeItem('memoryGameMoves');
  localStorage.removeItem('memoryGameTime');
  localStorage.removeItem('quizPoints');
  localStorage.removeItem('quizTime');
  localStorage.removeItem('playerName'); // Spielername entfernen, damit ein neuer eingegeben werden kann

  // Zurücksetzen des Eingabefelds für den Spielernamen
  const player1NameInput = document.getElementById("player1Name");
  player1NameInput.value = '';
  player1NameInput.readOnly = false;

}


// Aufruf der Funktion beim Laden der Seite
window.addEventListener('load', function() {
     setInterval(updateTablePeriodically, 600);
		  resetGame();
});
// Optional: Event-Listener für das Speichern der Daten vor dem Verlassen der Seite
window.addEventListener('beforeunload', function() {
    saveTableData();
});
document.getElementById("Memory").addEventListener("click", function() {
	this.style.display = "none";
    clickedButtonsCount++;
    checkAndShowSubmitButton();
	document.getElementById("Memory").style.display = "none";
});
document.getElementById("StädteQuiz").addEventListener("click", function() {
	 this.style.display = "none"; // Verstecke den Button nach dem Klicken
    clickedButtonsCount++; // Erhöhe den Zähler
    checkAndShowSubmitButton(); // Überprüfe, ob alle Buttons geklickt wurden
	document.getElementById("StädteQuiz").style.display = "none";	
});
document.getElementById("BilderRaetsel").addEventListener("click", function() {
    this.style.display = "none";
    clickedButtonsCount++;
    checkAndShowSubmitButton();
});
document.getElementById("AllgemeineQuiz").addEventListener("click", function() {
    this.style.display = "none";
    clickedButtonsCount++;
    checkAndShowSubmitButton();
});
document.addEventListener('DOMContentLoaded', function() {
    restoreTableData();
	 loadAndDisplayResults();
	 loadGameData();
	  insertPlayerData();
	  startTableUpdateInterval();
	  updatePlayerData();
	  updateTableWithQuizResults();
	   displayCombinedResults();
});
document.getElementById("Datenlöschen").addEventListener("click", function() {
EMail();
});
document.getElementById("Absenden").addEventListener("click", function() {
  location.reload(); // Lädt die Seite neu
});