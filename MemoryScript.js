document.getElementById("absenden").style.display = "none";

// Karten Bilder info
let cardsList = [
    {"name" : "Melly1", "img_src" : "IMG/Memo/img1.png"},
   /*{"name" : "Melly2", "img_src" : "IMG/Memo/img2.png"},
	{"name" : "Melly3", "img_src" : "IMG/Memo/img3.png"},
	{"name" : "Melly4", "img_src" : "IMG/Memo/img4.png"},
	{"name" : "Melly5", "img_src" : "IMG/Memo/img5.png"},
	{"name" : "Melly6", "img_src" : "IMG/Memo/img6.png"},
	{"name" : "Melly7", "img_src" : "IMG/Memo/img7.png"},
	{"name" : "Melly8", "img_src" : "IMG/Memo/img8.png"},*/
];

let count = 0;
let firstCardGuess = "";
let secondCardGuess = "";
let cardBoard = document.getElementById('card-board');
let grid = document.createElement('div');
let cardGrid = cardsList.concat(cardsList);
let shuffledCards = shuffleArray(cardGrid);
let moveCount = 0; // Initialisierung des Zugzählers
let gameStarted = false; // Variable to track if the game has started
let timerInterval; // Variable für das Intervall
let startTime; // Variable für den Startzeitpunkt

grid.setAttribute('class', 'grid');
cardBoard.appendChild(grid);

function openPopup(card) {
    let popupContainer = document.getElementById('popupContainer');
    let popupContent = popupContainer.querySelector('.popup-content');
    let cardImageSrc = card.querySelector('img').src;

    popupContent.innerHTML = `<span class="close-button" onclick="closePopup()">X</span><img src="${cardImageSrc}" class="enlarged-image">`;
    popupContainer.style.display = 'flex';
}

function startTimer() {
    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = Date.now();
    const timeElapsed = currentTime - startTime;
    const seconds = Math.floor(timeElapsed / 1000);
    document.getElementById('timer').textContent = formatTime(seconds);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
function displaySavedTime() {
    const savedTime = localStorage.getItem('quizTime');

    if (savedTime) {
        // Stellen Sie sicher, dass savedTime eine Zahl ist
        const timeElapsed = parseInt(savedTime, 10);

        // Berechne Minuten und Sekunden
        const minutes = Math.floor(timeElapsed / 60000);
        const seconds = ((timeElapsed % 60000) / 1000).toFixed(0);

        // Hier können Sie entscheiden, wo Sie die gespeicherte Zeit anzeigen möchten.
        const savedTimeElement = document.getElementById('savedTime');
        if (savedTimeElement) {
            savedTimeElement.textContent = `Gespeicherte Zeit: ${minutes} Minute(n) und ${seconds} Sekunde(n).`;
        }
    }
}
function closePopup() {
    let popupContainer = document.getElementById('popupContainer');
    popupContainer.style.display = 'none';
}

function match() {
    let selectedCards = document.querySelectorAll('.selected');
    selectedCards.forEach(card => {
        card.classList.add('matched');
        card.querySelector('img').style.opacity = "1";
        card.style.pointerEvents = "none";
        card.style.opacity = "0.8";
        card.classList.remove('selected');
    });
    count = 0;
}

function unmatch() {
    console.log("unmatch");
    let selectedCards = document.querySelectorAll('.selected');
    setTimeout(() => {
        selectedCards.forEach((card) => {
            card.classList.remove('selected');
        });
    }, 500);
    count = 0;
}

function checkCardMatch(guess1, guess2) {
    console.log("Prüfe");
    if(guess1 == guess2) {
        match();
        if(document.querySelectorAll('.matched').length === shuffledCards.length) {
            setTimeout(() => {
                stopTimer();
                document.getElementById("absenden").style.display = "block";
            }, 500);
        }
    } else {
        unmatch();
    }
}

function stopTimer() {
    clearInterval(timerInterval);
}

function shuffleArray(arr){
    for(let i=arr.length - 1; i>0; i--){
        const j=Math.floor(Math.random()*(i+1));
        [arr[i], arr[j]]=[arr[j], arr[i]];
    }
    return arr;
}
function showCardBoard(){
    shuffledCards.forEach(item => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = item.name;
        card.innerHTML = `<img src="${item.img_src}">`;
        grid.appendChild(card);
    });
}

function showAllCards() {
      let cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        card.classList.add('selected');
        card.querySelector('img').style.opacity = "1";
      });
}

function restartGame() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('matched', 'selected');
        card.querySelector('img').style.opacity = "0";
        card.style.pointerEvents = "auto";
        card.style.opacity ="";
    });

    count=0;
    moveCount=0;
    document.getElementById('move-count').textContent=moveCount;
    shuffledCards=shuffleArray(cardGrid);
    grid.innerHTML='';
    showCardBoard(); // Diese Funktion wird jetzt hier aufgerufen

    gameStarted=true; // Setze das Spiel als gestartet
    document.getElementById("restart-button").style.display="none";
    startTimer(); // Starten des Timers beim Neustart des Spiels
}
function submitAndGoBack() {
    // Berechne die verstrichene Zeit seit dem Start des Spiels
    let elapsedSecondsSinceStart = Math.floor((Date.now() - startTime) / 1000);
    // Formatierung der Zeit
    let formattedTime = formatTime(elapsedSecondsSinceStart);

    // Stellen Sie sicher, dass 'moveCount' eine gültige Zahl ist
    let moveCount = parseInt(document.getElementById('move-count').textContent);

    localStorage.setItem('memoryGameTime', formattedTime);
    localStorage.setItem('memoryGameMoves', moveCount.toString()); // Speichern der Züge als String

    window.location.href = 'index.html';
}
// Rufen Sie startTimer auf, wenn das Spiel gestartet wird:
document.getElementById("restart-button").addEventListener("click", function() {
    restartGame();
    startTimer(); // Starten des Timers beim Neustart des Spiels
});
// Rufen Sie saveGameData() auf, wenn das Spiel beendet ist oder wenn der Benutzer auf "Absenden und zurück" klickt.
document.getElementById('absenden').addEventListener('click', function(){
	saveGameData();
	 let points = localStorage.getItem('memoryGamePoints'); // Holen Sie sich die gespeicherten Punkte zurück
    if (points) {
        endQuiz(points);
    }
	
	
      window.close();
document.getElementById("absenden").style.display = "none";
    

});
grid.addEventListener('click', function(e){
    // Wenn das Spiel nicht gestartet wurde, erlaube keine Kartenumschläge
    if (!gameStarted) {
        return;
    }

    let selectedCard = e.target.parentElement;

    // Verhindere Aktionen, wenn auf das Grid selbst oder bereits ausgewählte Karten geklickt wird
    if(e.target.classList.contains('grid') || selectedCard.classList.contains('is-clicked')) {
        return;
    }

    // Verhindere mehr als zwei Karten gleichzeitig umzudrehen
    if(count < 2){
        count++;
        selectedCard.classList.add('selected');
        openPopup(selectedCard); // Öffne das Popup für die ausgewählte Karte

        if(count === 1){
            firstCardGuess = selectedCard.dataset.name;
            selectedCard.classList.add('is-clicked');
        } else {
            secondCardGuess = selectedCard.dataset.name;
            checkCardMatch(firstCardGuess, secondCardGuess);
            document.querySelectorAll('.card').forEach((card) => {
                card.classList.remove('is-clicked');
            });

            moveCount++; // Erhöhen Sie den Zugzähler bei jedem zweiten Klick
            document.getElementById('move-count').textContent = moveCount; // Aktualisieren Sie die Anzeige des Zugzählers
        }
    }
});
function saveGameData() {
    let elapsedSecondsSinceStart = Math.floor((Date.now() - startTime) / 1000);
    console.log("Verstrichene Zeit in Sekunden:", elapsedSecondsSinceStart); // Hinzugefügte Konsolenausgabe

    let formattedTime = formatTime(elapsedSecondsSinceStart);
    console.log("Formatierte Zeit:", formattedTime); // Hinzugefügte Konsolenausgabe

    let moves = document.getElementById('move-count').textContent;
    let points = calculatePoints(moves);

    localStorage.setItem('memoryGamePoints', points);
    localStorage.setItem('memoryGameTime', formatTime(elapsedSecondsSinceStart));

    console.log("Gespeicherte Punkte:", points);
    console.log("Gespeicherte Zeit:", formattedTime);
}

// Funktion zur Berechnung der Punkte basierend auf der Anzahl der Züge
function calculatePoints(moves) {
    const basePoints=30; // Basispunktzahl für 8 Züge
    const baseMoves=8; // Basisanzahl der Züge

    let pointsDiffPerMoveOverBaseMoves=1; // Punktabzug pro Zug über Basisanzahl von Zügen

    let points=basePoints - ((moves-baseMoves)*pointsDiffPerMoveOverBaseMoves);
    return points>0?points:0; // Stellen Sie sicher, dass die Punktzahl nicht negativ wird
}
document.addEventListener('DOMContentLoaded', function() {
    displaySavedTime();
});	


function endQuiz(points) {
    // Berechne die verstrichene Zeit seit dem Start des Quiz
    const timeElapsed = Date.now() - startTime;
    const minutes = Math.floor(timeElapsed / 60000);
    const seconds = ((timeElapsed % 60000) / 1000).toFixed(0);

    // Speichere Punkte und verstrichene Zeit in localStorage
     localStorage.setItem('memoryGamePoints', points);
    localStorage.setItem('memoryGameTime', `${minutes}:${seconds.padStart(2, '0')}`);
}


function updateTableWithTimeAndPoints(points) {
    // Hole die gespeicherte Zeit aus dem localStorage
    const savedTime = localStorage.getItem('memoryGameTime');

    if (savedTime) {
        // Stelle sicher, dass savedTime eine Zahl ist
        const timeElapsed = parseInt(savedTime, 10);

        // Berechne Minuten und Sekunden
        const minutes = Math.floor(timeElapsed / 60000);
        const seconds = ((timeElapsed % 60000) / 1000).toFixed(0);

        
    }
}