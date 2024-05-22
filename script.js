const SpielStarten = document.getElementById('SpielStarten');
let player1Points = 0,
    rolesChosenFlag = false,
    clickedButtonsCount = 0;
const totalButtonsToClick = 4;
const table = document.getElementById('spielerTabelle');
const rows = table ? table.rows : [];
let tableData = [];

['Datenlöschen', 'Datenreinigen'].forEach(id => document.getElementById(id).style.display = "block");
['StädteQuiz', 'Memory', 'Absenden', 'BilderRaetsel', 'AllgemeineQuiz', 'Neu'].forEach(id => document.getElementById(id).style.display = "none");

for (let i = 0; i < rows.length; i++) {
    let rowData = [];
    for (let j = 0; j < rows[i].cells.length; j++) {
        rowData.push(rows[i].cells[j].textContent);
    }
    tableData.push(rowData.join(' | '));
}

function convertTimeToSeconds(timeString) {
    if (typeof timeString !== 'string') {
        return 0;
    }
    const parts = timeString.split(':');
    if (parts.length !== 2) {
        return 0;
    }
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (isNaN(minutes) || isNaN(seconds)) {
        return 0;
    }
    return (minutes * 60) + seconds;
}

function loadAndDisplayResults() {
    let memoryGamePoints = parseInt(localStorage.getItem('memoryGamePoints') || '0');
    let memoryGameTimeInSeconds = convertTimeToSeconds(localStorage.getItem('memoryGameTime') || '00:00');

    let staedteQuizPoints = parseInt(localStorage.getItem('StaedteQuizPoint') || '0');
    let staedteQuizTimeInSeconds = convertTimeToSeconds(localStorage.getItem('StaedteQuizTime') || '00:00');

    let quizPoints = parseInt(localStorage.getItem('quizPoints') || '0');
    let quizTimeInSeconds = convertTimeToSeconds(localStorage.getItem('quizTime') || '00:00');

    let bilderQuizPoints = parseInt(localStorage.getItem('BilderQuizPoints') || '0');
    let bilderTimeInSeconds = convertTimeToSeconds(localStorage.getItem('BilderTime') || '00:00');

    let playerName = localStorage.getItem('playerName');

    if (!playerName) return;

    let combinedPoints = memoryGamePoints + staedteQuizPoints + quizPoints + bilderQuizPoints;

    let combinedTimeInSeconds = memoryGameTimeInSeconds + staedteQuizTimeInSeconds + quizTimeInSeconds + bilderTimeInSeconds;

    if (isNaN(combinedTimeInSeconds)) combinedTimeInSeconds = 0;

    let combinedTimeFormatted = convertMillisecondsToTimeString(combinedTimeInSeconds * 1000);

    const tableBody=document.querySelector('#spielerTabelle tbody');

    if(!tableBody)return;

    for(let i=tableBody.rows.length-1;i>=0;i--){
        if(tableBody.rows[i].cells[0].textContent===playerName){
            tableBody.deleteRow(i);
        }
     }

     const newRow=document.createElement('tr');
     newRow.innerHTML=`<td>${playerName}</td><td>${combinedPoints}</td><td>${combinedTimeFormatted}</td>`;
     tableBody.appendChild(newRow);

     clearLocalStorage();
     console.log(`Added/Updated row for ${playerName}: Points=${combinedPoints}, Time=${combinedTimeFormatted}`);
}
function convertMillisecondsToTimeString(milliseconds) {
    if (typeof milliseconds !== 'number' || isNaN(milliseconds) || milliseconds < 0) {
        return '00:00';
    }
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function convertTimeToSeconds(timeString) {
    if (typeof timeString !== 'string') {
        return 0;
    }
    const parts = timeString.split(':');
    if (parts.length !== 2) {
        return 0;
    }
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (isNaN(minutes) || isNaN(seconds)) {
        return 0;
    }
    return (minutes * 60) + seconds;
}
   
function clearLocalStorage() {
   ['memoryGamePoints', 'memoryGameMoves', 'memoryGameTime', 
     'quizPoints', 'quizTimes', 
     'StaedteQuizPoint', 'StaedteQuizTimes',
     'BilderQuizPoints', 'BilderTimes',
     // Hinzufügen von gameStarted und playerName zum Löschen
     'gameStarted', 
     'playerName'
   ].forEach(item => localStorage.removeItem(item));
}

function checkAndShowSubmitButton() {
   if (clickedButtonsCount === totalButtonsToClick)
       document.getElementById("Absenden").style.display= "block";
}

function showCustomPopup(message) {
   const popup=document.createElement("div");
   popup.classList.add("custom-popup");
   popup.textContent=message;
   document.body.appendChild(popup);
   popup.style.top=`${(window.innerHeight - popup.offsetHeight) / 2}px`;
   popup.style.left=`${(window.innerWidth - popup.offsetWidth) / 2}px`;

   setTimeout(() => { 
       document.body.removeChild(popup); 
   }, 5000);
}

SpielStarten.addEventListener('click', function(event) {
   const player1NameInput=document.getElementById("player1Name");

   if (!rolesChosenFlag && player1NameInput.value.trim() !== "") { 
       if (isPlayerNameExists(player1NameInput.value.trim())) { 
           showCustomPopup("Spielername schon vorhanden, wähle einen anderen"); 
           return; 
       } 

       rolesChosenFlag=true; 
       player1NameInput.readOnly=true; 
       localStorage.setItem('playerName', player1NameInput.value.trim()); 
       localStorage.setItem('gameStarted', true); 

       ['BilderRaetsel','AllgemeineQuiz','StädteQuiz','Memory'].forEach(id => document.getElementById(id).style.display="block"); 
       ['Datenlöschen','SpielStarten'].forEach(id => document.getElementById(id).style.display="none"); 

       addPlayerToTable(player1NameInput.value.trim());
   } else showCustomPopup("Bitte geben deinen Namen ein.");
});

window.addEventListener('load', () => setInterval(loadAndDisplayResults, 60000));
window.addEventListener('beforeunload', saveTableData);
document.addEventListener('DOMContentLoaded', () => { restoreTableData(); startTableUpdateInterval(); });

function EMail() { 
   const tableDataString=localStorage.getItem('tableData'); 

   if(tableDataString){
      fetch('send.php',{method:'POST',
         headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:'tableData='+encodeURIComponent(tableDataString)})
         .then(response=>{if(!response.ok){throw new Error('Netzwerkantwort war nicht ok');}return response.json();})
         .then(data=>{if(data&&data.success){ console.log('E-Mail erfolgreich gesendet');return fetch('save_to_file.php',{method:'POST',
            headers:{'Content-Type':'application/json'},body:tableDataString});} else{throw new Error(data.error||'Fehler beim Senden der E-Mail');}})
         .then(response=>{if(!response.ok){throw new Error('Netzwerkantwort war nicht ok');}return response.json();})
         .then(data=>{if(data&&data.success){console.log('Daten erfolgreich in Datei gespeichert');} else{throw new Error(data.error||'Fehler beim Speichern der Daten in Datei');}})
         .catch((error)=>{console.error('Fehler:',error);if(error.response){ console.error('Antwortstatus:',error.response.status);error.response.text().then(text=>console.error('Antworttext:',text));}});}
      else{
         console.error("Keine Tabellen-Daten im Local Storage gefunden.");
      }
}

function clearTableData() { 
   localStorage.removeItem('tableData'); 

   const tableBody=document.querySelector('#spielerTabelle tbody'); 

   while(tableBody.firstChild)tableBody.removeChild(tableBody.firstChild);
}

function addPlayerToTable(playerName){
   const tableBody=document.querySelector("#spielerTabelle tbody")||document.querySelector("#spielerTabelle");

   let playerExists=false;

   for(let row of tableBody.rows){ 
      if(row.cells[0].textContent===playerName){ 
         playerExists=true;break;
      } 
   }

   if(playerExists){ 
      showCustomPopup("Spielername schon vorhanden, wähle einen anderen"); 
      rolesChosenFlag=false; 
      document.getElementById("player1Name").readOnly=false; 
   }else{ 
      let newRow=tableBody.insertRow(); 

      ['name','punkte','zeit'].forEach((cls,i)=>{ 
         let cell=newRow.insertCell(i); cell.className='spieler-'+cls; cell.textContent=i===0?playerName:'';
      }); 

      saveTableData(); 
   } 
}

function isPlayerNameExists(playerName){
const tableBody=document.querySelector("#spielerTabelle tbody")||document.querySelector("#spielerTabelle");

for(let row of tableBody.rows){

if(row.cells[0].textContent===playerName){

return true;}

}
return false;}


function updatePlayerData() {
    let playerName = localStorage.getItem('playerName');
    let staedteQuizPoints = parseInt(localStorage.getItem('StaedteQuizPoint') || '0');
    let staedteQuizTimeInMilliseconds = parseInt(localStorage.getItem('StaedteQuizTime') || '0');

    if (playerName && !isNaN(staedteQuizPoints) && !isNaN(staedteQuizTimeInMilliseconds)) {
        const tableBody = document.querySelector("#spielerTabelle tbody") || document.querySelector("#spielerTabelle");
        let found = false;

        for (let row of tableBody.rows) {
            if (row.cells[0].textContent === playerName) {
                row.cells[1].textContent = staedteQuizPoints;
                row.cells[2].textContent = convertMillisecondsToTimeString(staedteQuizTimeInMilliseconds);
                found = true;
                break;
            }
        }

        if (!found) {
            let r = tableBody.insertRow();
            [playerName, staedteQuizPoints.toString(), convertMillisecondsToTimeString(staedteQuizTimeInMilliseconds)].forEach((txt, i) => r.insertCell(i).textContent = txt);
        }

        saveTableData();
    }
}
function updateTableWithQuizResults(){

const playerName=localStorage.getItem('playerName'), quizPoints=parseInt(localStorage.getItem('quizPoints')), quizTime=parseInt(convertTimeToSeconds(localStorage.getItem('quizTime')));

if(playerName&&!isNaN(quizPoints)&&!isNaN(quizTime)){

const tableBody=document.querySelector("#spielerTabelle tbody"); 

for(let row of tableBody.rows){

if(row.cells[0].textContent===playerName){

row.cells[1].textContent=parseInt(row.cells[1].textContent)+parseInt(quizPoints); row.cells[2].textContent=convertSecondsToMinutes(convertTimeToSeconds(row.cells[2].textContent)+convertTimeToSeconds(quizTime)); break;}

} saveTableData();}
}

document.addEventListener('DOMContentLoaded', () => {
    
  
    startTableUpdateInterval();
});

function addPlayerToTable(playerName) {
    const tableBody = document.querySelector("#spielerTabelle tbody") || document.querySelector("#spielerTabelle");

    let playerExists = false;

    for (let row of tableBody.rows) {
        if (row.cells[0].textContent === playerName) {
            playerExists = true;
            break;
        }
    }

    if (playerExists) {
        showCustomPopup("Spielername schon vorhanden, wähle einen anderen");
        rolesChosenFlag = false; // Setze die Flag zurück
        document.getElementById("player1Name").readOnly = false; // Erlaube dem Benutzer erneut den Namen einzugeben
    } else {
        let newRow = tableBody.insertRow();
        ['name', 'punkte', 'zeit'].forEach((cls, i) => {
            let cell = newRow.insertCell(i);
            cell.className = 'spieler-' + cls;
            cell.textContent = i === 0 ? playerName : '';
        });
        saveTableData();
    }
}
function startTableUpdateInterval() {
    setInterval(updatePlayerData, 3000); // Alle 3 Sekunden aktualisieren
}
function saveTableData(){

const rows=[...document.querySelector('#spielerTabelle tbody').rows]; 

localStorage.setItem(

'tableData',

JSON.stringify(

rows.map(r=>({name:r.cells[0].textContent, points:r.cells[1].textContent, time:r.cells[2].textContent}))

)

);
}

// Event-Listener für die Quiz-Buttons

// Event-Listener für die Quiz-Buttons
['StädteQuiz','Memory','BilderRaetsel','AllgemeineQuiz'].forEach(id=>{
   document.getElementById(id).addEventListener("click", function(){
      this.style.display="none";
      clickedButtonsCount++;
      checkAndShowSubmitButton();
   });
});

// Event-Listener für Datenlöschen
document.getElementById("Datenlöschen").addEventListener("click", function() { EMail(); });






