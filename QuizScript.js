let startTime;
let interval;
let points = 0;

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.createElement('button');
    startButton.textContent = '\u2766 Quiz starten \u2766';
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
      
    } else {
        
    }

    // Überprüfen der zweiten Frage
    const maerchenAnswer = document.querySelector('input[name=maerchenfigur]:checked');
    if (maerchenAnswer && maerchenAnswer.value === 'D') {
        points++;
       
    } else {
       
    }

    // Überprüfen der dritten Frage
    const palindromeTimeAnswer = document.querySelector('input[name=palindromeTime]:checked');
    if (palindromeTimeAnswer && palindromeTimeAnswer.value === 'B') {
        points++;
        
    } else {
       
    }
	// Überprüfen der fünften Frage
    const deutscheVorurteileAnswer = document.querySelector('input[name=deutscheVorurteile]:checked');
    if (deutscheVorurteileAnswer && deutscheVorurteileAnswer.value === 'C') {
        points++;
		
    } else {
        
    }
    // Überprüfen der fünften Frage
    const namenQuizAnswer = document.querySelector('input[name=namenQuiz]:checked');
    if (namenQuizAnswer && namenQuizAnswer.value === 'D') {
        points++;
		
    } else {
       
    }
    const würfelAnswerElement = document.getElementById('an');
    if (würfelAnswerElement) {
        const würfelAnswer = würfelAnswerElement.value;
        if (würfelAnswer === '1') {
            points++;
           
        } else {
            
        }
    } else {
      
	}// Überprüfen der Antwort
	const finnAnswer = document.querySelector('input[name=finn]:checked');
	if (finnAnswer && finnAnswer.value === 'C') {
	points++;	
  
        } else {
            
        }	
  // Überprüfen der letzten Frage
	const sonjaAnswer = document.querySelector('input[name=sonja]:checked');
	if (sonjaAnswer && sonjaAnswer.value === 'B') {
    points++; // Erhöhe den Punktestand um einen Punkt für eine richtige Antwort
	
        } else {
            
        }	
		// Korrekte Verwendung von || für multiple Bedingungen
    const riddleAnswer = document.getElementById('Zahl').value;
    if (riddleAnswer === '8' || riddleAnswer.toLowerCase() === 'acht' || riddleAnswer.toLowerCase() === 'Acht') {
        points++;
		
        } else {
            
        
    }
	
   const riddlAnswer = document.getElementById('Ameise').value.trim().toLowerCase();
if (riddlAnswer === 'a' || riddlAnswer === 'A') {
    points++; // Erhöhe den Punktestand um einen Punkt für eine richtige Antwort
	
        } else {
            
        
    }
	  // Überprüfen des Krokodil-Rätsels
    const selectedRadioValueKrokodil = document.querySelector('input[name="answer"]:checked')?.value;
       if (selectedRadioValueKrokodil === 'A' ) {
        points++;
  
        } else {
            
        
    }
	 const selectedRadioValue = document.querySelector('input[name="answe"]:checked')?.value;

    // Überprüfe, ob der ausgewählte Wert der korrekten Antwort entspricht
    if (selectedRadioValue === 'F') {
		 points++; // Erhöhe den Punktestand um einen Punkt für eine richtige Antwort

        } else {
          
        
    }    
    const palindromeFormAnswer = document.querySelector('input[name="ans"]:checked')?.value;
if (palindromeFormAnswer && palindromeFormAnswer === 'B') {
    points++;

        } else {
            
        
    }   
const resultAnswer = document.querySelector('input[name="result"]:checked')?.value;
if (resultAnswer && resultAnswer === 'B') {
    points++;

} else {
   
}  
	const riAnswer = document.querySelector('input[name="ri"]:checked')?.value;
if (riAnswer && riAnswer === 'A') {
    points++;
   
} else {
    
}  
	const ridAnswer = document.querySelector('input[name="rid"]:checked')?.value;
if (ridAnswer && ridAnswer === 'I') {
    points++;
    
} else {
    
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
	 window.close();
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
    
	
});

function endQuiz() {
   const { minutes, seconds }= calculateElapsedTime();
   localStorage.setItem('quizPoints', points.toString());
   localStorage.setItem('quizTimes', `${minutes}:${seconds.padStart(2,'0')}`);

  

   if (window.opener) {
      
     
   } else {
      
   }
}

function calculateElapsedTime(){ 
    const timeElapsed=Date.now()-startTime; 
    const minutes=Math.floor(timeElapsed/60000); 
    const seconds=((timeElapsed%60000)/1000).toFixed(0); 
    return { minutes, seconds }; 
}

function updateTableWithTimeAndPoints(points) { 
    // Hole die gespeicherte Zeit aus dem localStorage
    const savedTime=localStorage.getItem('quizTimes'); 
    if(savedTime){ 
        // Stelle sicher, dass savedTime eine Zahl ist
        const timeElapsed=parseInt(savedTime,10); 
        // Berechne Minuten und Sekunden
        const minutes=Math.floor(timeElapsed/60000); 
        const seconds=((timeElapsed%60000)/1000).toFixed(0); }
}

function showAlertWithPointsAndTime(points,timeElapsed){ 
    // Berechne Minuten und Sekunden aus der verstrichenen Zeit
    const minutes=Math.floor(timeElapsed/60000); 
    const seconds=((timeElapsed%60000)/1000).toFixed(0); }


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
