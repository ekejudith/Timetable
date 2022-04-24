function initComponenets() { // eslint-disable-line no-unused-vars
  document.getElementById('player-name').innerHTML = sessionStorage.getItem('myName');
  document.getElementById('player-nickname').innerHTML = sessionStorage.getItem('myNickname');
  document.getElementById('player-money').innerHTML = sessionStorage.getItem('myMoney');
  document.getElementById('server-money').innerHTML = Math.floor((Math.random() * (100) + 1));

  const imageList = document.querySelectorAll('.server-images>img');

  imageList.forEach((elem) => {
    elem.style.display = 'none'; // eslint-disable-line no-param-reassign
  });
}

function hideImages() { // eslint-disable-line no-unused-vars
  const imageList = document.querySelectorAll('.player-images>img');
  imageList.forEach((elem) => {
    elem.style.display = 'none'; // eslint-disable-line no-param-reassign
  });
}

function computer() {
  const number = Math.floor(Math.random() * 3 + 1);
  if (number === 1) {
    document.getElementById('server-rock').style.display = 'block';
    document.getElementById('server-paper').style.display = 'none';
    document.getElementById('server-scissors').style.display = 'none';
  } else if (number === 2) {
    document.getElementById('server-paper').style.display = 'block';
    document.getElementById('server-rock').style.display = 'none';
    document.getElementById('server-scissors').style.display = 'none';
  } else {
    document.getElementById('server-scissors').style.display = 'block';
    document.getElementById('server-paper').style.display = 'none';
    document.getElementById('server-rock').style.display = 'none';
  }
  return number;
}

function check() {
  const computerMoney = document.getElementById('server-money').innerHTML;
  const myMoney = document.getElementById('player-money').innerHTML;

  if (computerMoney === 0 || myMoney === 0) {
    alert('Game over!');     // eslint-disable-line no-alert
    return false;
  }

  return true;
}

function computerWon() {
  let money = document.getElementById('player-money').innerHTML;
  money -= 1;
  document.getElementById('player-money').innerHTML = money;
  document.getElementById('message').innerHTML = 'Computer won!';
}

function playerWon() {
  let money = document.getElementById('server-money').innerHTML;
  money -= 1;
  document.getElementById('server-money').innerHTML = money;
  document.getElementById('message').innerHTML = 'You won!';
}

function equal() {
  document.getElementById('message').innerHTML = 'Equals!';
}

function selectRock() { // eslint-disable-line no-unused-vars
  if (check()) {
    document.getElementById('player-paper').style.display = 'none';
    document.getElementById('player-scissors').style.display = 'none';
    const choice = computer();
    if (choice === 1) {
      equal();
    } else if (choice === 2) {
      computerWon();
    } else {
      playerWon();
    }
  }
}

function selectPaper() { // eslint-disable-line no-unused-vars
  if (check()) {
    document.getElementById('player-rock').style.display = 'none';
    document.getElementById('player-scissors').style.display = 'none';
    const choice = computer();
    if (choice === 1) {
      playerWon();
    } else if (choice === 2) {
      equal();
    } else {
      computerWon();
    }
  }
}

function selectScissors() { // eslint-disable-line no-unused-vars
  if (check()) {
    document.getElementById('player-rock').style.display = 'none';
    document.getElementById('player-paper').style.display = 'none';
    const choice = computer();
    if (choice === 1) {
      computerWon();
    } else if (choice === 2) {
      playerWon();
    } else {
      equal();
    }
  }
}

function newGame() { // eslint-disable-line no-unused-vars
  if (check()) {
    document.getElementById('message').innerHTML = '';

    const imageList1 = document.querySelectorAll('.server-images>img');
    imageList1.forEach((elem) => {
      elem.style.display = 'none'; // eslint-disable-line no-param-reassign
    });

    const imageList2 = document.querySelectorAll('.player-images>img');
    imageList2.forEach((elem) => {
      elem.style.display = 'block'; // eslint-disable-line no-param-reassign
    });
  }
}
