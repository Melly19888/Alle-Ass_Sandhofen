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
    const nutellaAnswer = document.querySelector('input[name=nutellaQuestion]:checked');
    if (nutellaAnswer && nutellaAnswer.value === 'C') {
        points++;
        console.log('Richtige Antwort bei Nutella-Frage.'+ points);
    } else {
        console.log('Falsche Antwort bei Nutella-Frage.');
    }

    // Überprüfen der zweiten Frage
    const maerchenAnswer = document.querySelector('input[name=maerchenfigur]:checked');
    if (maerchenAnswer && maerchenAnswer.value === 'D') {
        points++;
        console.log('Richtige Antwort bei Märchenfigur-Frage.'+ points);
    } else {
        console.log('Falsche Antwort bei Märchenfigur-Frage.');
    }

    // Überprüfen der dritten Frage
    const palindromeTimeAnswer = document.querySelector('input[name=palindromeTime]:checked');
    if (palindromeTimeAnswer && palindromeTimeAnswer.value === 'B') {
        points++;
        console.log('Richtige Antwort bei Palindrom-Zeit-Frage.'+ points);
    } else {
        console.log('Falsche Antwort bei Palindrom-Zeit-Frage.');
    }
	// Überprüfen der fünften Frage
    const deutscheVorurteileAnswer = document.querySelector('input[name=deutscheVorurteile]:checked');
    if (deutscheVorurteileAnswer && deutscheVorurteileAnswer.value === 'C') {
        points++;
		 console.log('Richtige Antwort bei deutscheVorurteileAnswer.'+ points);
    } else {
        console.log('Falsche Antwort bei deutscheVorurteileAnswer.');
    }
    // Überprüfen der fünften Frage
    const namenQuizAnswer = document.querySelector('input[name=namenQuiz]:checked');
    if (namenQuizAnswer && namenQuizAnswer.value === 'D') {
        points++;
		 console.log('Richtige Antwort bei namenQuizAnswer.'+ points);
    } else {
        console.log('Falsche Antwort bei namenQuizAnswer.');
    }
    const würfelAnswerElement = document.getElementById('an');
    if (würfelAnswerElement) {
        const würfelAnswer = würfelAnswerElement.value;
        if (würfelAnswer === '1') {
            points++;
            console.log('Richtige Antwort bei Würfel-Frage. Neuer Punktestand: ' + points);
        } else {
            console.log('Falsche Antwort bei Würfel-Frage.');
        }
    } else {
        console.log('Element mit ID "an" wurde nicht gefunden.');
	}// Überprüfen der Antwort
	const finnAnswer = document.querySelector('input[name=finn]:checked');
	if (finnAnswer && finnAnswer.value === 'C') {
	points++;	
  console.log('Richtige Antwort finnAnswer '+ points );
        } else {
            console.log('Falsche Antwort finnAnswer');
        }	
  // Überprüfen der letzten Frage
	const sonjaAnswer = document.querySelector('input[name=sonja]:checked');
	if (sonjaAnswer && sonjaAnswer.value === 'B') {
    points++; // Erhöhe den Punktestand um einen Punkt für eine richtige Antwort
	console.log('Richtige Antwort sonjaAnswer '+ points );
        } else {
            console.log('Falsche Antwort sonjaAnswer');
        }	
		// Korrekte Verwendung von || für multiple Bedingungen
    const riddleAnswer = document.getElementById('Zahl').value;
    if (riddleAnswer === '8' || riddleAnswer.toLowerCase() === 'acht' || riddleAnswer.toLowerCase() === 'Acht') {
        points++;
		console.log('Richtige Antwort riddleAnswerZahl '+ points );
        } else {
            console.log('Falsche Antwort riddleAnswerZahl');
        
    }
	
   const riddlAnswer = document.getElementById('Ameise').value.trim().toLowerCase();
if (riddlAnswer === 'a' || riddlAnswer === 'A') {
    points++; // Erhöhe den Punktestand um einen Punkt für eine richtige Antwort
	console.log('Richtige Antwort riddleAnswerAmeise '+ points );
        } else {
            console.log('Falsche Antwort riddleAnswerAmeise');
        
    }
	  // Überprüfen des Krokodil-Rätsels
    const selectedRadioValueKrokodil = document.querySelector('input[name="answer"]:checked')?.value;
       if (selectedRadioValueKrokodil === 'A' ) {
        points++;
   console.log('Richtige Antwort selectedRadioValueKrokodil '+ points );
        } else {
            console.log('Falsche Antwort selectedRadioValueKrokodil');
        
    }
	 const selectedRadioValue = document.querySelector('input[name="answe"]:checked')?.value;

    // Überprüfe, ob der ausgewählte Wert der korrekten Antwort entspricht
    if (selectedRadioValue === 'F') {
		 points++; // Erhöhe den Punktestand um einen Punkt für eine richtige Antwort
console.log('Richtige Antwort selectedRadioValue ' + points);
        } else {
            console.log('Falsche Antwort selectedRadioValue');
        
    }    
    const palindromeFormAnswer = document.querySelector('input[name="ans"]:checked')?.value;
if (palindromeFormAnswer && palindromeFormAnswer === 'B') {
    points++;
console.log('Richtige Antwort palindromeFormAnswer '+ points );
        } else {
            console.log('Falsche Antwort palindromeFormAnswer');
        
    }   
const resultAnswer = document.querySelector('input[name="result"]:checked')?.value;
if (resultAnswer && resultAnswer === 'B') {
    points++;
    console.log('Richtige Antwort resultAnswer ' + points);
} else {
    console.log('Falsche Antwort resultAnswer');
}  
	const riAnswer = document.querySelector('input[name="ri"]:checked')?.value;
if (riAnswer && riAnswer === 'A') {
    points++;
    console.log('Richtige Antwort riAnswer ' + points);
} else {
    console.log('Falsche Antwort riAnswer');
}  
	const ridAnswer = document.querySelector('input[name="rid"]:checked')?.value;
if (ridAnswer && ridAnswer === 'I') {
    points++;
    console.log('Richtige Antwort ridAnswer ' + points);
} else {
    console.log('Falsche Antwort ridAnswer');
}  



      // Berechne die verstrichene Zeit seit dem Start des Quiz 
    const timeElapsed=Date.now()-startTime; 
    const minutes=Math.floor(timeElapsed/60000); 
    const seconds=((timeElapsed%60000)/1000).toFixed(0); 

    // Speichere Punkte und verstrichene Zeit in localStorage 
    localStorage.setItem('quizPoints', points.toString()); 
    localStorage.setItem('quizTimes', `${minutes}:${seconds.padStart(2,'0')}`); 

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
localStorage.setItem('quizTimes', timeElapsed);

// Funktion zum Anzeigen eines Alert-Popup-Fensters mit den erreichten Punkten 
function showAlertWithPoints(points) { window.close(); }

// Funktion zum Wiederherstellen und Anzeigen der gespeicherten Zeit beim Laden der Seite 
function displaySavedTime() { 
    const savedTime=localStorage.getItem('quizTimes'); 
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

localStorage.setItem('quizTimes', `${minutes}:${seconds.padStart(2,'0')}`); }

function updateTableWithTimeAndPoints(points) { 

// Hole die gespeicherte Zeit aus dem localStorage 

const savedTime=localStorage.getItem('quizTimes'); 

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
window.close();
});

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
	popup.style.fontSize = '50px';

    popup.style.top=`${(window.innerHeight-popup.offsetHeight)/2}px`;
    popup.style.left=`${(window.innerWidth-popup.offsetWidth)/2}px`;

    setTimeout(() => { document.body.removeChild(popup); },5000);
}