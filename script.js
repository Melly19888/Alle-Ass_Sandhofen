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

const table = document.getElementById('spielerTabelle');
const rows = table ? table.rows : []; // Hier wird die Variable 'rows' definiert

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
    let memoryGamePoints = parseInt(localStorage.getItem('memoryGamePoints') || '0');
    let memoryGameTime = localStorage.getItem('memoryGameTime') || '00:00';

    // Abrufen der Städte-Quiz-Daten
    let staedteQuizPoints = parseInt(localStorage.getItem('StaedteQuizPoint') || '0');
    let staedteQuizTimeInSeconds = parseInt(localStorage.getItem('StaedteQuizTime') || '0');
    let staedteQuizTimeFormatted = convertSecondsToTimeString(staedteQuizTimeInSeconds);

    let playerName = localStorage.getItem('playerName');
    if (!playerName) return; // Wenn kein Spielername vorhanden ist, beenden

    // Kombinierte Punkte und Zeit berechnen
    let combinedPoints = memoryGamePoints + staedteQuizPoints;
    let combinedTimeInSeconds =
        convertTimeToSeconds(memoryGameTime) + staedteQuizTimeInSeconds;
    let combinedTimeFormatted =
        convertSecondsToTimeString(combinedTimeInSeconds);

    const tableBody =
        document.querySelector('#spielerTabelle tbody');

    // Überprüfen, ob der Spieler bereits in der Tabelle existiert
    let existingRowIndex;
    for (let i=0; i<tableBody.rows.length; i++) {
        if (tableBody.rows[i].cells[0].textContent === playerName) {
            existingRowIndex=i;
            break;
        }
    }

    if (existingRowIndex !== undefined) {
        tableBody.rows[existingRowIndex].cells[1].textContent=combinedPoints;
        tableBody.rows[existingRowIndex].cells[2].textContent=combinedTimeFormatted;
        clearLocalStorage();
    } else {
        const newRow=document.createElement('tr');
        newRow.innerHTML=`<td>${playerName}</td><td>${combinedPoints}</td><td>${combinedTimeFormatted}</td>`;
        tableBody.appendChild(newRow);
        clearLocalStorage();
    }
}

// Hilfsfunktion zum Konvertieren einer Zeitangabe im Format "MM:SS" in Sekunden
function convertTimeToSeconds(timeString) {
    const [minutes, seconds] =
    timeString.split(':').map(Number);
    return minutes * 60 + seconds;
}

// Hilfsfunktion zum Konvertieren von Sekunden in eine Zeitangabe im Format "MM:SS"
function convertSecondsToTimeString(seconds) {
    const minutes=Math.floor(seconds / 60);
    const remainingSeconds=seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function clearLocalStorage() {
    localStorage.removeItem('memoryGamePoints');
    localStorage.removeItem('memoryGameMoves');
    localStorage.removeItem('memoryGameTime');
    localStorage.removeItem('quizPoints');
    localStorage.removeItem('quizTimes');
    localStorage.removeItem('StaedteQuizPoint');
    localStorage.removeItem('StaedteQuizTimes');
    localStorage.removeItem('BilderQuizPoints');
    localStorage.removeItem('BilderTimes');
}

function checkAndShowSubmitButton() {
if (clickedButtonsCount === totalButtonsToClick) {
document.getElementById("Absenden").style.display=
"block";
}
}

function showCustomPopup(message) {
const popup=document.createElement("div");
popup.classList.add("custom-popup");
popup.textContent=message;
document.body.appendChild(popup);

// Zentriere das Popup-Fenster auf dem Bildschirm
popup.style.top=`${(window.innerHeight - popup.offsetHeight) / 2}px`;
popup.style.left=`${(window.innerWidth - popup.offsetWidth) / 2}px`;

setTimeout(() => { document.body.removeChild(popup); }, 5000);
}

SpielStarten.addEventListener(
'click',
function(event) {
const player1NameInput=document.getElementById(
"player1Name"
);
if (
!rolesChosenFlag &&
player1NameInput.value.trim() !== ""
) {
rolesChosenFlag=true;
player1NameInput.readOnly=true;

localStorage.setItem(
'playerName',
player1NameInput.value.trim()
);

document.getElementById(
"BilderRaetsel"
).style.display=
"block";
document.getElementById(
"AllgemeineQuiz"
).style.display=
"block";
document.getElementById(
"StädteQuiz"
).style.display=
"block";
document.getElementById(
"Memory"
).style.display=
"block";

document.getElementById(
"Datenlöschen"
).style.display=
"none";

SpielStarten.style.display=
"none";

const tableBody=document.querySelector(
"#spielerTabelle tbody"
) ||
document.querySelector("#spielerTabelle");

let newRow=tableBody.insertRow();
let nameCell=newRow.insertCell(0);
let pointsCell=newRow.insertCell(1);
let timeCell=newRow.insertCell(2);

nameCell.textContent=player1NameInput.value.trim();
pointsCell.textContent='0';
timeCell.textContent='';
} else { showCustomPopup("Bitte geben deinen Namen ein."); }
});

window.addEventListener(
'load',
function() { setInterval(loadAndDisplayResults, 60000); }
);

window.addEventListener(
'beforeunload',
function() { saveTableData(); }
);

document.addEventListener(
'DOMContentLoaded',
function() { loadAndDisplayResults(); }
);

// Neue Funktionen und Event-Listener

function EMail() {
const tableDataString=localStorage.getItem(
'tableData'
);
if (tableDataString) { fetch( 'send.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'tableData=' +
encodeURIComponent(tableDataString)
} )
.then(response => { if (!response.ok) { throw new Error( 'Network response was not ok' ); } return response.json(); })
.then(data => { if (data && data.success) { console.log( 'Email sent successfully' ); return fetch( 'save_to_file.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tableData)
}); } else { throw new Error(data.error || 'Error sending email' ); } })
.then(response => { if (!response.ok) { throw new Error( 'Network response was not ok' ); } return response.json(); })
.then(data => { if (data && data.success) { console.log( 'Daten erfolgreich in Datei gespeichert' ); } else { throw new Error(data.error || 'Fehler beim Speichern der Daten in Datei' ); } })
.catch((error) => { console.error( 'Fehler:', error); }); } else { console.error( "Keine Tabellen-Daten im Local Storage gefunden." ); }
}

function clearTableData() {
localStorage.removeItem(
'tableData'
); // Entfernen Sie die Daten aus dem localStorage

// Optional: Entfernen Sie alle Zeilen aus dem Table Body im DOM
const tableBody=document.querySelector('#spielerTabelle tbody');

while (tableBody.firstChild) {
tableBody.removeChild(tableBody.firstChild);
}
}

function addPlayerToTable(playerName) {
const tableBody =
document.querySelector("#spielerTabelle tbody") ||
document.querySelector("#spielerTabelle");

let newRow =
tableBody.insertRow();

let nameCell =
newRow.insertCell(0);

let pointsCell =
newRow.insertCell(1);

let timeCell =
newRow.insertCell(2);

nameCell.className =
'spieler-name';

pointsCell.className =
'spieler-punkte';

timeCell.className =
'spieler-zeit';

nameCell.textContent =
playerName;

pointsCell.textContent =
'0'; // Initialwert für Punkte

timeCell.textContent =
''; // Initialwert für Zeit

saveTableData(); // Speichern Sie die aktualisierte Tabelle
}

function restoreTableData() {
const tableDataString =
localStorage.getItem(
'tableData'
);

if (tableDataString) {

const tableBody =
document.querySelector('#spielerTabelle tbody');

const tableData =
JSON.parse(tableDataString);

// Löschen Sie alle vorhandenen Zeilen im tbody, bevor Sie neue hinzufügen
while (tableBody.firstChild) {

tableBody.removeChild(tableBody.firstChild);
}

// Fügen Sie jede gespeicherte Zeile zur Tabelle hinzu
for (const rowData of tableData) {

const row =
tableBody.insertRow();

const cellName =
row.insertCell(0);

cellName.textContent=rowData.name;

const cellPoints=row.insertCell(1);

cellPoints.textContent=rowData.points;

const cellTime=row.insertCell(2);

cellTime.textContent=rowData.time;

}
}
}

// Funktion zum Aktualisieren der Tabelle alle 3 Sekunden
function startTableUpdateInterval() {

setInterval(updatePlayerData,
3000); // Aktualisiere alle 3000ms (3 Sekunden)

updatePlayerData(); // Initialer Aufruf, um die Daten sofort beim Laden anzuzeigen
}

function updatePlayerData() {

let moves=localStorage.getItem(
'memoryGameMoves'
);

let time=localStorage.getItem(
'memoryGameTime'
);

let playerName=localStorage.getItem(
'playerName'
);

if (
moves &&
time &&
playerName
){

const tableBody=document.querySelector("#spielerTabelle tbody") ||
document.querySelector("#spielerTabelle");

// Finden Sie die Zeile des Spielers basierend auf dem Namen

let playerRowFound=false;

for (
let row of tableBody.rows){

if (
row.cells[0].textContent === playerName){

row.cells[1].textContent=moves; // Aktualisieren der Punkte

row.cells[2].textContent=time; // Aktualisieren der Zeit

playerRowFound=true;

break; // Beenden der Schleife nach dem Finden des Spielers

}
}

// Wenn kein Eintrag für den Spieler gefunden wurde, fügen Sie einen neuen hinzu

if (!playerRowFound){

let newRow=tableBody.insertRow();

newRow.insertCell(0).textContent=playerName;

newRow.insertCell(1).textContent=moves;

newRow.insertCell(2).textContent=time;

}

saveTableData(); // Speichern der aktualisierten Tabelle

}
}

function updateTableWithQuizResults(){

const playerName=localStorage.getItem(
'playerName'
);

const quizPoints=localStorage.getItem(
'quizPoints'
);

const quizTime=localStorage.getItem(
'quizTime'
);

if (
playerName &&
quizPoints &&
quizTime){

const tableBody=document.querySelector("#spielerTabelle tbody");

for (
let row of tableBody.rows){

if (
row.cells[0].textContent === playerName){

// Addiere Punkte und Zeit zu den bestehenden Werten

let currentPoints=parseInt(row.cells[1].textContent);

let currentTime=row.cells[2].textContent; // Format: 'MM:SS'

// Konvertiere beide Zeiten in Sekunden für einfache Addition

let totalSecondsCurrent=convertTimeToSeconds(currentTime);

let totalSecondsNew=convertTimeToSeconds(quizTime);

// Aktualisiere Punkte und Zeit

row.cells[1].textContent=currentPoints + parseInt(quizPoints);

row.cells[2].textContent=convertSecondsToMinutes(totalSecondsCurrent + totalSecondsNew);

break;

}
}

saveTableData(); // Speichern der aktualisierten Tabelle

}
}

// Hilfsfunktionen zur Zeitumrechnung

function convertSecondsToMinutes(seconds){
return Math.floor(seconds/60)+":"+(seconds%60).toString().padStart(2,'0'); }

function convertTimeToSeconds(time){
var parts=time.split(':'); return parseInt(parts[0])*60+parseInt(parts[1]); }

document.addEventListener("DOMContentLoaded", function(){
restoreTableData(); startTableUpdateInterval(); });

// Funktion zum Speichern der Tabellendaten in Local Storage function saveTableData(){
function saveTableData() {
const tableBody=document.querySelector('#spielerTabelle tbody');
const rows=[...tableBody.rows];
const data=rows.map(row=>({
name:row.cells[0].textContent,
points:row.cells[1].textContent,
time:row.cells[2].textContent
}));
localStorage.setItem('tableData',JSON.stringify(data));
}
document.
getElementById("StädteQuiz").
addEventListener("click",
function(){
this.style.
display=
     "none"; 
clickedButtonsCount++; 
checkAndShowSubmitButton();
document.
getElementById("StädteQuiz").
style.
display=
     "none"; });

document.
getElementById("Memory").
addEventListener("click",
function(){
this.style.
display=
     "none"; 
clickedButtonsCount++; 
checkAndShowSubmitButton();
document.
getElementById("Memory").
style.
display=
     "none"; });

document.
getElementById("BilderRaetsel").
addEventListener("click",
function(){
this.style.
display=
     "none"; 
clickedButtonsCount++; 
checkAndShowSubmitButton(); });

document.
getElementById("AllgemeineQuiz").
addEventListener("click",
function(){
this.style.
display=
     "none"; 
clickedButtonsCount++; 
checkAndShowSubmitButton(); });