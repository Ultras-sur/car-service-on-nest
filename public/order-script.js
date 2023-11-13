const jobs = {
  malar: {
    dver: 'Покраска двери',
    kapot: 'Покраска капота',
    roof: 'Покраска крыши',
    bamper: 'Покраска бампера',
  },
  slesar: {
    oil: 'Замена масла',
    kolodki: 'Замена колодок',
    filter: 'Замена фильтра',
    enginedefense: 'Снятие и установка защиты двигателя',
  },
  diagnostic: {
    engine: 'Диагностика двигателя',
    transmission: 'Диагностика коробки передач',
    electric: 'Диагностика электрической системы',
  },
  insurance: {
    policy: 'Оформление страхового полиса',
  },
};

const startJobSelection = {
  slesar: 'Слесарные работы',
  malar: 'Малярные работы',
  diagnostic: 'Диагностика',
  insurance: 'Страховая поддержка',
};

function removeOptions(selectElement) {
  var i,
    L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}

const findKey = (targetKey, collection) => {
  let result = {};
  if (typeof collection === 'object') {
    const keys = Object.keys(collection);
    if (keys.includes(targetKey)) {
      result[targetKey] = collection[targetKey];
    } else {
      result = keys.reduce((acc, key) => {
        acc = { ...acc, ...findKey(targetKey, collection[key]) };
        return acc;
      }, {});
    }
  }
  return result;
};

function getJobMenu(menu, selection) {
  Object.entries(menu).forEach(([value, text]) => {
    const newOption = new Option(text, value);
    selection.add(newOption);
  });
}

function changeOption2(selectorId) {
  console.log('cahnge');
  const jobSelectionMenu = document.querySelector(`#${selectorId}`);
  const selectedIndex = jobSelectionMenu.options.selectedIndex;
  const selectedJob = jobSelectionMenu.options[selectedIndex].value;
  if (selectedJob === 'exit') {
    removeOptions(jobSelectionMenu);
    jobSelectionMenu.add(new Option(), null);
    getJobMenu(startJobSelection, jobSelectionMenu);
  }
  console.log(selectedIndex + '  ' + selectedJob);
  const newJobs = findKey(selectedJob, jobs);
  console.log(newJobs);
  console.log(typeof newJobs[selectedJob]);
  if (typeof newJobs[selectedJob] === 'object') {
    removeOptions(jobSelectionMenu);
    getJobMenu(newJobs[selectedJob], jobSelectionMenu);
    const exitOption = new Option('▲', 'exit');
    jobSelectionMenu.add(exitOption);
  }
}

function addJobSelection() {
  const jobTable = document.querySelector('#jobtable');
  const newRow = jobTable.insertRow(-1);
  const numberOfRow = jobTable.rows.length - 2;
  newRow.insertCell(-1).innerHTML = numberOfRow;
  const rowId = `jobrow${numberOfRow}`;
  newRow.setAttribute('id', rowId);
  newRow.setAttribute('class', 'jobrows');
  const newSelect = document.createElement('select');
  const newInput = document.createElement('input');
  const selectId = `job-selection${numberOfRow}`;
  const costId = `job-cost${numberOfRow}`;
  newSelect.setAttribute('id', selectId);
  newSelect.setAttribute('name', 'job');
  newSelect.setAttribute('autofocus', '');
  newSelect.setAttribute('required', '');
  newSelect.setAttribute('class', 'jobselection');
  newInput.setAttribute('type', 'number');
  newInput.setAttribute('name', 'cost');
  newInput.setAttribute('class', 'jobcost');
  newInput.setAttribute('id', costId);
  newInput.setAttribute('value', 0);
  newInput.setAttribute('min', 0);
  newRow.insertCell(-1).appendChild(newSelect);
  newRow.insertCell(-1).appendChild(newInput);
  newSelect.add(new Option(), null);
  getJobMenu(startJobSelection, newSelect);
  const newDeleteButton = document.createElement('input');
  newDeleteButton.setAttribute('type', 'button');
  newDeleteButton.setAttribute('style', 'color: red;');
  newDeleteButton.setAttribute('value', 'X');
  const buttonId = `delete-selection${numberOfRow}`;
  newDeleteButton.setAttribute('id', buttonId);
  newRow.insertCell(-1).appendChild(newDeleteButton);
  resetEvents();
}

function resetAttributes() {
  const jobTable = document.querySelector('#jobtable').querySelectorAll('tr');
  jobTable.forEach((row, index) => {
    if (row.className === 'jobrows') {
      const numberOfRow = row.querySelectorAll('td')[0].innerHTML;
      row
        .querySelector(`#job-selection${numberOfRow}`)
        .setAttribute('id', `job-selection${index - 1}`);
      row
        .querySelector(`#job-cost${numberOfRow}`)
        .setAttribute('id', `job-cost${index - 1}`);

      if (numberOfRow !== '1') {
        row
          .querySelector(`#delete-selection${numberOfRow}`)
          .setAttribute('id', `delete-selection${index - 1}`);
      }
      row.querySelectorAll('td')[0].innerHTML = `${index - 1}`;
      row.setAttribute('id', `jobrow${index - 1}`);
    }
  });
}

function resetEvents() {
  const jobTable = document.querySelector('#jobtable');
  const tableRows = jobTable.querySelectorAll('tr');
  tableRows.forEach((row, index) => {
    const numberOfRow = row.querySelectorAll('td')[0].innerHTML;
    if (row.className === 'jobrows') {
      const select = row.querySelector(`#job-selection${index - 1}`);
      select.onchange = function () {
        changeOption2(this.id);
      };
      const jobCost = row.querySelector(`#job-cost${index - 1}`);
      jobCost.addEventListener('change', calculateTotal);

      const input = row.querySelector(`#delete-selection${index - 1}`);
      input.onclick = function () {
        const numberOfRow = jobTable.rows.length - 2;
        jobTable.deleteRow(index);
        if (numberOfRow === 1) {
          addJobSelection();
        }
        resetAttributes();
        resetEvents();
        calculateTotal();
      };
    }
  });
}

function resetSelectorNames() {
  const jobTable = document.querySelector('#jobtable');
  const tableRows = jobTable.querySelectorAll('tr');
  tableRows.forEach((row, index) => {
    if (row.className === 'jobrows') {
      const numberOfRow = row.querySelectorAll('td')[0].innerHTML;
      row
        .querySelector(`#job-selection${numberOfRow}`)
        .setAttribute('name', `jobs[${numberOfRow}]`);
      row
        .querySelector(`#job-cost${numberOfRow}`)
        .setAttribute('name', `jobs[${numberOfRow}]`);
    }
  });
}

function calculateTotal() {
  const jobTable = document.querySelector('#jobtable');
  const tableRows = jobTable.querySelectorAll('tr');
  let result = 0;
  tableRows.forEach((row) => {
    if (row.className === 'jobrows') {
      const numberOfRow = row.querySelectorAll('td')[0].innerHTML;
      result += Number(row.querySelector(`#job-cost${numberOfRow}`).value);
    }
  });
  document
    .querySelector('#jobcost')
    .querySelector('#total')
    .setAttribute('value', result);
}

async function getStatusOfWorkPosts() {
  const response = await fetch('/workpost/workposts');
  const workPosts = await response.json();
  const workPostSelection = Array.from(
    document.getElementsByClassName('workpost-selection'),
  );
  const busyWorkPosts = workPosts.filter((workPost) =>
    workPost.hasOwnProperty('car'),
  );
  busyWorkPosts.forEach((workPost) => {
    workPostSelection.forEach((WorkPostSelection) => {
      if (WorkPostSelection.value === String(workPost.number)) {
        WorkPostSelection.style.backgroundColor = 'LightCoral';
        WorkPostSelection.disabled = true;
        WorkPostSelection.text = `${WorkPostSelection.value} (busy)`;
      }
    });
  });
}

//DOM elements
const addJobButton = document.querySelector('#addjob');
const submitButton = document.querySelector('#submit-button');

// Listeners
document.addEventListener('DOMContentLoaded', () => {
  addJobSelection();
  resetEvents();
  resetSelectorNames();
  getStatusOfWorkPosts();
});
addJobButton.addEventListener('click', addJobSelection);
addJobButton.addEventListener('click', resetSelectorNames);
