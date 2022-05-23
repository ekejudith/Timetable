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

const buttons = document.getElementsByClassName('deleteButton');
console.log(buttons);

// eslint-disable-next-line no-unused-vars
async function deleteLink(fileId) {
  const linkToDelete = document.getElementById(`${fileId}`);
  try {
    const result = await fetch(`/api/subject/${fileId}`, {
      method: 'DELETE',
    });
    if (result.status === 200) {
      linkToDelete.remove();
    }
  } catch (error) {
    console.log(error);
  }
}
// eslint-disable-next-line no-unused-vars
async function showLinks(subjectID) {
  try {
    let body = '<h4>Files: </h4>';
    const result = await fetch(`/api/${subjectID}`, { method: 'GET' });
    const files = await result.json();
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      body += `<div>
      <a href="/${file.filePath}" download=${file.fileName}>
          ${file.fileName}
          </a>
      </div>`;
    }
    body += `<button class="button" onclick="hideLinks('${subjectID}')">Hide files.</button>`;
    document.getElementById(subjectID).innerHTML = body;
  } catch (error) {
    console.log(error);
  }
}

// eslint-disable-next-line no-unused-vars
function hideLinks(subjectID) {
  document.getElementById(subjectID).innerText = '';
}
