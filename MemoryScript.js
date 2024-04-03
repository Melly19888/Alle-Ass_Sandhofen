document.getElementById("absenden").style.display = "none";

// Karten Bilder info
let cardsList = [
		{"name" : "Melly1", "img_src" : "IMG/Memo/img1.png"},
		{"name" : "Melly2", "img_src" : "IMG/Memo/img2.png"},
		{"name" : "Melly3", "img_src" : "IMG/Memo/img3.png"},
		{"name" : "Melly4", "img_src" : "IMG/Memo/img4.png"},
		{"name" : "Melly5", "img_src" : "IMG/Memo/img5.png"},
		{"name" : "Melly6", "img_src" : "IMG/Memo/img6.png"},
		{"name" : "Melly7", "img_src" : "IMG/Memo/img7.png"},
		{"name" : "Melly8", "img_src" : "IMG/Memo/img8.png"},
];
let count = 0;
let firstCardGuess = "";
let secondCardGuess = "";
let cardBoard = document.getElementById('card-board');
let grid = document.createElement('div');
let cardGrid = cardsList.concat(cardsList);
let shuffledCards = shuffleArray(cardGrid);
let moveCount = 0; // Initialisierung des Zugzählers
let timerValue = document.getElementById('timer').textContent;
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
let gameStarted = false; // Variable to track if the game has started
let timerInterval; // Variable für das Intervall
let timer = 0; // Variable für die Sekundenzählung

grid.setAttribute('class', 'grid');
cardBoard.appendChild(grid);
// Rufen Sie die Funktion auf, wenn das Fenster geladen wird
window.onload = loadAndDisplayResults;

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
function shuffleArray(arr){
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
// Funktion zum Laden und Anzeigen von Punkten und Zeit
function loadAndDisplayResults() {
    // Abrufen der Daten aus dem Local Storage
    let points = localStorage.getItem('memoryGameMoves');
    let time = localStorage.getItem('memoryGameTime');
    let playerName = localStorage.getItem('playerName'); // Stellen Sie sicher, dass dieser Wert beim Spielende gesetzt wird

    // Überprüfen, ob Daten vorhanden sind
    if (playerName && points && time) {
        // Erstellen einer neuen Zeile für die Tabelle
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${playerName}</td>
            <td>${points}</td>
            <td>${time}</td>
        `;

        // Hinzufügen der neuen Zeile zur Tabelle
        document.getElementById('spielerDaten').appendChild(newRow);
    }
}
function showCardBoard(){
    shuffledCards.forEach(item => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = item.name;
        card.innerHTML = `<img src = "${item.img_src}">`;
        grid.appendChild(card);
    })
}
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
function submitAndGoBack() {
    let moveCount = document.getElementById('move-count').textContent; // Stellen Sie sicher, dass es ein Element mit dieser ID gibt
    let timerValue = document.getElementById('timer').textContent; // Stellen Sie sicher, dass es ein Element mit dieser ID gibt

    // Speichern der Daten im Local Storage
    localStorage.setItem('memoryGameMoves', moveCount);
    localStorage.setItem('memoryGameTime', timerValue);

    // Navigieren zur Index-Seite (oder schließen des Fensters)
    window.location.href = 'index.html'; // Ersetzen Sie 'index.html' mit dem Pfad zu Ihrer Hauptseite
}
function saveGameData() {
  let moves = document.getElementById('move-count').textContent;
  let time = document.getElementById('timer').textContent;
  localStorage.setItem('memoryGameMoves', moves);
  localStorage.setItem('memoryGameTime', time);
}

// Rufen Sie startTimer auf, wenn das Spiel gestartet wird:
document.getElementById("restart-button").addEventListener("click", function() {
    restartGame();
    startTimer(); // Starten des Timers beim Neustart des Spiels
});
// Rufen Sie saveGameData() auf, wenn das Spiel beendet ist oder wenn der Benutzer auf "Absenden und zurück" klickt.
document.getElementById('absenden').addEventListener('click', function(){
    	  saveGameData();
   	localStorage.setItem('memoryGameMoves', moveCount);
	localStorage.setItem('memoryGameTime', timer);
	
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


