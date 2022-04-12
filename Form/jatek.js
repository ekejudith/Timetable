


function initComponenets() {
    document.getElementById("player-name").innerHTML = sessionStorage.getItem("myName");
    document.getElementById("player-nickname").innerHTML = sessionStorage.getItem("myNickname");
    document.getElementById("player-money").innerHTML = sessionStorage.getItem("myMoney");
    document.getElementById("server-money").innerHTML = Math.floor((Math.random() * (100) + 1));

    let imageList = document.querySelectorAll(".server-images>img");

    imageList.forEach(function (elem) {
        elem.style.display = "none";
    });
}


function hideImages() {
    let imageList = document.querySelectorAll(".player-images>img");
    imageList.forEach(function (elem) {
        elem.style.display = "none";
    });
}

function computer() {

    let number = Math.floor(Math.random() * 3 + 1);
    if (number == 1) {
        document.getElementById("server-rock").style.display = "block";
        document.getElementById("server-paper").style.display = "none";
        document.getElementById("server-scissors").style.display = "none";
    }
    else if (number == 2) {
        document.getElementById("server-paper").style.display = "block";
        document.getElementById("server-rock").style.display = "none";
        document.getElementById("server-scissors").style.display = "none";

    } else {
        document.getElementById("server-scissors").style.display = "block";
        document.getElementById("server-paper").style.display = "none";
        document.getElementById("server-rock").style.display = "none";
    }
    return number;
}

function check() {
    let computerMoney = document.getElementById("server-money").innerHTML;
    let myMoney = document.getElementById("player-money").innerHTML;

    if (computerMoney == 0 || myMoney == 0) {
        alert("Game over!");
        return false;
    }
    else {
        return true;
    }
}

function computerWon() {
    let money = document.getElementById("player-money").innerHTML;
    money -= 1;
    document.getElementById("player-money").innerHTML = money;
    document.getElementById("message").innerHTML = "Computer won!";
}

function playerWon() {
    let money = document.getElementById("server-money").innerHTML;
    money -= 1;
    document.getElementById("server-money").innerHTML = money;
    document.getElementById("message").innerHTML = "You won!";

}

function equal() {
    document.getElementById("message").innerHTML = "Equals!";
}


function selectRock() {
    if (check()) {
        document.getElementById("player-paper").style.display = "none";
        document.getElementById("player-scissors").style.display = "none";
        let choice = computer();
        if (choice == 1) {
            equal();
        }
        else if (choice == 2) {
            computerWon();
        }
        else {
            playerWon();
        }
    }
}

function selectPaper() {
    if (check()) {
        document.getElementById("player-rock").style.display = "none";
        document.getElementById("player-scissors").style.display = "none";
        let choice = computer();
        if (choice == 1) {
            playerWon();
        }
        else if (choice == 2) {
            equal();
        }
        else {
            computerWon();
        }
    }

}

function selectScissors() {
    if (check()) {
        document.getElementById("player-rock").style.display = "none";
        document.getElementById("player-paper").style.display = "none";
        let choice = computer();
        if (choice == 1) {
            computerWon();
        }
        else if (choice == 2) {
            playerWon();
        }
        else {
            equal();
        }
    }
}

function newGame() {
    if (check()) {
        document.getElementById("message").innerHTML = "";

        let imageList1 = document.querySelectorAll(".server-images>img");
        imageList1.forEach(function (elem) {
            elem.style.display = "none";
        });

        let imageList2 = document.querySelectorAll(".player-images>img");
        imageList2.forEach(function (elem) {
            elem.style.display = "block";
        });
    }
}