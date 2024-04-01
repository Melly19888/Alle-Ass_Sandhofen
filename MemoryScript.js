document.getElementById("absenden").style.display = "none";

// Karten Bilder info
let cardsList = [
      {"name" : "Melly1", "img_src" : "IMG/Memo/img1.png"},
 // {"name" : "Melly2", "img_src" : "IMG/Memo/img2.png"},
//{"name" : "Melly3", "img_src" : "IMG/Memo/img3.png"},
// {"name" : "Melly4", "img_src" : "IMG/Memo/img4.png"},
//{"name" : "Melly5", "img_src" : "IMG/Memo/img5.png"},
//{"name" : "Melly6", "img_src" : "IMG/Memo/img6.png"},
// {"name" : "Melly7", "img_src" : "IMG/Memo/img7.png"},
// {"name" : "Melly8", "img_src" : "IMG/Memo/img8.png"},
   
	
];
//Hier werden Variablen initialisiert, um den Zustand des Spielers zu verfolgen,
// wie viele Karten bereits ausgewählt wurden und welche Karten ausgewählt wurden.

let count = 0;
let firstCardGuess = "";
let secondCardGuess = "";

//Hier wird das HTML-Element mit der ID "card-board" abgerufen und ein neues <div>-Element
// namens "grid" erstellt, das als Container für die Spielkarten dient. Dieser Container 
//wird dann dem "card-board" hinzugefügt.

let cardBoard = document.getElementById('card-board');
let grid = document.createElement('div');
grid.setAttribute('class', 'grid');
cardBoard.appendChild(grid);

// Hier wird eine Kopie der Liste von Karten erstellt, indem die ursprüngliche Liste cardsList 
//mit sich selbst konkateniert wird. Dadurch entsteht eine doppelte Liste von Karten, 
//die für das Memory-Spiel benötigt wird.

let cardGrid = cardsList.concat(cardsList);

//Dies ist eine Funktion, die verwendet wird, um ein Array zu mischen. 
//Sie verwendet den Fisher-Yates-Shuffle-Algorithmus, um die Reihenfolge der Elemente im Array zufällig zu ändern.

function shuffleArray(arr){
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

//Hier wird die Funktion shuffleArray aufgerufen, um die doppelte Liste von Karten zufällig zu mischen.

let shuffledCards = shuffleArray(cardGrid);

//Dies ist eine Funktion, die verwendet wird, um das Spielfeld mit den gemischten Karten anzuzeigen. 
//Sie durchläuft das gemischte Array von Karten und erstellt für jede Karte ein <div>-Element mit der Klasse 
//"card" und einem Bild (angezeigt durch <img>), das die Quelle (src) aus den Kartendaten erhält.

function showCardBoard(){
    shuffledCards.forEach(item => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = item.name;
        card.innerHTML = `<img src = "${item.img_src}">`;
        grid.appendChild(card);
    })
}

let moveCount = 0; // Initialisierung des Zugzählers

grid.addEventListener('click', function(e){
    let selectedCard = e.target.parentElement;
    if(e.target.classList.contains('grid')){
        return;
    }

    if(count < 2){
        count++;
        if(count == 2) {
            moveCount++; // Erhöhen Sie den Zugzähler bei jedem zweiten Klick
            document.getElementById('move-count').textContent = moveCount; // Aktualisieren Sie die Anzeige des Zugzählers
        }

    if(count == 1){
            openPopup(selectedCard);
            firstCardGuess = selectedCard.dataset.name;
            selectedCard.classList.add('selected', 'is-clicked');
        } else {
            openPopup(selectedCard);
            secondCardGuess = selectedCard.dataset.name;
            selectedCard.classList.add('selected');
            checkCardMatch(firstCardGuess, secondCardGuess);
            document.querySelectorAll('.card').forEach((card) => {
                card.classList.remove('is-clicked');
            });
        }
    }
});

function openPopup(card) {
    let popupContainer = document.getElementById('popupContainer');
    let popupContent = popupContainer.querySelector('.popup-content');
    let cardImageSrc = card.querySelector('img').src;

    popupContent.innerHTML = `<span class="close-button" onclick="closePopup()">X</span><img src="${cardImageSrc}" class="enlarged-image">`;
    popupContainer.style.display = 'flex';
}

function closePopup() {
  let popupContainer = document.getElementById('popupContainer');
  popupContainer.style.display = 'none';
}

function checkCardMatch(guess1, guess2){
	console.log("Prüfe");
    if(guess1 == guess2) {
        match();
        // Überprüfen, ob alle Karten übereinstimmen
        if(document.querySelectorAll('.matched').length === shuffledCards.length) {
            setTimeout(() => {
                stopTimer(); // Stoppe den Timer, da das Spiel beendet ist
				document.getElementById("absenden").style.display = "block";
            }, 500);
        }
    } else {
        unmatch();
    }
}



// Funktion zum Stoppen des Timers
function stopTimer() {
    clearInterval(timerInterval); // Stoppen Sie den Timer
}

let match = function(){
    let selectedCards = document.querySelectorAll('.selected');
    selectedCards.forEach(card => {
        card.classList.add('matched');
        card.querySelector('img').style.opacity = "1";
        card.style.pointerEvents = "none";
        card.style.opacity = "0.8";
        card.classList.remove('selected');
    });
    count = 0;
};

let unmatch = function(){
	console.log("unmatch");
    let selectedCards = document.querySelectorAll('.selected');
    setTimeout(() => {
        selectedCards.forEach((card) => {
            card.classList.remove('selected');
        });
    }, 500);
    count = 0;
}

// Für den Neustart Button


	
// zum auf decken aller Karten

	function showAllCards() {
      let cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        card.classList.add('selected');
        card.querySelector('img').style.opacity = "1";
      });
    }

function closePopup() {
  let popup = document.getElementById('popupContainer');
  popup.style.display = 'none';
}
let gameStarted = false; // Variable to track if the game has started

function restartGame() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('matched', 'selected');
        card.querySelector('img').style.opacity = "0";
        card.style.pointerEvents = "auto";
    });
    count = 0;
    moveCount = 0;
    document.getElementById('move-count').textContent = moveCount;
    shuffledCards = shuffleArray(cardGrid);
    grid.innerHTML = '';

    showCardBoard(); // Diese Funktion wird jetzt hier aufgerufen

    gameStarted = true; // Setze das Spiel als gestartet
    document.getElementById("restart-button").style.display = "none";
	

}

grid.addEventListener('click', function(e){
    if (!gameStarted) {
        return; // Wenn das Spiel nicht gestartet wurde, erlaube keine Kartenumschläge
    }

    let selectedCard = e.target.parentElement;

    if(e.target.classList.contains('grid')){
        return;
    }

    // ... (rest of your event listener code)
});
// Hier wird die Funktion startTimer definiert, um die Zeit zu zählen
let timerInterval; // Variable für das Intervall
let timer = 0; // Variable für die Sekundenzählung

function startTimer() {
    timer = 0; // Setzen Sie den Timer zurück
    clearInterval(timerInterval); // Stoppen Sie den vorherigen Timer (falls vorhanden)
    timerInterval = setInterval(() => {
        timer++; // Erhöhen Sie den Timer jede Sekunde um 1
        document.getElementById('timer').textContent = timer + 's'; // Aktualisieren Sie die Anzeige des Timers
    }, 1000); // Aktualisieren Sie den Timer alle 1000ms (1 Sekunde)
}

function stopTimer() {
    clearInterval(timerInterval); // Stoppen Sie den Timer
}

// Rufen Sie startTimer auf, wenn das Spiel gestartet wird:
document.getElementById("restart-button").addEventListener("click", function() {
    restartGame();
    startTimer(); // Starten des Timers beim Neustart des Spiels
});

// Funktion zum Speichern der Spielerdaten und Navigieren zur Index-Seite
function submitAndGoBack() {
    let moveCount = document.getElementById('move-count').textContent;
    let timerValue = document.getElementById('timer').textContent;

    // Speichern der Daten im Local Storage
    localStorage.setItem('memoryGameMoves', moveCount);
    localStorage.setItem('memoryGameTime', timerValue);

    // Navigieren zur Index-Seite (oder schließen des Fensters)
    window.location.href = 'index.html'; // Ersetzen Sie 'index.html' mit dem Pfad zu Ihrer Hauptseite
}

// Event-Listener für den "Absenden und zurück" Button
document.getElementById('absenden').addEventListener('click', function(){
	sendeDaten();
    submitAndGoBack();
	window.close();
  let punkte = document.querySelectorAll('.matched').length; // Anzahl der übereinstimmenden Karten als Punkte
  let zeit = timer; // Verwenden Sie den Timerwert als Zeit
  var url = "index.htm?punkte=" + punkte + "&zeit=" + zeit;
  
  window.location.href = url;
}