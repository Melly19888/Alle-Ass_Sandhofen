const SpielStarten = document.getElementById('SpielStarten');
let player1Points = 0,
  rolesChosenFlag = false,
  clickedButtonsCount = 0;
const totalButtonsToClick = 4;
const table = document.getElementById('spielerTabelle');
const rows = table ? table.rows : [];

['StädteQuiz', 'Memory', 'Absenden', 'BilderRaetsel', 'AllgemeineQuiz', 'Neu', 'Datenlöschen', 'Spielbeenden'].forEach(id => {
  const element = document.getElementById(id);
  if (element) element.style.display = "none";
});

window.addEventListener('load', () => {
  clearLocalStorage();
  clearTableData();
  setInterval(loadAndDisplayResults, 60000);
});

function convertTimeToSeconds(timeString) {
  if (typeof timeString !== 'string') return 0;
  const parts = timeString.split(':');
  if (parts.length !== 2) return 0;
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  if (isNaN(minutes) || isNaN(seconds)) return 0;
  return (minutes * 60) + seconds;
}

function loadAndDisplayResults() {
  let memoryGamePoints = parseInt(localStorage.getItem('memoryGamePoints') || '0');
  let memoryGameTimeInSeconds = convertTimeToSeconds(localStorage.getItem('memoryGameTime') || '00:00');

  let staedteQuizPoints = parseInt(localStorage.getItem('StaedteQuizPoint') || '0');
  let staedteQuizTimeInSeconds = Math.floor(parseInt(localStorage.getItem('StaedteQuizTime') || '0') / 1000); // Convert milliseconds to seconds

  let quizPoints = parseInt(localStorage.getItem('quizPoints') || '0');
  let quizTimeInSeconds = convertTimeToSeconds(localStorage.getItem('quizTimes') || '00:00');

  let bilderQuizPoints = parseInt(localStorage.getItem('BilderQuizPoints') || '0');
  let bilderTimeInSeconds = convertTimeToSeconds(localStorage.getItem('BilderTime') || '00:00');

  let playerName = localStorage.getItem('playerName');

  if (!playerName) return;

   // Add points from all games
   let combinedPoints =
     memoryGamePoints +
     staedteQuizPoints +
     quizPoints +
     bilderQuizPoints;

   // Add times from all games
   let combinedTimeInSeconds =
     memoryGameTimeInSeconds +
     staedteQuizTimeInSeconds +
     quizTimeInSeconds +
     bilderTimeInSeconds;

   // Convert the total time back to MM:SS format
   let combinedTimeFormatted =
     convertMillisecondsToTimeString(combinedTimeInSeconds *1000);

   const tableBody =
     document.querySelector("#spielerTabelle tbody");
   if (!tableBody) return;

   // Remove existing row for the player
   for (let i= tableBody.rows.length -1; i >=0; i--) {
     if (
       tableBody.rows[i].cells[0].textContent === playerName
     ) {
       tableBody.deleteRow(i);
     }
   }

   // Add new row with updated data
   const newRow= document.createElement("tr");
   newRow.innerHTML=`<td>${playerName}</td><td>${combinedPoints}</td><td>${combinedTimeFormatted}</td>`;
   tableBody.appendChild(newRow);

   // Create the tableData object
   const tableData= [
     { name: playerName,
       points: combinedPoints,
       time: combinedTimeFormatted }
   ];

 try{
      // Save the tableData object in localStorage as a JSON string
      localStorage.setItem(
        "tableData",
        JSON.stringify(tableData)
      );
    
	
      return tableData; // Return the created object

 } catch(error){
      console.error(
        "Fehler beim Speichern der TableData:",
        error
      );
      return null;
 }
}

function convertMillisecondsToTimeString(milliseconds){
 const totalSeconds= Math.floor(milliseconds /1000);
 const minutes= Math.floor(totalSeconds /60);
 const seconds= totalSeconds %60;
 return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function clearLocalStorage(){
 ["memoryGamePoints","memoryGameTime","quizPoints","quizTimes","StaedteQuizPoint","StaedteQuizTime","BilderQuizPoints","BilderTime","gameStarted","playerName"].forEach(item=>localStorage.removeItem(item));
}

function checkAndShowSubmitButton(){
 if(clickedButtonsCount===totalButtonsToClick){
 document.getElementById("Datenlöschen").style.display="block";
 }
}

function showCustomPopup(message){
 const popup=document.createElement("div");
 popup.classList.add("custom-popup");
 popup.textContent= message;
 document.body.appendChild(popup);
 popup.style.top=`${(window.innerHeight-popup.offsetHeight)/2}px`;
 popup.style.left=`${(window.innerWidth-popup.offsetWidth)/2}px`;
 setTimeout(()=>{
 document.body.removeChild(popup);},5000);
}

SpielStarten.addEventListener("click", function(event){
 const player1NameInput=document.getElementById("player1Name");
 if(!rolesChosenFlag&&player1NameInput.value.trim()!==""){
 if(isPlayerNameExists(player1NameInput.value.trim())){
 showCustomPopup("Spielername schon vorhanden, wähle einen anderen");
 return;}
 rolesChosenFlag=true;
 player1NameInput.readOnly=true;
 localStorage.setItem(
 "playerName",
 player1NameInput.value.trim()
 );
 localStorage.setItem("gameStarted",true);
 ["BilderRaetsel","AllgemeineQuiz","StädteQuiz","Memory"].forEach(id=>document.getElementById(id).style.display="block");
 ["Datenlöschen","SpielStarten"].forEach(id=>document.getElementById(id).style.display="none");
 addPlayerToTable(player1NameInput.value.trim());
 }else showCustomPopup("Bitte gib einen Namen ein.");
});

window.addEventListener("load",()=>setInterval(()=>{
 const data= loadAndDisplayResults();},600));

function EMail(){
 loadAndDisplayResults();
 const tableDataString=
 localStorage.getItem("tableData");

if(tableDataString){
 try{
 fetch("send.php",{method:"POST",headers:{ "Content-Type":"application/x-www-form-urlencoded"},body:"tableData="+encodeURIComponent(tableDataString)})
.then(response=>{
if(!response.ok)
 throw new Error(
"Netzwerkantwort war nicht ok"
 );
return response.json();
})
.then(data=>{
if(data&&data.success){

return fetch(
"save_to_file.php",
{method:"POST",headers:{ "Content-Type":"application/json"},body:tableDataString}
);}else{
throw new Error(
data.error||"Fehler beim Senden der E-Mail"
 );}})
.then(response=>{
if(!response.ok)
 throw new Error(
"Netzwerkantwort war nicht ok"
 );
return response.json();
})
.then(data=>{
if(data&&data.success){
}else{
throw new Error(
data.error||
"Fehler beim Speichern der Daten in Datei"
 );}})
.catch(error=>{
console.error("Fehler:",error);
if(error.response){
console.error(
"Antwortstatus:",
error.response.status
 );
error.response.text().then(text=>console.error("Antworttext:",text));}});
}catch(error){
console.error(
"Fehler beim Verarbeiten der Tabellen-Daten:",
error);}
}else{
console.error(
"Keine Tabellen-Daten zum versenden gefunden."
 );}
}



function clearTableData() {
	localStorage.removeItem('tableData');
	const tableBody=document.querySelector('#spielerTabelle tbody'); 
	while(tableBody.firstChild)tableBody.removeChild(tableBody.firstChild); }

function addPlayerToTable(playerName){ 
const tableBody=document.querySelector("#spielerTabelle tbody")||document.querySelector("#spielerTabelle"); 
let playerExists=false; for(let row of tableBody.rows){ if(row.cells[0].textContent===playerName){ playerExists=true;break; } } if(playerExists){ showCustomPopup("Spielername schon vorhanden, wähle einen anderen"); rolesChosenFlag=false; document.getElementById("player1Name").readOnly=false; }else{ let newRow=tableBody.insertRow(); ['name','punkte','zeit'].forEach((cls,i)=>{ let cell=newRow.insertCell(i); cell.className='spieler-'+cls; cell.textContent=i===0?playerName:''; }); saveTableData(); } }

function isPlayerNameExists(playerName){ 
const tableBody=document.querySelector("#spielerTabelle tbody")||document.querySelector("#spielerTabelle"); for(let row of tableBody.rows){ if(row.cells[0].textContent===playerName){ return true;} } return false;}

function updatePlayerData() { 
let playerName=localStorage.getItem('playerName'); 
let staedteQuizPoints=parseInt(localStorage.getItem('StaedteQuizPoint')||'0'); 
let staedteQuizTimeInMilliseconds=parseInt(localStorage.getItem('StaedteQuizTime')||'0'); 

if(playerName&&!isNaN(staedteQuizPoints)&&!isNaN(staedteQuizTimeInMilliseconds)){ 
const tableBody=document.querySelector("#spielerTabelle tbody")||document.querySelector("#spielerTabelle"); 
let found=false; for(let row of tableBody.rows){ if(row.cells[0].textContent===playerName){ row.cells[1].textContent=staedteQuizPoints; row.cells[2].textContent=convertMillisecondsToTimeString(staedteQuizTimeInMilliseconds); found=true; break; } } if(!found){ let r=tableBody.insertRow(); [playerName,staedteQuizPoints.toString(),convertMillisecondsToTimeString(staedteQuizTimeInMilliseconds)].forEach((txt,i)=>r.insertCell(i).textContent=txt); } saveTableData(); } }

function updateTableWithQuizResults(){
	const playerName=localStorage.getItem('playerName'), 
	quizPoints=parseInt(localStorage.getItem('quizPoints')),
	quizTime=parseInt(convertTimeToSeconds(localStorage.getItem('quizTimes')));
	if(playerName&&!isNaN(quizPoints)&&!isNaN(quizTimes)){
		const tableBody=document.querySelector("#spielerTabelle tbody");
		for(let row of tableBody.rows){ 
		if(row.cells[0].textContent===playerName){
			row.cells[1].textContent=parseInt(row.cells[1].textContent)+parseInt(quizPoints); 
			row.cells[2].textContent=convertMillisecondsToMinutes(convertMillisecondsToMinutes(row.cells[2].textContent)+convertMillisecondsToMinutes(quizTimes));
			break;} 
			} saveTableData();
			} }

document.addEventListener ('DOMContentLoaded', () => { 
startTableUpdateInterval(); });

function startTableUpdateInterval(){ setInterval(updatePlayerData,600);// Alle3Sekundenaktualisieren }
}
function saveTableData(){
   const rows=[...document.querySelector('#spielerTabelle tbody').rows];

   localStorage.setItem(
      'tableData',
      JSON.stringify(
         rows.map(r => ({
            name: r.cells[0].textContent,
            points: r.cells[1].textContent,
            time: r.cells[2].textContent
         }))
      )
   );
}
// Event-Listener für die Quiz-Buttons 
['StädteQuiz','Memory','BilderRaetsel','AllgemeineQuiz'].forEach(id=>{ 
document.getElementById(id).addEventListener("click", function(){
	this.style.display="none"; clickedButtonsCount++; checkAndShowSubmitButton(); }); });

document.getElementById("Datenlöschen").addEventListener("click", function () {
    EMail();
    clearLocalStorage();

    // Laden der TableData aus dem lokalen Speicher
    const tableDataString = localStorage.getItem("tableData");
    let tableData;

    if (tableDataString) {
        try {
            tableData = JSON.parse(tableDataString);
        } catch (error) {
            console.error("Fehler beim Parsen der TableData:", error);
            return;
        }
    }

    if (tableData && tableData.length > 0) {
        showCustomPopup(`Danke fürs Spielen ${tableData[0].name}! Du hast ${tableData[0].points} Punkte in ${tableData[0].time} erreicht.`);
    } else {
        showCustomPopup("Keine Daten gefunden.");
    }

    const spielerTabelleContainer = document.querySelector('#spielerTabelle').parentNode;

    // Entfernen Sie die Tabelle aus dem DOM
    spielerTabelleContainer.removeChild(document.querySelector('#spielerTabelle'));

    // Erstellen Sie bei Bedarf eine leere Tabellenstruktur neu
    const newTable = document.createElement('table');
    newTable.id = 'spielerTabelle';

    const headerRow = newTable.insertRow();
    ['Spielername', 'Punkte', 'Zeit'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });

    spielerTabelleContainer.appendChild(newTable);

    document.getElementById("Datenlöschen").style.display = 'none';
    document.getElementById("Spielbeenden").style.display = 'block';
});
	document.getElementById('Spielbeenden').addEventListener('click', function() {
    location.reload();
});