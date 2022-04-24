const myForm = document.getElementById('form');

function emailValidator() {
  const regex = /^([a-zA-Z0-9]+[_.-]{0,1})+@(yahoo|gmail).[a-zA-Z]{2,3}/;
  const email = document.getElementById('email').value;
  if (email === '' || !regex.test(email)) {
    document.getElementById('emailValidatorLabel').removeAttribute('hidden');
    return false;
  }
  document.getElementById('emailValidatorLabel').setAttribute('hidden', 'hidden');
  return true;
}

function webpageValidator() {
  const regex = /(.*\/\/){0,1}[a-zA-Z0-9-]+\.[A-Za-z0-9-]+\.[A-Za-z0-9-]{2,63}(\/.*)?/;
  const webpage = document.getElementById('webpage').value;
  const isValid = myForm.elements[3].validity.valid;
  if (webpage === '' || !regex.test(webpage) || !isValid) {
    document.getElementById('webpageValidatorLabel').removeAttribute('hidden');
    return false;
  }

  document.getElementById('webpageValidatorLabel').setAttribute('hidden', 'hidden');
  return true;
}

function nameValidator() {
  const name = myForm.elements[0].validity.valid;
  if (name === false) {
    document.getElementById('nameValidatorLabel').removeAttribute('hidden');
  } else {
    document.getElementById('nameValidatorLabel').setAttribute('hidden', 'hidden');
  }
  return name;
}

function checkInputs() { // eslint-disable-line complexity
  const button = document.getElementById('submit');
  const name = nameValidator() && myForm.elements[0].validity.valid;
  const date = myForm.elements[1].validity.valid;
  const webpage = webpageValidator() && myForm.elements[2].validity.valid;
  const email = emailValidator() && myForm.elements[3].validity.valid;
  const money = myForm.elements[5].validity.valid;

  if (name && date && webpage && email && money) {
    const myName = document.getElementById('name').value;
    const myNickname = document.getElementById('nickname').value;
    const myMoney = document.getElementById('money').value;

    sessionStorage.setItem('myName', myName);
    sessionStorage.setItem('myNickname', myNickname);
    sessionStorage.setItem('myMoney', myMoney);

    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

const input = document.querySelectorAll('input');
input.forEach((elem) => { elem.addEventListener('change', checkInputs); });

function footer() { // eslint-disable-line no-unused-vars
  document.getElementsByClassName('footer')[0].getElementsByTagName('div')[0].innerHTML = document.lastModified;
}
