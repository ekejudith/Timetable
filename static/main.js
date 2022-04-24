function nameValidator() {
  const regex = /^[a-zA-Z ]+$/;
  const name = document.getElementById('name').value;

  if (!regex.test(name)) {
    document.getElementById('name').setCustomValidity('Invalid field.');
    return false;
  }

  document.getElementById('name').setCustomValidity('');
  return true;
}

function courseValidator() {
  if (document.getElementById('course').value <= 0) {
    document.getElementById('course').setCustomValidity('Invalid field.');
    return false;
  }

  document.getElementById('course').setCustomValidity('');
  return true;
}

function seminarValidator() {
  if (document.getElementById('seminar').value <= 0) {
    document.getElementById('seminar').setCustomValidity('Invalid field.');
    return false;
  }

  document.getElementById('seminar').setCustomValidity('');
  return true;
}

function labValidator() {
  if (document.getElementById('lab').value <= 0) {
    document.getElementById('lab').setCustomValidity('Invalid field.');
    return false;
  }

  document.getElementById('lab').setCustomValidity('');
  return true;
}

const form = document.getElementById('form_tantargyak');
form.addEventListener('submit', (e) => {
  if (!(nameValidator() && courseValidator() && seminarValidator() && labValidator())) {
    e.preventDefault();
  }
});
