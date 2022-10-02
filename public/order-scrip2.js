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
  },
  diagnostic: {
    engine: 'Диагностика двигателя',
    transmission: 'Диагностика коробки передач',
    electric: 'Диагностика электрической системы',
  },
  insurance: {
    policy: 'Оформление страхового полиса',
  }
}

const startJobSelection = {
  slesar: 'Слесарные работы',
  malar: 'Малярные работы',
  diagnostic: 'Диагностика',
  insurance: 'Страховая поддержка',
}

function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}

const findKey = (targetKey, collection) => {
  let result = {};
  if (typeof collection == 'object') {
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
}

function getJobMenu(menu, selection) {
  Object.entries(menu).forEach(([value, text]) => {
    const newOption = new Option(text, value);
    selection.add(newOption);
  })
}

function changeOption() {
  const selectedIndex = jobSelectionMenu.options.selectedIndex;
  const selectedJob = jobSelectionMenu.options[selectedIndex].value;
  if (selectedJob === 'exit') {
    removeOptions(jobSelectionMenu);
    jobSelectionMenu.add(new Option(), null);
    getJobMenu(startJobSelection, jobSelectionMenu);
  }
  console.log(selectedIndex + '  ' + selectedJob)
  const newJobs = findKey(selectedJob, jobs);
  console.log(newJobs)
  console.log(typeof newJobs[selectedJob])
  if (typeof newJobs[selectedJob] === 'object') {
    removeOptions(jobSelectionMenu);
    // jobSelectionMenu.add(new Option('▼', null));
    getJobMenu(newJobs[selectedJob], jobSelectionMenu)
    const exitOption = new Option('▲', 'exit');
    jobSelectionMenu.add(exitOption);
  }
}

function changeOption2(selectorId) {
  
    const jobSelectionMenu = document.querySelector(`#${selectorId}`)
    const selectedIndex = jobSelectionMenu.options.selectedIndex;
    const selectedJob = jobSelectionMenu.options[selectedIndex].value;
    if (selectedJob === 'exit') {
      removeOptions(jobSelectionMenu);
      jobSelectionMenu.add(new Option(), null);
      getJobMenu(startJobSelection, jobSelectionMenu);
    }
    console.log(selectedIndex + '  ' + selectedJob)
    const newJobs = findKey(selectedJob, jobs);
    console.log(newJobs)
    console.log(typeof newJobs[selectedJob])
    if (typeof newJobs[selectedJob] === 'object') {
      removeOptions(jobSelectionMenu);
      // jobSelectionMenu.add(new Option('▼', null));
      getJobMenu(newJobs[selectedJob], jobSelectionMenu)
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
  newRow.setAttribute("id", rowId);
  newRow.setAttribute("class", 'jobrows');
  const newSelect = document.createElement('select');
  const newInput = document.createElement('input');
  const selectId = `job-selection${numberOfRow}`;
  newSelect.setAttribute("id", selectId);
  newSelect.setAttribute("name", 'jobs');
  newSelect.setAttribute("autofocus", '');
  newSelect.setAttribute("required", '');
  newInput.setAttribute('type', 'number');
  newInput.setAttribute("name", 'jobs');
  newRow.insertCell(-1).appendChild(newSelect);
  newRow.insertCell(-1).appendChild(newInput);
  newSelect.add(new Option(), null);
  getJobMenu(startJobSelection, newSelect);

  newSelect.addEventListener('change', changeOption2(selectId));
  if (numberOfRow !== 1) {
    const newDeleteButton = document.createElement('input');
    newDeleteButton.setAttribute('type', 'button');
    newDeleteButton.setAttribute('style', 'color: red;');
    newDeleteButton.setAttribute('value', 'X');
    const buttonId = `delete-selection${numberOfRow}`;
    newDeleteButton.setAttribute('id', buttonId);
    newRow.insertCell(-1).appendChild(newDeleteButton);
    reAddEvents();
    newDeleteButton.addEventListener('click', () => {
      console.log(`Удаляемая строка #${rowId}`)
      const tableRows = document.querySelector('#jobtable').querySelectorAll('tr');
      tableRows.forEach((row, index) => {
        if (row.id === rowId) jobTable.deleteRow(index);
      })

      const newTablerows = document.querySelector('#jobtable').querySelectorAll('tr')

      newTablerows.forEach((row, index) => {
        if (row.className === 'jobrows') {

          const numberOfRow = row.querySelectorAll('td')[0].innerHTML;
          console.log(numberOfRow)
          console.log(row)
          row.querySelector(`#job-selection${numberOfRow}`).setAttribute("id", `job-selection${index - 1}`);
          if (numberOfRow !== '1') {
            row.querySelector(`#delete-selection${numberOfRow}`).setAttribute("id", `delete-selection${index - 1}`);
          }
          row.querySelectorAll('td')[0].innerHTML = `${index - 1}`;
          row.setAttribute('id', `jobrow${index - 1}`)

        }
      })
    })
  }
}

//DOM elements
// const jobSelectionMenu = document.querySelector('#job-selection');
const addJobButton = document.querySelector('#addjob');


// Listeners
document.addEventListener("DOMContentLoaded", () => {
  addJobSelection();
});
addJobButton.addEventListener('click', addJobSelection);
// jobSelectionMenu.addEventListener('change', changeOption);
