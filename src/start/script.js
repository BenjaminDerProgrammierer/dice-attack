const characterStats = {
    "Link": { lives: 10, attack: 2 },
    "Zelda": { lives: 15, attack: 1 },
    "Ganon": { lives: 5, attack: 3 }
};

const playerOneCharacters = document.querySelectorAll('.playerOne .character');
const playerTwoCharacters = document.querySelectorAll('.playerTwo .character');
const playButton = document.querySelector('.play-button');
const playerOneNameElement = document.getElementById('namePlayerOne');
const playerTwoNameElement = document.getElementById('namePlayerTwo');

let playerOneName = localStorage.getItem('playerOneName');
let playerTwoName = localStorage.getItem('playerTwoName');
let selectedPlayerOneCharacter = null;
let selectedPlayerTwoCharacter = null;

if (!playerOneName || !playerTwoName) {
    window.location.href = '/';
}

playerOneNameElement.innerText = playerOneName;
playerTwoNameElement.innerText = playerTwoName;

playerOneCharacters.forEach(character => {
    character.addEventListener('click', () => {
        if (selectedPlayerOneCharacter) {
            selectedPlayerOneCharacter.classList.remove('selected');
        }
        character.classList.add('selected');
        selectedPlayerOneCharacter = character;
    });
});

playerTwoCharacters.forEach(character => {
    character.addEventListener('click', () => {
        if (selectedPlayerTwoCharacter) {
            selectedPlayerTwoCharacter.classList.remove('selected');
        }
        character.classList.add('selected');
        selectedPlayerTwoCharacter = character;
    });
});

playButton.addEventListener('click', (e) => {
    if (!selectedPlayerOneCharacter || !selectedPlayerTwoCharacter) {
        e.preventDefault();
        playButton.innerText = "Select Characters first!";
        playButton.style.backgroundColor = "var(--zelda-color-2)";
        setTimeout(() => {
            playButton.innerText = "Start Game";
            playButton.style.backgroundColor = "";
        }, 1000);
    } else {
        const playerOneCharacterName = selectedPlayerOneCharacter.querySelector('.name').innerText;
        const playerTwoCharacterName = selectedPlayerTwoCharacter.querySelector('.name').innerText;
        e.target.href = `/play/index.html?player1Name=${encodeURIComponent(playerOneName)}&player2Name=${encodeURIComponent(playerTwoName)}&player1Lives=${encodeURIComponent(characterStats[playerOneCharacterName].lives)}&player2Lives=${encodeURIComponent(characterStats[playerTwoCharacterName].lives)}&player1Attack=${encodeURIComponent(characterStats[playerOneCharacterName].attack)}&player2Attack=${encodeURIComponent(characterStats[playerTwoCharacterName].attack)}&player1Character=${encodeURIComponent(playerOneCharacterName)}&player2Character=${encodeURIComponent(playerTwoCharacterName)}`;
    }
})

statsElements.forEach(stats => {
    const characterName = stats.previousElementSibling.previousElementSibling.innerText;
    const character = characterStats[characterName];
    stats.innerHTML =
`<div class="livesContainer">
    <object type="image/svg+xml" data="/assets/heart.svg" class="icon" title="Lives"></object>
    <span>${character.lives}</span>
</div>
<div class="attackContainer">
    <object type="image/svg+xml" data="/assets/sword.svg" class="icon" title="Attack"></object>
    <span>${character.attack}</span>
</div>`;
    stats.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('load', () => {
            const svgDoc = icon.contentDocument;
            if (svgDoc) {
                svgDoc.querySelector("svg").style.color = "#fff";
            }
        });
    });
});