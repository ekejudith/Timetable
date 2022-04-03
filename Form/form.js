

function emailValidator() {

    let regex = /^([a-zA-Z0-9]+[_.-]{0,1})+@(yahoo|gmail).[a-zA-Z]{2,3}/;
    let email = document.getElementById("email").value;
    if (email === "" || !regex.test(email)) {

        document.getElementById("emailValidatorLabel").removeAttribute("hidden");
        return false;
    }
    else {
        document.getElementById("emailValidatorLabel").setAttribute("hidden", "hidden");
        return true;

    }

}

function webpageValidator() {
    let regex = /^([a-zA-Z0-9_-]+).([a-zA-Z0-9_-]+).([a-zA-Z0-9_-]+)/;

    let webpage = document.getElementById("webpage").value;
    if (webpage === "" || !regex.test(webpage)) {
        document.getElementById("webpageValidatorLabel").removeAttribute("hidden");
        return false;
    }
    else {
        document.getElementById("webpageValidatorLabel").setAttribute("hidden", "hidden");
        return true;
    }
}


const myForm = document.getElementById("form");

myForm.addEventListener('submit', function (event) {

    let name = myForm.elements[0].validity.valid;
    let date = myForm.elements[1].validity.valid;
    let webpage = webpageValidator() && myForm.elements[2].validity.valid;
    let email = emailValidator() && myForm.elements[3].validity.valid;
    let money = myForm.elements[5].validity.valid;

    if (name && date && webpage && email && money) {
        let myName = document.getElementById("name").value;
        let myNickname = document.getElementById("nickname").value;
        let myMoney = document.getElementById("money").value;

        sessionStorage.setItem("myName", myName);
        sessionStorage.setItem("myNickname", myNickname);
        sessionStorage.setItem("myMoney", myMoney);
    }
    else {
        event.preventDefault();
    }
});

function footer() {
    document.getElementsByClassName("footer")[0].getElementsByTagName("div")[0].innerHTML = document.lastModified;
}


