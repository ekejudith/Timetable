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

const scheduleForm = document.getElementById('schedule_form');
scheduleForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const myform = e.target;
  const formData = new FormData(myform);

  const resp = await fetch('/schedule/add ', { method: 'POST', body: formData });
  if (resp.status === 200) {
    openOkPopup('Added succesfully!');
  } else {
    openErrorPopup('Cannot add to timetable!');
  }
});

function adminInsert() {
  const table = document.getElementById('wishes');
  const buttonsResolve = table.getElementsByClassName('resolve');

  for (let i = 0; i < buttonsResolve.length; i += 1) {
    const button = buttonsResolve[i];
    button.onclick = async () => {
      const rowId = this.parentNode.parentNode.rowIndex;
      const rowSelected = table.getElementsByTagName('tr')[rowId];
      const col = rowSelected.getElementsByTagName('td');

      const wish = {
        day: col[0].id,
        hour: col[1].id,
        year: col[2].id,
        type: col[3].id,
        subject: col[4].id,
        teacher: col[5].id,
        status: col[7].id,
        method: col[6].id,
      };
      console.log(wish);

      const response = await fetch(
        '/schedule/wish',
        {
          method: 'POST',
          body: JSON.stringify(wish),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      );
      if (response.status === 200) {
        openOkPopup('Accepted succesfully!');
      } else {
        openErrorPopup('Cannot accept request!');
      }
      rowSelected.style.backgroundColor = 'yellow';
    };
  }
}

function adminDelete() {
  const table = document.getElementById('wishes');
  const buttonsReject = table.getElementsByClassName('reject');
  for (let i = 0; i < buttonsReject.length; i += 1) {
    const button = buttonsReject[i];
    console.log(button);
    button.onclick = async () => {
      const rowId = this.parentNode.parentNode.rowIndex;
      console.log(rowId);

      const rowSelected = table.getElementsByTagName('tr')[rowId];
      console.log(rowSelected.getElementsByTagName('td').innerHTML);
      const col = rowSelected.getElementsByTagName('td');

      const wish = {
        day: col[0].id,
        hour: col[1].id,
        year: col[2].id,
        type: col[3].id,
        subject: col[4].id,
        teacher: col[5].id,
        status: col[7].id,
        method: col[6].id,
      };
      const response = await fetch(
        '/schedule/wish',
        {
          method: 'Delete',
          body: JSON.stringify(wish),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      );
      if (response.status === 200) {
        openOkPopup('Rejected succesfully!');
      } else {
        openErrorPopup('Cannot reject request!');
      }
    };
  }
}

function userDelete() {
  const table = document.getElementById('timetable');
  const userButtons = table.getElementsByTagName('button');
  for (let i = 0; i < userButtons.length; i += 1) {
    const button = userButtons[i];
    console.log(button);
    button.onclick = async () => {
      const rowId = this.parentNode.parentNode.rowIndex;
      console.log(rowId);

      const rowSelected = table.getElementsByTagName('tr')[rowId];
      console.log(rowSelected.getElementsByTagName('td').innerHTML);
      const col = rowSelected.getElementsByTagName('td');

      const wish = {
        day: col[0].id,
        hour: col[1].id,
        year: col[2].id,
        type: col[3].id,
        subject: col[4].id,
        teacher: col[5].id,
      };
      const response = await fetch(
        '/schedule/wish',
        {
          method: 'Delete',
          body: JSON.stringify(wish),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      );
      if (response.status === 200) {
        openOkPopup('Request added succesfully!');
      } else {
        openErrorPopup('Cannot add request!');
      }
    };
  }
}

adminInsert();
adminDelete();
userDelete();

const form = document.getElementById('form_tantargyak');
form.addEventListener('submit', async (e) => {
  if (!(nameValidator() && courseValidator() && seminarValidator() && labValidator())) {
    e.preventDefault();
  }
});
