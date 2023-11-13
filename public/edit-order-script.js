async function getJobsAndCategories() {
  const response = await fetch('/job/jobsandcategories');
  const collection = await response.json();
  console.log(collection);
  jobs = collection.jobsAndCategories;
  startJobSelection = collection.categories;
}

let jobs = {};
let startJobSelection = {};

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

function changeOption(selectorId) {
  const jobSelectionMenu = document.querySelector(`#${selectorId}`);
  const selectedIndex = jobSelectionMenu.options.selectedIndex;
  const selectedJob = jobSelectionMenu.options[selectedIndex].value;
  if (selectedJob === 'exit') {
    removeOptions(jobSelectionMenu);
    jobSelectionMenu.add(new Option(), null);
    getJobMenu(startJobSelection, jobSelectionMenu);
  }
  const newJobs = findKey(selectedJob, jobs);
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
  newInput.setAttribute('min', 0);
  newInput.setAttribute('value', 0);
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
    if (row.className === 'jobrows') {
      const select = row.querySelector(`#job-selection${index - 1}`);
      select.onchange = function () {
        changeOption(this.id);
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

async function getOrderJobs() {
  const orderId = document.getElementById('orderid').value;
  const response = await fetch(`/order/res/${orderId}`);
  const order = await response.json();
  const jobs = order.jobs;
  return jobs;
}

function getJobsPart(job, collection) {
  let result = {};
  Object.keys(collection).forEach((part) => {
    if (collection[part].hasOwnProperty(job)) {
      result = collection[part];
    }
  });
  return result;
}

// This function load job categories, jobs and set selected jobs in order
async function loadSelectedJobs() {
  const orderJobs = await getOrderJobs();
  console.log(orderJobs);
  orderJobs.forEach(([job, cost]) => {
    const jobsPart = getJobsPart(job, jobs); // jobs is full collection of jobs
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
    newSelect.setAttribute('required', 'true');
    newSelect.setAttribute('class', 'jobselection');
    newInput.setAttribute('type', 'number');
    newInput.setAttribute('name', 'cost');
    newInput.setAttribute('class', 'jobcost');
    newInput.setAttribute('id', costId);
    newInput.setAttribute('min', 0);
    newInput.setAttribute('value', cost);
    newRow.insertCell(-1).appendChild(newSelect);
    newRow.insertCell(-1).appendChild(newInput);
    getJobMenu(jobsPart, newSelect);
    const exitOption = new Option('▲', 'exit');
    newSelect.add(exitOption);
    const arrayOfNewSelectOptions = Array.from(newSelect.options);
    arrayOfNewSelectOptions.forEach((option) => {
      if (option.value === job) {
        option.selected = true;
      }
    });
    const newDeleteButton = document.createElement('input');
    newDeleteButton.setAttribute('type', 'button');
    newDeleteButton.setAttribute('style', 'color: red;');
    newDeleteButton.setAttribute('value', 'X');
    const buttonId = `delete-selection${numberOfRow}`;
    newDeleteButton.setAttribute('id', buttonId);
    newRow.insertCell(-1).appendChild(newDeleteButton);
  });
  resetEvents();
  calculateTotal();
}

function haveEmptySelections(jobSelections) {
  const emptySelection = jobSelections.filter(
    (selection) => selection.value.length === 0,
  );
  return emptySelection.length !== 0;
}

//DOM elements
const addJobButton = document.querySelector('#addjob');
const submitButton = document.querySelector('#submit-button');

// Listeners
document.addEventListener('DOMContentLoaded', async () => {
  await getJobsAndCategories();
  loadSelectedJobs();
});
addJobButton.addEventListener('click', addJobSelection);
addJobButton.addEventListener('click', resetSelectorNames);

submitButton.onclick = async (event) => {
  event.preventDefault();
  const jobSelections = Array.from(
    document.getElementsByClassName('jobselection'),
  );
  if (haveEmptySelections(jobSelections)) {
    return null;
  }
  const jobRows = Array.from(document.getElementsByClassName('jobrows'));
  const updatedJobs = [];
  jobRows.forEach((jobRow, index) => {
    const jobSelectionOptions = jobRow.querySelector(
      `#job-selection${index + 1}`,
    ).options;
    const selectedJobIndex = jobSelectionOptions.selectedIndex;
    const jobName = jobSelectionOptions[selectedJobIndex].value;
    const jobCost = jobRow.querySelector(`#job-cost${index + 1}`).value;
    updatedJobs.push([jobName, jobCost]);
  });

  const orderId = document.getElementById('orderid').value;
  try {
    const response = await fetch(`/order/update/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ jobs: updatedJobs }),
    });
    const result = await response.json();
    location.href = `/order/${orderId}`;
    return;
  } catch (e) {
    console.log('Request failed', e);
  }
};
