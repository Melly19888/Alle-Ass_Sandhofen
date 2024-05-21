let startTime;
let interval;
let points = 0;

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.createElement('button');
    startButton.textContent = '\u2766 Quiz starten \u2766'; // Farnblatt-Symbole hinzufügen
    // Stil für den Button festlegen
    startButton.style.position = 'absolute';
    startButton.style.top = '50%';
    startButton.style.left = '50%';
    startButton.style.transform = 'translate(-50%, -50%)';
    startButton.style.backgroundColor = '#00008b';
    startButton.style.color = '#ffff00';
    startButton.style.borderRadius = '15px';
    startButton.style.padding = '10px 20px';
    startButton.style.width = '500px';
    startButton.style.height = '150px';
    startButton.style.fontSize = '50px';

    document.body.insertBefore(startButton, document.body.firstChild);

    const mainContent = document.querySelector('main');
    mainContent.style.display = 'none';

    startButton.addEventListener('click', function() {
        this.remove();
        mainContent.style.display = 'block';
        startTime = Date.now();
        interval = setInterval(updateTimer, 100); // Aktualisiere den Timer alle 100ms
    });
});

// Funktion zum Aktualisieren des Timers
function updateTimer() {
    const currentTime = Date.now();
    const timeElapsed = currentTime - startTime;
    const secondsTotal = Math.floor(timeElapsed / 1000);
    const timerElement = document.getElementById('timer');

    if (timerElement) {
        timerElement.textContent = `Zeit: ${secondsTotal} Sekunden`;
    }
}

function checkAnswers(event) {
    clearInterval(interval); // Stoppt den Timer
    let pointsLocal = 0; // Punktzahl für richtige Antworten

    // Überprüfung der Antworten
    if (document.querySelector('input[name="FlußQuestion"]:checked')?.value === "B") { pointsLocal++; }
    if (document.querySelector('input[name="17"]:checked')?.value === "C") { pointsLocal++; }
    if (document.querySelector('input[name="Handschuhheim"]:checked')?.value === "B") { pointsLocal++; }
    if (document.querySelector('input[name="Auf dem Königsstuhl"]:checked')?.value === "A") { pointsLocal++; }
    if (document.querySelector('input[name="Eppelheim"]:checked')?.value === "A") { pointsLocal++; }
    if (document.querySelector('input[name="Baden-Württemberg"]:checked')?.value === "B") { pointsLocal++; }
    if (document.querySelector('input[name="HD"]:checked')?.value === "C") { pointsLocal++; }

   const timeElapsed= Date.now() -startTime;
   localStorage.setItem('StaedteQuizPoint',pointsLocal.toString());
   localStorage.setItem('StaedteQuizTime',timeElapsed.toString());
   showAlertWithPointsAndTime(pointsLocal,timeElapsed);
   updateTableWithQuizResults(pointsLocal,timeElapsed);
}

function showAlertWithPointsAndTime(points,timeElapsed){
   const minutes=Math.floor(timeElapsed/60000);
   const seconds=((timeElapsed%60000)/1000).toFixed(0);
   window.close();;
}

function displaySavedTime(){
   const savedTimeStr=localStorage.getItem('StaedteQuizTime');
   if(savedTimeStr){
      const savedTimeMs=parseInt(savedTimeStr,10);
      if(!isNaN(savedTimeMs)){
         const minutesSaved=Math.floor(savedTimeMs/60000);
         const secondsSaved=((savedTimeMs%60000)/1000).toFixed(0);
         const savedTimeElement=document.getElementById('savedTime');
         if(savedTimeElement){
            savedTimeElement.textContent=`Gespeicherte Zeit: ${minutesSaved} Minute(n) und ${secondsSaved} Sekunde(n).`;
         }
      }else{
         console.error("Gespeicherte Zeit ist keine gültige Zahl.");
      }
   }
}

document.addEventListener('DOMContentLoaded',function(){
   displaySavedTime();
});

document.getElementById("Button").addEventListener("click",function(){
   checkAnswers(); // Überprüfe die Antworten und aktualisiere 'points'
   window.close();
});

function updateTableWithQuizResults(points,timeElapsed){
   let playerName=localStorage.getItem("playerName");
   let tableBody=document.querySelector("#spielerTabelle tbody");

   for(let row of tableBody.rows){
      if(row.cells[0].textContent===playerName){
         let currentPoints=parseInt(row.cells[1].textContent)||0;
         let currentSeconds=convertToSeconds(row.cells[2].textContent)||0;

         row.cells[1].textContent=currentPoints+points;
         row.cells[2].textContent=convertToMinutes(currentSeconds+Math.floor(timeElapsed/1000));

         saveTableData();
         return;
      }
   }

   let newRow=tableBody.insertRow();
   newRow.insertCell(0).textContent=playerName;
   newRow.insertCell(1).textContent=points;
   newRow.insertCell(2).textContent=convertToMinutes(Math.floor(timeElapsed/1000));

   saveTableData();
}

function convertToSeconds(timeString){
   let [minutes,seconds]=timeString.split(":").map(Number);
   return(minutes*60)+seconds;
}

function convertToMinutes(seconds){
  return`${Math.floor(seconds/60).toString().padStart(2,"0")}:${(seconds%60).toString().padStart(2,"0")}`;
}