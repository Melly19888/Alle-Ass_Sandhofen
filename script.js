const SpielStarten = document.getElementById('SpielStarten'); 
let player1Points = 0, rolesChosenFlag = false, clickedButtonsCount = 0; 
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

function loadAndDisplayResults() {
    let memoryGamePoints = parseInt(localStorage.getItem('memoryGamePoints') || '0');
    let memoryGameTimeInSeconds = convertMillisecondsToSeconds(parseInt(localStorage.getItem('memoryGameTime') || '0'));
    let staedteQuizPoints = parseInt(localStorage.getItem('StaedteQuizPoint') || '0');
    let staedteQuizTimeInSeconds = convertMillisecondsToSeconds(parseInt(localStorage.getItem('StaedteQuizTime') || '0'));
    let quizPoints = parseInt(localStorage.getItem('quizPoints') || '0');
    let quizTimeInSeconds = convertMillisecondsToSeconds(parseInt(localStorage.getItem('quizTime') || '0'));
    let bilderQuizPoints = parseInt(localStorage.getItem('BilderQuizPoints') || '0');
    let bilderTimeInSeconds = convertMillisecondsToSeconds(parseInt(localStorage.getItem('BilderTime') || '0'));

    let playerName = localStorage.getItem('playerName');
    if (!playerName) return;

    let combinedPoints = memoryGamePoints + staedteQuizPoints + quizPoints + bilderQuizPoints;
    let combinedTimeInSeconds = memoryGameTimeInSeconds + staedteQuizTimeInSeconds + quizTimeInSeconds + bilderTimeInSeconds;

    // Ensure combined time is a valid number
    if (isNaN(combinedTimeInSeconds)) combinedTimeInSeconds = 0;

    // Convert the combined time to minutes and seconds
    const combinedMinutesAndSeconds = convertToMinutesAndSeconds(combinedTimeInSeconds);

    const tableBody = document.querySelector('#spielerTabelle tbody');
    if (!tableBody) return;

    let existingRowIndex;
    for (let i=0; i<tableBody.rows.length; i++) {
        if (tableBody.rows[i].cells[0].textContent === playerName) {
            existingRowIndex=i;
            break;
        }
    }

    if (existingRowIndex !== undefined) {
        tableBody.rows[existingRowIndex].cells[1].textContent=combinedPoints;
        tableBody.rows[existingRowIndex].cells[2].textContent=combinedMinutesAndSeconds;
        clearLocalStorage();
    } else {
        const newRow=document.createElement('tr');
        newRow.innerHTML=`<td>${playerName}</td><td>${combinedPoints}</td><td>${combinedMinutesAndSeconds}</td>`;
        tableBody.appendChild(newRow);
        clearLocalStorage();
    }
}

function convertMillisecondsToSeconds(milliseconds) {
   return Math.floor(milliseconds / 1000);
}

function convertToMinutesAndSeconds(totalSeconds) {
   const minutes = Math.floor(totalSeconds / 60);
   const seconds = totalSeconds % 60;
   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
function convertTimeToSeconds(timeString) {
    if (!timeString || typeof timeString !== 'string') return 0;
    const [minutes, seconds] = timeString.split(':').map(Number);
    return (isNaN(minutes) ? 0 : minutes) * 60 + (isNaN(seconds) ? 0 : seconds);
}

function clearLocalStorage() {
   localStorage.removeItem('memoryGamePoints');
   localStorage.removeItem('memoryGameTime');
   localStorage.removeItem('StaedteQuizPoint');
   localStorage.removeItem('StaedteQuizTime');
   localStorage.removeItem('quizPoints');
   localStorage.removeItem('quizTime');
   localStorage.removeItem('BilderQuizPoints');
   localStorage.removeItem('BilderTime');
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

     setTimeout(() => { document.body.removeChild(popup); }, 5000); 

}

SpielStarten.addEventListener('click', function(event) {

     const player1NameInput=document.getElementById("player1Name");

     if (!rolesChosenFlag && player1NameInput.value.trim() !== "") {

         // Überprüfen, ob der Name bereits existiert
         if (isPlayerNameExists(player1NameInput.value.trim())) {

             showCustomPopup("Spielername schon vorhanden, wähle einen anderen");

             return; // Verhindere das Starten des Spiels

         }

         rolesChosenFlag=true;

         player1NameInput.readOnly=true;

         localStorage.setItem('playerName', player1NameInput.value.trim());

         localStorage.setItem('gameStarted', true); // Markiere das Spiel als gestartet

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
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:'tableData='+encodeURIComponent(tableDataString)})

          .then(response=>{if(!response.ok){throw new Error('Netzwerkantwort war nicht ok');}

          return response.json();})

          .then(data=>{if(data&&data.success){

             

              return fetch('save_to_file.php',{method:'POST',
              headers:{'Content-Type':'application/json'},body:tableDataString});

              } else{throw new Error(data.error||'Fehler beim Senden der E-Mail');

              }})

              .then(response=>{if(!response.ok){throw new Error('Netzwerkantwort war nicht ok');

              }

              return response.json();

              })

              .then(data=>{if(data&&data.success){

                 

                  } else{throw new Error(data.error||'Fehler beim Speichern der Daten in Datei');

                  }})

                  .catch((error)=>{console.error('Fehler:',error);

                  if(error.response){

                     

                      error.response.text().then(text=>console.error('Antworttext:',text));

                      }});} 

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

               playerExists=true;

               break;}

               }

               if(playerExists){

                    showCustomPopup("Spielername schon vorhanden, wähle einen anderen");

                    rolesChosenFlag=false; // Setze die Flag zurück

                    document.getElementById("player1Name").readOnly=false; // Erlaube dem Benutzer erneut den Namen einzugeben

                    }else{

                         let newRow=tableBody.insertRow();

                         ['name','punkte','zeit'].forEach((cls,i)=>{

                              let cell=newRow.insertCell(i);

                              cell.className='spieler-'+cls;

                              cell.textContent=i===0?playerName:'';

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

function restoreTableData(){

     const tableDataString=localStorage.getItem('tableData');

     if(tableDataString){

          const tableBody=document.querySelector('#spielerTabelle tbody');

          JSON.parse(tableDataString).forEach(row=>{

               let r=tableBody.insertRow();

               ['name','points','time'].forEach((key,i)=>r.insertCell(i).textContent=row[key]);

               });

               }

               }

function startTableUpdateInterval(){

// Set the interval to update every second instead of every three seconds.
setInterval(updatePlayerData,1000);

updatePlayerData();

}

function updatePlayerData(){

let moves=localStorage.getItem('memoryGameMoves'), time=localStorage.getItem('memoryGameTime'), playerName=localStorage.getItem('playerName');

if(moves&&time&&playerName){

const tableBody=document.querySelector("#spielerTabelle tbody")||document.querySelector("#spielerTabelle");

let found=false;

for(let row of tableBody.rows){

if(row.cells[0].textContent===playerName){

row.cells[1].textContent=moves;

row.cells[2].textContent=time;

found=true;

break;}

}

if(!found){

let r=tableBody.insertRow();

[playerName,moves,time].forEach((txt,i)=>r.insertCell(i).textContent=txt);

}

saveTableData();

}

}

function updateTableWithQuizResults(){

const playerName=localStorage.getItem('playerName'),

quizPoints=parseInt(localStorage.getItem('quizPoints')),

quizTime=parseInt(convertTimeToSeconds(localStorage.getItem('quizTime')));

if(playerName&&!isNaN(quizPoints)&&!isNaN(quizTime)){

const tableBody=document.querySelector("#spielerTabelle tbody");

for(let row of tableBody.rows){

if(row.cells[0].textContent===playerName){

row.cells[1].textContent=parseInt(row.cells[1].textContent)+parseInt(quizPoints);

row.cells[2].textContent=convertSecondsToMinutes(convertTimeToSeconds(row.cells[2].textContent)+convertTimeToSeconds(quizTime));

break;}

}

saveTableData();}}

// Entferne den doppelten Aufruf von restoreTableData und startTableUpdateInterval

document.addEventListener("DOMContentLoaded",()=>{startTableUpdateInterval();});

function saveTableData(){

const rows=[...document.querySelector('#spielerTabelle tbody').rows];

localStorage.setItem(

'tableData',

JSON.stringify(

rows.map(r=>({name:r.cells[0].textContent,

points:r.cells[1].textContent,

time:r.cells[2].textContent})) )

);

}

// Event-Listener für die Quiz-Buttons

['StädteQuiz','Memory','BilderRaetsel','AllgemeineQuiz'].forEach(id=>{

document.getElementById(id).addEventListener("click", function(){ this.style.display="none";

clickedButtonsCount++;

checkAndShowSubmitButton();});

});

// Event-Listener für Datenlöschen

document.getElementById("Datenlöschen").addEventListener("click", function() {

EMail();

});

// Neue Funktion zum Überprüfen, ob das Spiel bereits gestartet wurde

function checkIfPlayerExists() {

const gameStartedFromLocalStorage = localStorage.getItem("gameStarted");

if (!gameStartedFromLocalStorage) return;

const playerNameFromLocalStorage = localStorage.getItem("playerName");

if (!playerNameFromLocalStorage) return;

const tableBody=document.querySelector("#spielerTabelle tbody")||document.querySelector("#spielerTabelle");

let playerExists=false;

for(let row of tableBody.rows){

if(row.cells[0].textContent===playerNameFromLocalStorage){

playerExists=true;

break;}

}

// Füge den Spieler nur hinzu, wenn er noch nicht existiert und die Rollen gewählt wurden

if(!playerExists && rolesChosenFlag){

addPlayerToTable(playerNameFromLocalStorage);

}

}

// Rufe checkIfPlayerExists auf DOM Content Loaded auf

document.addEventListener("DOMContentLoaded",()=>{

checkIfPlayerExists();

});