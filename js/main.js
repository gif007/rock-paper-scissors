// Rock, paper, scissors.

function wipeScreen(){
    // Clear the game screen
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}


function createScoreCard(props) {
    // Create score card
    let winTotal = document.createElement('p');
    winTotal.style.display = 'inline-block';
    winTotal.style.paddingLeft = '12px';
    winTotal.textContent = 'Wins: ' + props.counters.wins;

    let lossTotal = document.createElement('p');
    lossTotal.style.display = 'inline-block';
    lossTotal.style.paddingLeft = '12px';
    lossTotal.textContent = 'Losses: ' + props.counters.losses;

    let tieTotal = document.createElement('p');
    tieTotal.style.display = 'inline-block';
    tieTotal.style.paddingLeft = '12px';
    tieTotal.textContent = 'Ties: ' + props.counters.ties;

    const scoreCard = document.createElement('div');
    scoreCard.appendChild(winTotal);
    scoreCard.appendChild(lossTotal);
    scoreCard.appendChild(tieTotal);

    return scoreCard;
}


// Start screen functions

function startScreen() {
    // Create the start screen
    wipeScreen();

    const nameInput = createNameInput();
    const startButton = createStartButton(nameInput);

    const inputArea = document.createElement('div');
    inputArea.setAttribute('style', 'height: 5rem; display: flex; flex-direction: column; align-items: center; justify-content: space-around')
    inputArea.appendChild(nameInput);
    inputArea.appendChild(startButton);

    const header = document.createElement('h1');
    header.textContent = 'What is your name?';
    header.setAttribute('class', 'text-center');

    let elementSet = [header, inputArea];
    elementSet.forEach(element => container.appendChild(element));

    nameInput.focus();
}


function createNameInput() {
    // Create name input
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('maxlength', '20');
    nameInput.setAttribute('id', 'player-name');
    nameInput.setAttribute('placeholder', 'Your name...');
    nameInput.addEventListener('keyup', enterInput);

    function enterInput(e) {
        // called if enter key is pressed while input is focused
        if (e.code === 'Enter') {
            let props = {playerName: nameInput.value};
            beginRoundScreen(props);
        }
    }

    return nameInput;
}


function createStartButton(nameInput) {
    // Create a start game button
    const startButton = document.createElement('button');
    startButton.textContent = 'Begin';
    startButton.style.display = 'block';
    startButton.setAttribute('class', 'btn btn-info');

    startButton.onclick = function () {
        let props = {playerName: nameInput.value};
        beginRoundScreen(props);
    }

    return startButton;
}


// Player choice screen functions

function beginRoundScreen(props) {
    // Create a screen with player options
    wipeScreen();

    const header = document.createElement('h2');
    header.textContent = 'Choose Your Weapon'
    container.appendChild(header);

    const nameplate = document.createElement('p');

    if (props.playerName) {
        nameplate.textContent = 'Player: ' + props.playerName;
    } else {
        nameplate.textContent = 'Player: Phantom Menace';
    }

    container.appendChild(nameplate);

    if (props.counters) {
        scoreCard = createScoreCard(props);
        container.appendChild(scoreCard);
    }

    popChoices(props);
}


function popChoices(props) {
    // Populate the player choice options for the beginRoundScreen
    const rock = document.createElement('img');
    rock.setAttribute('src', 'images/rock.jpg');
    rock.style.cursor = 'pointer';
    rock.onclick = function () {
        onChoose('rock', props);
    }

    const paper = document.createElement('img');
    paper.setAttribute('src', 'images/paper.jpg');
    paper.onclick = function () {
        onChoose('paper', props);
    }
    paper.style.cursor = 'pointer';

    const scissors = document.createElement('img');
    scissors.setAttribute('src', 'images/scissors.jpg');
    scissors.onclick = function () {
        onChoose('scissors', props);
    }
    scissors.style.cursor = 'pointer';

    let choices = [rock, paper, scissors];

    const div = document.createElement('div');
    div.setAttribute('style', 'display: flex; justify-content: space-around; align-items: center;')
    choices.forEach(element => div.appendChild(element));
    container.appendChild(div);
}


function onChoose(playerChoice, props) {
    // Re-render screen when player selects a choice
    let compChoice = computerPlay();
    let res = determineWinner(playerChoice, compChoice);
    props.computerChoice = compChoice;
    props.playerChoice = playerChoice;
    props.result = res;
    endOfRound(props);
}


// End of round screen functions

function endOfRound(props) {
    // Create a screen for displaying results
    wipeScreen();

    if (!props.counters) {
        props.counters = {wins: 0,
                          losses: 0,
                          ties: 0}
    }

    let result = props.result;
    let outcome = '';

    if (result === 0) {
        outcome = "lost!";
        props.counters.losses++;
    } else if (result === 1) {
        outcome = 'won!';
        props.counters.wins++;
    } else {
        outcome = 'tied!'
        props.counters.ties++;
    }

    const headers = makeHeaders(props, outcome);
    const headersContainer = document.createElement('div');
    headersContainer.setAttribute('style', 'display: flex; flex-direction: column; align-items: center; justify-content: space-around')
    headers.forEach(h => headersContainer.appendChild(h));
    container.appendChild(headersContainer);

    const buttonFrame = makeButtonFrame(props);

    container.appendChild(buttonFrame);
}


function makeButtonFrame(props) {
    // Create end of round button group
    const replayButton = document.createElement('button');
    replayButton.setAttribute('class', 'my-2 btn btn-info');
    replayButton.textContent = 'Play again';

    replayButton.onclick = function () {
        beginRoundScreen(props);
    }

    const renameButton = document.createElement('button');
    renameButton.setAttribute('class', 'my-2 btn btn-info');
    renameButton.textContent = 'Choose new name';
    renameButton.onclick = startScreen;

    const buttonFrame = document.createElement('div');
    buttonFrame.setAttribute('style', 'display: flex; justify-content: space-around; align-items: center; width: 100%;');
    buttonFrame.appendChild(replayButton);
    buttonFrame.appendChild(renameButton);

    return buttonFrame;
}


function makeHeaders(props, outcome){
    // Create end of round headers
    const header1 = document.createElement('h4');
    header1.textContent = props.playerName + ' has chosen ' + props.playerChoice;

    const header2 = document.createElement('h4');
    header2.textContent = 'Computer has chosen ' + props.computerChoice;

    const header3 = document.createElement('h1');
    header3.textContent = props.playerName + ' has ' + outcome;

    return [header1, header2, header3];
}


// Logic and testing

function computerPlay() {
    // Generate a computer choice
    let outcomes = ['rock', 'paper', 'scissors'];
    let num = Math.floor(Math.random() * outcomes.length);

    return outcomes[num];
}


function determineWinner(playerChoice, computerChoice) {
    // Compare player choice against computer choice
    // Return a result code:
    // 0 = lose
    // 1 = win
    // 2 = tie
    if (playerChoice === 'rock') {
        if (computerChoice === 'rock') {
            return 2; // tie
        } else if (computerChoice === 'paper') {
            return 0; // lose
        } else {
            return 1; // win
        }
    } else if (playerChoice === 'paper') {
        if (computerChoice === 'rock') {
            return 1; // win
        } else if (computerChoice === 'paper') {
            return 2; // tie
        } else {
            return 0; // lose
        }
    } else if (playerChoice === 'scissors') {
        if (computerChoice === 'rock') {
            return 0; // lose
        } else if (computerChoice === 'paper') {
            return 1; // win
        } else {
            return 2; // tie
        }
    }
}


function displayOutcome(result) {
    // This is only for testing purposes
    if (result === 0) {
        console.log('You lose');
    } else if (result === 1) {
        console.log('You win');
    } else {
        console.log("It's a tie");
    }
}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/////                            LOAD GAME                               /////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

const container = document.querySelector('div#game-window');
window.onload = startScreen;