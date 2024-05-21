let startTime;
let interval;
let points = 0;
let timeElapsed;

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.createElement('button');
    startButton.textContent = '\u2766 Quiz starten \u2766'; // Farnblatt-Symbole hinzufügen
    // Stil für den Button festlegen
    startButton.style.position = 'absolute'; // Positionierung auf absolute setzen
    startButton.style.top = '50%'; // Vertikal zentrieren
    startButton.style.left = '50%'; // Horizontal zentrieren
    startButton.style.transform = 'translate(-50%, -50%)'; // Verschiebung um die eigene Größe korrigieren
    startButton.style.backgroundColor = '#00008b'; // Hintergrundfarbe auf Grün setzen
    startButton.style.color = '#ffff00'; // Schriftfarbe auf Blau setzen
    startButton.style.borderRadius = '15px'; // Abgerundete Ecken für den Button
    startButton.style.padding = '10px 20px'; // Innenabstand für den Button
    startButton.style.width = '500px'; // Breite des Buttons festlegen
    startButton.style.height = '150px'; // Höhe des Buttons festlegen
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
    const seconds = Math.floor(timeElapsed / 1000);
    document.getElementById('timer').textContent = `Zeit: ${seconds} Sekunden`;
}

// Funktion zum Überprüfen der Antworten und Zählen der Punkte
function checkAnswers() {
    points = 0; // Setze 'points' zurück auf 0

    if (!allQuestionsAnswered()) {
        showCustomPopup("Beantworte alle Fragen");
        return;
    }

    clearInterval(interval); // Stoppe den Timer

    // Überprüfen der ersten Frage 
    const nutellaAnswer=document.querySelector('input[name=nutellaQuestion]:checked'); 
    if(nutellaAnswer&&nutellaAnswer.value==='C'){ points++; }

    // Überprüfen der zweiten Frage 
    const maerchenAnswer=document.querySelector('input[name=maerchenfigur]:checked'); 
    if(maerchenAnswer&&maerchenAnswer.value==='D'){ points++; }

      // Weitere Fragenüberprüfung hier...

      // Berechne die verstrichene Zeit seit dem Start des Quiz 
    const timeElapsed=Date.now()-startTime; 
    const minutes=Math.floor(timeElapsed/60000); 
    const seconds=((timeElapsed%60000)/1000).toFixed(0); 

    // Speichere Punkte und verstrichene Zeit in localStorage 
    localStorage.setItem('quizPoints', points.toString()); 
    localStorage.setItem('quizTime', `${minutes}:${seconds.padStart(2,'0')}`); 

    showAlertWithPointsAndTime(points,timeElapsed); 
    updateTableWithTimeAndPoints(points,timeElapsed);
}

function allQuestionsAnswered() {
    const questionsGroupsNames=['nutellaQuestion','maerchenfigur','palindromeTime','deutscheVorurteile','namenQuiz','finn','sonja','answer','answe','ans','result','ri','rid'];
    for(let name of questionsGroupsNames){
        if(!document.querySelector(`input[name=${name}]:checked`)){
            return false;
        }
    }
    if (!document.getElementById('an').value || !document.getElementById('Zahl').value || !document.getElementById('Ameise').value.trim().toLowerCase()) {
        return false;
    }
    return true;
}

document.getElementById("Button").addEventListener("click", function() {
    checkAnswers();
    endQuiz()
});

// Angenommen, 'points' und 'time' sind Ihre Variablen für Punkte und Zeit 
localStorage.setItem('quizPoints', points); 
localStorage.setItem('quizTime', timeElapsed);

// Funktion zum Anzeigen eines Alert-Popup-Fensters mit den erreichten Punkten 
function showAlertWithPoints(points) { window.close(); }

// Funktion zum Wiederherstellen und Anzeigen der gespeicherten Zeit beim Laden der Seite 
function displaySavedTime() { 
    const savedTime=localStorage.getItem('quizTime'); 
    if(savedTime){ 
    // Stellen Sie sicher, dass savedTime eine Zahl ist 
    const timeElapsed=parseInt(savedTime,10); 

    // Berechne Minuten und Sekunden 
    const minutes=Math.floor(timeElapsed/60000); 
    const seconds=((timeElapsed%60000)/1000).toFixed(0);

    // Hier können Sie entscheiden, wo Sie die gespeicherte Zeit anzeigen möchten. 
    const savedTimeElement=document.getElementById('savedTime'); 

    if(savedTimeElement){ savedTimeElement.textContent=`Gespeicherte Zeit: ${minutes} Minute(n) und ${seconds} Sekunde(n).`; } } }

// Event-Listener für das Laden der Seite hinzufügen, um die gespeicherte Zeit anzuzeigen 
document.addEventListener('DOMContentLoaded', function() { displaySavedTime(); });

function endQuiz() { 
// Berechne die verstrichene Zeit seit dem Start des Quiz 
const timeElapsed=Date.now()-startTime; 

const minutes=Math.floor(timeElapsed/60000); 

const seconds=((timeElapsed%60000)/1000).toFixed(0);

// Speichere Punkte und verstrichene Zeit in localStorage 

localStorage.setItem('quizPoints', points.toString()); 

localStorage.setItem('quizTime', `${minutes}:${seconds.padStart(2,'0')}`); }

function updateTableWithTimeAndPoints(points) { 

// Hole die gespeicherte Zeit aus dem localStorage 

const savedTime=localStorage.getItem('quizTime'); 

if(savedTime){ 

// Stelle sicher, dass savedTime eine Zahl ist 

const timeElapsed=parseInt(savedTime,10);

// Berechne Minuten und Sekunden

const minutes=Math.floor(timeElapsed/60000);

const seconds=((timeElapsed%60000)/1000).toFixed(0);

}}

function showAlertWithPointsAndTime(points,timeElapsed){

// Berechne Minuten und Sekunden aus der verstrichenen Zeit

const minutes=Math.floor(timeElapsed/60000);

const seconds=((timeElapsed%60000)/1000).toFixed(0);

}

document.getElementById("Button").addEventListener("click", function(){

checkAnswers();

// Überprüfe die Antworten und aktualisiere 'points'

endQuiz();

// Speichere Punkte und Zeit im localStorage

});

function showCustomPopup(message) {
    const popup=document.createElement("div");
    popup.classList.add("custom-popup");
    popup.textContent=message;
    document.body.appendChild(popup);
    popup.style.position='fixed';
    popup.style.backgroundColor='darkblue';
    popup.style.color='oronge';
    popup.style.padding='20px';
    popup.style.borderRadius='25px';
    popup.style.zIndex='9999';
	popup.style.textAlign='center';
	popup.style.fontSize = '50px';

    popup.style.top=`${(window.innerHeight-popup.offsetHeight)/2}px`;
    popup.style.left=`${(window.innerWidth-popup.offsetWidth)/2}px`;

    setTimeout(() => { document.body.removeChild(popup); },5000);
}