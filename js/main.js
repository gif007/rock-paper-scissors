

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/////                            GAME SCREENS                            /////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function startScreen() {
    // Create the start screen
    wipeScreen();
    const form = document.createElement('form');
    const nameInput = document.createElement('input');
    form.appendChild(nameInput);
    form.setAttribute('class', 'text-center');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('maxlength', '20');
    nameInput.setAttribute('id', 'player-name');
    nameInput.setAttribute('placeholder', 'Your name...');
    const startButton = document.createElement('button');
    form.appendChild(startButton);
    const header = document.createElement('h1');
    header.textContent = 'What is your name?';
    header.setAttribute('class', 'text-center');
    startButton.textContent = 'Begin';
    startButton.style.display = 'block';
    startButton.setAttribute('class', 'mx-auto mt-2 btn btn-info');

    nameInput.addEventListener('keyup', enterInput);

    function enterInput(e) {
        // called if enter key is pressed while input is focused
        if (e.code === 'Enter') {
            let props = {playerName: nameInput.value};
            beginRoundScreen(props);
        }
    }

    startButton.onclick = function () {
        let props = {playerName: nameInput.value};
        beginRoundScreen(props);
    }

    let elementSet = [header, form];
    elementSet.forEach(element => container.appendChild(element));
    nameInput.focus();
}


function beginRoundScreen(props) {
    // Create a screen with player options
    wipeScreen();

    const header = document.createElement('h2');
    header.textContent = 'Choose Your Weapon'
    header.setAttribute('class', 'text-center');
    container.appendChild(header);

    const nameplate = document.createElement('p');
    nameplate.textContent = 'Player: ' + props.playerName;
    nameplate.setAttribute('class', 'text-center');
    container.appendChild(nameplate);

    if (props.counters) {
        const scoreCard = document.createElement('div');
        scoreCard.setAttribute('class', 'text-center');
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
        scoreCard.appendChild(winTotal);
        scoreCard.appendChild(lossTotal);
        scoreCard.appendChild(tieTotal);
        container.appendChild(scoreCard);
    }
    popChoices(props);
}


function endOfRound(props) {
    // Create a screen for displaying results
    wipeScreen();
    const header1 = document.createElement('h4');
    header1.setAttribute('class', 'text-center');
    const header2 = document.createElement('h4');
    header2.setAttribute('class', 'text-center');
    const header3 = document.createElement('h1');
    header3.setAttribute('class', 'text-center');
    let outcome = '';
    let result = props.result;

    if (!props.counters) {
        props.counters = {wins: 0,
                          losses: 0,
                          ties: 0}
    }

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
    header1.textContent = props.playerName + ' has chosen ' + props.playerChoice;
    header2.textContent = 'Computer has chosen ' + props.computerChoice;
    header3.textContent = props.playerName + ' has ' + outcome;
    container.appendChild(header1);
    container.appendChild(header2);
    container.appendChild(header3);

    const buttonFrame = document.createElement('div');
    buttonFrame.setAttribute('class', 'text-center');
    const replayButton = document.createElement('button');
    replayButton.setAttribute('class', 'btn btn-info');
    replayButton.textContent = 'Play again';
    replayButton.onclick = function () {
        beginRoundScreen(props);
    }

    const renameButton = document.createElement('button');
    renameButton.setAttribute('class', 'ml-2 btn btn-info');
    renameButton.textContent = 'Choose new name';
    renameButton.onclick = startScreen;
    buttonFrame.appendChild(replayButton);
    buttonFrame.appendChild(renameButton);
    container.appendChild(buttonFrame);
}


//////////////////////
// UTILITY FUNCTIONS//
//////////////////////


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
    choices.forEach(element => div.appendChild(element));
    container.appendChild(div);
}


function wipeScreen(){
    // Clear the game screen
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
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


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/////                            GAME FUNCTIONS                          /////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


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