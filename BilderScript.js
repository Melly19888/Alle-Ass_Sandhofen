let startTime;
let interval;
let points = 0;
let timeElapsed;
let currentQuestionIndex = 0;
let score = 0;



const quizData = [
    {
        imageSrc: 'IMG/WerIstEs/IMG.jpg',
        options: ['Abraham Luncoln', 'Abraham Lincoln', 'Ahbraham Lincoln'],
        correctOptionIndex: 1
    },
    {
        imageSrc: 'IMG/WerIstEs/IMG1.jpg',
        options: ['Antonie Hopkins', 'Antonies Hopkinst', 'Hantonie Hopkins'],
        correctOptionIndex: 0
    },
	{
        imageSrc: 'IMG/WerIstEs/IMG2.jpg',
        options: ['Barth Simsons', 'Barth Siemson', 'Bart Simson'],
        correctOptionIndex: 2
    },
    {
        imageSrc: 'IMG/WerIstEs/IMG3.jpg',
        options: ['Karl Marx', 'Karl Marz', 'Karl Max'],
        correctOptionIndex: 0
    },
	{
        imageSrc: 'IMG/WerIstEs/IMG4.jpg',
        options: ['Marelyn Monroes', 'Marilyn Monroe', 'Mayn Monroe'],
        correctOptionIndex: 1
    },
    {
        imageSrc: 'IMG/WerIstEs/IMG5.jpg',
        options: ['Mark Zuckerberg', 'Markus Zuckerberg', 'Marks Zuckerer'],
        correctOptionIndex: 0
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG6.jpg',
        options: ['Nilson Mondela', 'Nilson Mandela', 'Nelson Mandela'],
        correctOptionIndex: 2
    },
    {
        imageSrc: 'IMG/WerIstEs/IMG7.jpg',
        options: ['Roman Atkinson', 'Rowan Atkinson', 'Rowan Altkinson'],
        correctOptionIndex: 1
    },
	{
        imageSrc: 'IMG/WerIstEs/IMG8.jpg',
        options: ['Will Smith', 'Will Schmitt', 'Willi Smith'],
        correctOptionIndex: 0
    },
    {
        imageSrc: 'IMG/WerIstEs/IMG9.jpg',
        options: ['Willy Brand', 'Willie Brandt', 'Willy Brandt'],
        correctOptionIndex: 2
    },
	{
        imageSrc: 'IMG/WerIstEs/IMG10.jpg',
        options: ['Elcon Musk', 'Elon Musk', 'Elcon Müsk'],
        correctOptionIndex: 1
    },
    {
        imageSrc: 'IMG/WerIstEs/IMG11.jpg',
        options: ['Mel Gibson', 'Melac Gibson', 'Mel Gibsun'],
        correctOptionIndex: 0
    },
	  {
        imageSrc: 'IMG/WerIstEs/IMG12.jpg',
        options: ['Charlie Brown', 'Charly Brown', 'Charly Braun'],
        correctOptionIndex: 1
    },
	{
        imageSrc: 'IMG/WerIstEs/IMG13.jpg',
        options: ['Fred Finkelstein', 'Fred Hinkelstein', 'Fred Feuerstein'],
        correctOptionIndex: 2
    },
    {
        imageSrc: 'IMG/WerIstEs/IMG14.jpg',
        options: ['Tweety', 'Tweeny', 'Tweeties'],
        correctOptionIndex: 0
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG15.jpg',
        options: ['Deutschland', 'Österreich', 'Schweiz'],
        correctOptionIndex: 0
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG16.jpg',
        options: ['Dänemark', 'Australien', 'England'],
        correctOptionIndex: 2
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG17.jpg',
        options: ['Frankreich', 'Kamerun', 'Indien'],
        correctOptionIndex: 0
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG18.jpg',
        options: ['Belgien', 'Niederlande', 'Luxemburg'],
        correctOptionIndex: 1
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG18.jpg',
        options: ['Belgien', 'Niederlande', 'Luxemburg'],
        correctOptionIndex: 1
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG19.jpg',
        options: ['Indien', 'Pakistan', 'Russland'],
        correctOptionIndex: 0
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG20.jpg',
        options: ['Polen', 'Deutschland', 'Russland'],
        correctOptionIndex: 2
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG21.jpg',
        options: ['Estland', 'Spanien', 'Norwegen'],
        correctOptionIndex: 1
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG22.jpg',
        options: ['Georgien', 'Türkei', 'Portugal'],
        correctOptionIndex: 1
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG22.jpg',
        options: ['Georgien', 'Türkei', 'Portugal'],
        correctOptionIndex: 1
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG23.jpg',
        options: ['Ukraine', 'Italien', 'USA'],
        correctOptionIndex: 0
    },
	 {
        imageSrc: 'IMG/WerIstEs/IMG24.jpg',
        options: ['Spanien', 'Vatikan', 'Malta'],
        correctOptionIndex: 1
    },
];


function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    const quizImage = document.getElementById('quiz-image');
    const optionsContainer = document.getElementById('options-container');

    // Set the image source
    quizImage.src = currentQuestion.imageSrc;

    // Clear previous options
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.addEventListener('click', () => checkAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    const currentQuestion = quizData[currentQuestionIndex];

    if (selectedIndex === currentQuestion.correctOptionIndex) {
        score++;
        console.log(`Richtige Antwort! Aktuelle Punktzahl ist ${score}`);
    } else {
        console.log(`Falsche Antwort! Aktuelle Punktzahl ist ${score}`);
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function startQuiz() {
    document.getElementById('start-button').style.display = "none";
    document.getElementById('quiz-container').style.display = "block";

    startTime = Date.now();

    loadQuestion();

    updateTimer();
}

function updateTimer() {
   const timerElement = document.getElementById('timer');
   const timeElapsedMs = Date.now() - startTime;
   const secondsElapsed = Math.floor(timeElapsedMs / 1000);

   timerElement.textContent = `Zeit: ${formatTime(secondsElapsed)}`;

   if (currentQuestionIndex < quizData.length) {
       requestAnimationFrame(updateTimer);
   }
}

function endQuiz() {
   clearInterval(interval);

   const timeElapsedMs = Date.now() - startTime;
   const secondsElapsed = Math.floor(timeElapsedMs / 1000);

   localStorage.setItem('BilderQuizPoints', score.toString());
   localStorage.setItem('BilderTime', formatTime(secondsElapsed));

   window.close(); // Optional, um das Fenster zu schließen oder weiterzuleiten
}

// Hilfsfunktion zum Formatieren der Zeit als "MM:SS"
function formatTime(totalSeconds) {
   const minutes = Math.floor(totalSeconds / 60);
   const seconds = totalSeconds % 60;
   return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Event listener for the start button
document.getElementById('start-button').addEventListener('click', startQuiz);

// Load the first question when the page loads
window.onload = loadQuestion;

