const rollBtn = document.querySelector('#rollBtn');
const finalScoreElement = document.querySelector('#finalScore');
const rollsElement = document.querySelector('#rolls');

const player1NameElements = document.querySelectorAll('.player1Name');
const player1ImageElement = document.querySelector('#player1Image');
const player1StatsElement = document.querySelector('#player1Stats');

const player2NameElements = document.querySelectorAll('.player2Name');
const player2ImageElement = document.querySelector('#player2Image');
const player2StatsElement = document.querySelector('#player2Stats');

const diceImages = [
    '../assets/dice-1.svg',
    '../assets/dice-2.svg',
    '../assets/dice-3.svg',
    '../assets/dice-4.svg',
    '../assets/dice-5.svg',
    '../assets/dice-6.svg'
];

const urlParams = new URLSearchParams(window.location.search);
const player1Name = urlParams.get('player1Name');
const player2Name = urlParams.get('player2Name');
const player1Character = urlParams.get('player1Character');
const player2Character = urlParams.get('player2Character');
let player1Lives = urlParams.get('player1Lives');
let player2Lives = urlParams.get('player2Lives');
const player1Attack = urlParams.get('player1Attack');
const player2Attack = urlParams.get('player2Attack');
let statsElements = document.querySelectorAll('.icon');

// Redirect to start if parameters are missing
if (!player1Character || !player2Character || !player1Lives || !player2Lives || !player1Attack || !player2Attack || !player1Name || !player2Name) {
    window.location.href = '/start/';
}

// Set up player info
player1ImageElement.src = `../assets/characters/${player1Character.toLowerCase()}.png`;
player1ImageElement.alt = player1Character;
player1NameElements.forEach(e => e.textContent = player1Name);
setCharacterStats(player1StatsElement, player1Lives, player1Attack);

player2ImageElement.src = `../assets/characters/${player2Character.toLowerCase()}.png`;
player2ImageElement.alt = player2Character;
player2NameElements.forEach(e => e.textContent = player2Name);
setCharacterStats(player2StatsElement, player2Lives, player2Attack);

rollBtn.addEventListener('click', () => {
    const dice1 = rollDice();
    const dice2 = rollDice();

    
    // Delete previous final results
    document.querySelectorAll('.finalScore').forEach(e => e.remove());
    
    const twoDiceElement = document.createElement('div');
    twoDiceElement.classList.add('twoDice');
    
    const dice1Image = document.createElement('object');
    const dice2Image = document.createElement('object');
    
    dice1Image.id = `dice-${Date.now()}-1`;
    dice1Image.type = 'image/svg+xml';
    dice1Image.data = diceImages[dice1 - 1];
    dice1Image.className = 'dice';
    dice1Image.setAttribute('aria-label', `Dice showing ${dice1}`);
    
    dice2Image.id = `dice-${Date.now()}-2`;
    dice2Image.type = 'image/svg+xml';
    dice2Image.data = diceImages[dice2 - 1];
    dice2Image.className = 'dice';
    dice2Image.setAttribute('aria-label', `Dice showing ${dice2}`);
    
    if (dice1 > dice2) {
        updatePlayerLives(player2StatsElement, player2Lives -= player1Attack);
        wiggleElement(player2StatsElement.querySelector('.livesContainer'));
        // color the winning dice green
        dice1Image.addEventListener('load', () => {
            const svgDoc = dice1Image.contentDocument;
            if (svgDoc) {
                svgDoc.querySelector("svg").style.color = "green";
            }
        });

    } else if (dice1 < dice2) {
        updatePlayerLives(player1StatsElement, player1Lives -= player2Attack);
        wiggleElement(player1StatsElement.querySelector('.livesContainer'));
        // color the winning dice green
        dice2Image.addEventListener('load', () => {
            const svgDoc = dice2Image.contentDocument;
            if (svgDoc) {
                svgDoc.querySelector("svg").style.color = "green";
            }
        });
    }

    twoDiceElement.appendChild(dice1Image);
    twoDiceElement.appendChild(dice2Image);
    
    rollsElement.appendChild(twoDiceElement);
    
    if (player1Lives <= 0 || player2Lives <= 0) {
        rollBtn.remove();
        
        if (player1Lives <= 0) {
            finalScoreElement.innerHTML = `<h2><span class="player2Name">${player2Name}</span> hat das Spiel gewonnen!</h2>`;
        } else {
            finalScoreElement.innerHTML = `<h2><span class="player1Name">${player1Name}</span> hat das Spiel gewonnen!</h2>`;
        }
    }
});

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function wiggleElement(element) {
    element.style.animation = 'wiggle 0.5s';
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    });
}

function setCharacterStats(element, lives, attack) {
    element.innerHTML =
        `<div class="livesContainer">
            <object type="image/svg+xml" data="/assets/heart.svg" class="icon" title="Lives"></object>
            <span class="lives">${lives}</span>
        </div>
        <div class="attackContainer">
            <object type="image/svg+xml" data="/assets/sword.svg" class="icon" title="Attack"></object>
            <span class="attack">${attack}</span>
        </div>`;
    element.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('load', () => {
            const svgDoc = icon.contentDocument;
            if (svgDoc) {
                svgDoc.querySelector("svg").style.color = "#fff";
            }
        });
    });
}

function updatePlayerLives(element, lives) {
    if (lives < 0) lives = 0;
    const livesElement = element.querySelector('.lives');
    if (livesElement) livesElement.textContent = lives;
    if (lives <= 0) {
        livesElement.style.color = 'red';
        const icon = element.querySelector('.livesContainer .icon');
        if (icon) {
            const svgDoc = icon.contentDocument;
            if (svgDoc) {
                svgDoc.querySelector("svg").style.color = "red";
            }
        }
    }
}
