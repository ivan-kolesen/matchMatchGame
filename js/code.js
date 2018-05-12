//compares classname and the number of cards
const fieldSize = {
    "game__field__card_low": 10,
    "game__field__card_medium": 18,
    "game__field__card_hard": 24
};

//array of all possible back images
const cardBackImages = [
    'liverpool',
    'liverpool',
    'barcelona',
    'barcelona',
    'mancity',
    'mancity',
    'bayern',
    'bayern',
    'juventus',
    'juventus',
    'arsenal',
    'arsenal',
    'real',
    'real',
    'borussia',
    'borussia',
    'chelsea',
    'chelsea',
    'atletico',
    'atletico',
    'roma',
    'roma',
    'psg',
    'psg'
];

//will store array of cards for current game according it's difficulty
let currentCardArray;

//will store the number of cards in current game
let numberOfCards;

document.querySelector('.greeting__button').addEventListener('click', openSettingsSection);
document.querySelector('.settings__button').addEventListener('click', openGameSection);
document.querySelector('.result__button').addEventListener('click', openHighscoresSection);

function openSettingsSection() {
    document.querySelector('.greeting').style.display = "none";
    document.querySelector('.settings').style.display = "block";
}

function openGameSection() {
    if (!checkValidity()) {
        return alert('You should enter correct data!');
    }
    document.querySelector('.settings').style.display = "none";
    document.querySelector('.game').style.display = "block";
    generateCards();
    setInterval("timer()", 1000);
}

function openHighscoresSection() {
    document.querySelector('.result').style.display = "none";
    document.querySelector('.highscores').style.display = "block";
    createHighscoresTable();
}

function openResultSection() {
    document.querySelector('.game').style.display = "none";
    document.querySelector('.result').style.display = "block";
}

//returns the pattern to the card that was chosen in settings
function getPattern() {
    let arrayOfPatterns = document.getElementsByName('pattern');
    return Array.prototype.filter.call(arrayOfPatterns, i => i.checked)[0].value;
}

//returns the name of class according the difficulty that was chosen on the second page
function getDifficulty() {
    let arrayOfDifficulties = document.getElementsByName('difficulty');
    return Array.prototype.filter.call(arrayOfDifficulties, i => i.selected)[0].value;
}

//associates the name of class and the number of cards
function getNumberOfCards() {
    return fieldSize[getDifficulty()];
}

//returns a slice of all cards array according chosen difficulty
function getCurrentCardArray() {
    return cardBackImages.slice(0, numberOfCards);
}

function createCard() {
    let backImage = getBackImage();
    let card = createBlankCard(backImage);
    let front = createCardFront();
    let back = createCardBack(backImage);
    card.appendChild(front);
    card.appendChild(back);
    return card;
}

function createBlankCard(backImage) {
    let blankCard = document.createElement('div');
    blankCard.classList.add('game__field__card');
    blankCard.classList.add(getDifficulty());
    blankCard.setAttribute("name", backImage);
    blankCard.addEventListener('click', cardTurn);
    return blankCard;
}

function createCardFront() {
    let cardFront = document.createElement('div');
    cardFront.classList.add('game__field__card__front');
    cardFront.classList.add(getPattern());
    return cardFront;
}

function createCardBack(backImage) {
    let cardBack = document.createElement('div');
    cardBack.classList.add('game__field__card__back');
    cardBack.classList.add(backImage);
    return cardBack;
}

function getBackImage() {
    let randomIndexFromArray = Math.floor(Math.random() * (currentCardArray.length));
    let backImage = currentCardArray[randomIndexFromArray];
    currentCardArray.splice(randomIndexFromArray, 1);
    return backImage;
}

//creates a field with cards
function generateCards() {
    let field = document.querySelector('.game__field');
    numberOfCards = getNumberOfCards();
    currentCardArray = getCurrentCardArray();
    for (let i = 0; i < numberOfCards; i++) {
        let card = createCard();
        field.appendChild(card);
    }
}

function cardTurn() {
    this.classList.toggle('game__field__card_turn');
    setTimeout(() => checkCardsMatched(this), 700);
}

//stores the number of opened cards
let openedCardsCount = 0;

let firstOpenedCard = null;

function checkCardsMatched(currentOpenedCard) {
    if (firstOpenedCard) {
        if (firstOpenedCard === currentOpenedCard) {
            firstOpenedCard = null;
            return;
        }

        if (currentOpenedCard.getAttribute('name') === firstOpenedCard.getAttribute('name')) {
            currentOpenedCard.lastElementChild.style.opacity = "0";
            currentOpenedCard.style.visibility = "hidden";
            firstOpenedCard.lastElementChild.style.opacity = "0";
            firstOpenedCard.style.visibility = "hidden";
            openedCardsCount += 2;
            checkFinish();
        } else {
            currentOpenedCard.classList.toggle('game__field__card_turn');
            firstOpenedCard.classList.toggle('game__field__card_turn');
        }
        firstOpenedCard = null;
    } else {
        firstOpenedCard = currentOpenedCard;
    }
}

function checkFinish() {
    if (openedCardsCount === numberOfCards) {
        let time = document.querySelector(".game__timer").innerText;
        document.querySelector('.result').querySelector('h4').innerText = time;
        openResultSection();
        let inputs = document.querySelectorAll('input');
        const newPlayer = new Player(inputs[0].value, inputs[1].value, inputs[2].value, time);
        localStorage.setItem('mmg' + Date.now(), newPlayer.name + ' ' + newPlayer.surname + ',' + newPlayer.score);
    }
}

//checks validity of name, surname and email
function checkValidity() {
    let inputs = document.querySelectorAll('input');
    return Array.prototype.every.call(inputs, i => i.validity.valid);
}

function Player(name, surname, email, score) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.score = score;
}

//bubble sort for 2-d array by second element
function bubbleSort(array) {
    let length = array.length;
    for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - 1 - i; j++) {
            if (array[j + 1][1] < array[j][1]) {
                let t = array[j + 1];
                array[j + 1] = array[j];
                array[j] = t;
            }
        }
    }
    return array;
}

//takes from localstorage only match-match game notes, sorts them and return an array with first 10
function getHighscores() {
    let allScores = [];
    let storageCount = localStorage.length;
    for (let i = 0; i < storageCount; i++) {
        if (localStorage.key(i).substr(0, 3) === 'mmg') {
            allScores.push(localStorage.getItem(localStorage.key(i)).split(','));
        }
    }
    allScores = bubbleSort(allScores).slice(0, 10);
    return allScores;
}

function createHighscoresTable() {
    let recordsArray = getHighscores();
    let recordsTable = document.querySelector('table');
    for (let i = 0; i < recordsArray.length; i++) {
        let tableRow = document.createElement("tr");
        let playerName = document.createElement("td");
        let playerScore = document.createElement("td");
        playerName.innerText = recordsArray[i][0];
        playerScore.innerText = recordsArray[i][1];
        tableRow.appendChild(playerName);
        tableRow.appendChild(playerScore);
        recordsTable.appendChild(tableRow);
    }
}

//timer
let seconds = 0;
let minutes = 0;
let formattedSeconds;

function timer() {
    seconds++;
    if (seconds > 59) {
        minutes++;
        seconds = 0;
    }
    if (seconds > 9) {
        formattedSeconds = seconds;
    } else {
        formattedSeconds = "0" + seconds;
    }

    document.querySelector(".game__timer").innerHTML = minutes + "' " + formattedSeconds + "\"";
}






