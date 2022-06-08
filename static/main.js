/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
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

const buttons = document.getElementsByClassName('deleteButton');

function openErrorPopup(message) {
  const popup = document.getElementById('errorPopup');
  popup.querySelector('h4').innerText = message;
  popup.classList.add('open-errorPopup');
}

function closeErrorPopup() {
  const popup = document.getElementById('errorPopup');
  popup.classList.remove('open-errorPopup');
}

function openOkPopup(message) {
  const popup = document.getElementById('okPopup');
  popup.querySelector('h4').innerText = message;
  popup.classList.add('open-okPopup');
}

function closeOkPopup() {
  const popup = document.getElementById('okPopup');
  popup.classList.remove('open-okPopup');
}

const form = document.getElementById('form_tantargyak');
form.addEventListener('submit', async (e) => {
  if (!(nameValidator() && courseValidator() && seminarValidator() && labValidator())) {
    e.preventDefault();
  }
});

async function deleteLink(fileId) {
  const linkToDelete = document.getElementById(`${fileId}`);
  try {
    const result = await fetch(`/api/subject/${fileId}`, {
      method: 'DELETE',
    });
    if (result.status === 200) {
      linkToDelete.remove();
      openOkPopup('Deleted succesfully!');
    } else {
      openErrorPopup('Deletion unsuccesfull!');
    }
  } catch (error) {
    console.log(error);
  }
}

async function showLinks(subjectID) {
  try {
    const subject = document.getElementById(subjectID);
    if (subject.childNodes.length === 0) {
      let body = document.createElement('h4');
      let content = document.createTextNode('Files:');
      body.appendChild(content);
      subject.appendChild(body);

      const result = await fetch(`/api/${subjectID}`, { method: 'GET' });
      const files = await result.json();

      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        body = document.createElement('div');
        const link = document.createElement('a');
        link.setAttribute('href', `/${file.filePath}`);
        link.setAttribute('download', `${file.fileName}`);
        content = document.createTextNode(`${file.fileName}`);
        link.appendChild(content);
        body.appendChild(link);
        subject.appendChild(body);
      }
      body = document.createElement('button');
      body.setAttribute('class', 'button');
      body.setAttribute('onclick', `hideLinks('${subjectID}')`);
      content = document.createTextNode('Hide files.');
      body.appendChild(content);
      subject.appendChild(body);
    }
  } catch (error) {
    console.log(error);
  }
}

// eslint-disable-next-line no-unused-vars
function hideLinks(subjectID) {
  const subject = document.getElementById(subjectID);
  while (subject.firstChild) {
    subject.removeChild(subject.firstChild);
  }
}

function openUserInformations() {
  document.getElementById('userInformation').style.visibility = 'visible';
}

function closeUserInformations() {
  document.getElementById('userInformation').style.visibility = 'hidden';
}

async function logout() {
  try {
    const result = await fetch('/api/logout', {
      method: 'POST',
    });
    if (result.status === 200) {
      window.open('http://localhost:8080/', '_self');
    }
  } catch (error) {
    console.log(error);
  }
}

function login() {
  window.open('http://localhost:8080/login', '_self');
}
