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

    displaySavedTime(); // Moved inside the first DOMContentLoaded event listener
});

function updateTimer() {
    const currentTime = Date.now();
    const timeElapsed = currentTime - startTime;

    const minutesTotal = Math.floor(timeElapsed / 60000);
    const secondsTotal = Math.floor((timeElapsed % 60000) / 1000);

    const timerElement = document.getElementById('timer');

    if (timerElement) {
        timerElement.textContent = `Zeit: ${minutesTotal.toString().padStart(2, "0")}:${secondsTotal.toString().padStart(2, "0")}`;
        console.log(`Zeit: ${minutesTotal.toString().padStart(2, "0")}:${secondsTotal.toString().padStart(2, "0")}`); // Debugging-Ausgabe
    }
}
function checkAnswers(event) {
    clearInterval(interval); // Stoppt den Timer
    let pointsLocal = 0; // Punktzahl für richtige Antworten
    let allQuestionsAnswered = true; // Flag to check if all questions are answered

    // Überprüfung der Antworten
    if (document.querySelector('input[name="FlußQuestion"]:checked')?.value === "B") { pointsLocal++; } else if (!document.querySelector('input[name="FlußQuestion"]:checked')) { allQuestionsAnswered=false; }
    if (document.querySelector('input[name="17"]:checked')?.value === "C") { pointsLocal++; } else if (!document.querySelector('input[name="17"]:checked')) { allQuestionsAnswered=false; }
    if (document.querySelector('input[name="Handschuhheim"]:checked')?.value === "B") { pointsLocal++; } else if (!document.querySelector('input[name="Handschuhheim"]:checked')) { allQuestionsAnswered=false; }
    if (document.querySelector('input[name="Auf dem Königsstuhl"]:checked')?.value === "A") { pointsLocal++; } else if (!document.querySelector('input[name="Auf dem Königsstuhl"]:checked')) { allQuestionsAnswered=false; }
    if (document.querySelector('input[name="Eppelheim"]:checked')?.value === "A") { pointsLocal++; } else if (!document.querySelector('input[name="Eppelheim"]:checked')) { allQuestionsAnswered=false; }
    if (document.querySelector('input[name="Baden-Württemberg"]:checked')?.value === "B") { pointsLocal++; } else if (!document.querySelector('input[name="Baden-Württemberg"]:checked')) { allQuestionsAnswered=false; }
    if (document.querySelector('input[name="HD"]:checked')?.value === "C") { pointsLocal++; } else if (!document.querySelector('input[name="HD"]:checked')) { allQuestionsAnswered=false; }

    if (!allQuestionsAnswered) {
        showCustomPopup("Beantworte alle Fragen");
        return;
    }

    const timeElapsed = Date.now() - startTime;
    localStorage.setItem('StaedteQuizPoint', pointsLocal.toString());
    localStorage.setItem('StaedteQuizTime', timeElapsed.toString());

    showAlertWithPointsAndTime(pointsLocal, timeElapsed);
}

function showAlertWithPointsAndTime(points, timeElapsed) {
    const minutes = Math.floor(timeElapsed / 60000);
    const seconds = ((timeElapsed % 60000) / 1000).toFixed(0);

}
function showCustomPopup(message) {
    const popup=document.createElement("div");
    popup.classList.add("custom-popup");
    popup.textContent=message;
    document.body.appendChild(popup);
    popup.style.position='fixed';
    popup.style.backgroundColor='darkblue';
    popup.style.color='white';
    popup.style.padding='20px';
    popup.style.borderRadius='25px';
    popup.style.zIndex='9999';
    popup.style.textAlign='center';
    popup.style.fontSize='50px';
    popup.style.top=`${(window.innerHeight-popup.offsetHeight)/2}px`;
    popup.style.left=`${(window.innerWidth-popup.offsetWidth)/2}px`;
    setTimeout(() => { document.body.removeChild(popup); },5000);
}

function showAlertWithPointsAndTime(points,timeElapsed){
    const minutes=Math.floor(timeElapsed/60000);
    const seconds=((timeElapsed%60000)/1000).toFixed(0);
   
}

function displaySavedTime() {
    const savedTimeStr=localStorage.getItem('StaedteQuizTime');
    if(savedTimeStr){
        const savedTimeMs=parseInt(savedTimeStr,10);
        if(!isNaN(savedTimeMs)){
            const minutesSaved=Math.floor(savedTimeMs/60000);
            const secondsSaved=((savedTimeMs%60000)/1000).toFixed(0);
            const savedTimeElement=document.getElementById('savedTime');
            if(savedTimeElement){
                savedTimeElement.textContent=`Gespeicherte Zeit: ${minutesSaved} Minute(n) und ${secondsSaved} Sekunde(n).`;
                console.log("Gespeicherte Zeit:", savedTimeElement.textContent); // Debugging-Ausgabe
            }
        } else{
            console.error("Gespeicherte Zeit ist keine gültige Zahl.");
        }
    }
}

document.getElementById("Button").addEventListener("click",function(){
    checkAnswers();
    displaySavedTime();
    window.close();
});

function convertToSeconds(timeString){
    let [minutes,seconds]=timeString.split(":").map(Number);
    return(minutes*60)+seconds;
}

function convertToMinutes(seconds){
    return`${Math.floor(seconds/60).toString().padStart(2,"0")}:${(seconds%60).toString().padStart(2,"0")}`;
}