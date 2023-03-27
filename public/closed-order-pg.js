async function sendStatus() {
  const selectionOptions = statusSelector.options;
  const selectedOptionIndex = selectionOptions.selectedIndex;
  const orderStatus = selectionOptions[selectedOptionIndex].value;
  const orderId = document.querySelector('#orderid').value;
  try {
    const response = await fetch(`/pgorder/setstatus/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ orderStatus }),
    });
    const result = await response.json();
    location.href = `/pgorder/${orderId}`;
    return;
  } catch (e) {
    console.log('Request failed', e);
  }
}

function calculateTotal() {
  const jobTable = document.querySelector('#jobtable');
  const tableRows = jobTable.querySelectorAll('tr');
  let result = 0;
  tableRows.forEach((row) => {
    if (row.className === 'jobrows') {
      const numberOfRow = row.querySelectorAll('td')[0].innerHTML;
      result += Number(row.querySelector(`#job-cost${numberOfRow}`).innerHTML);
    }
  })
  document.querySelector('#jobcost').querySelector('#total')
    .setAttribute('value', result);
}


function changeStatusHandler() {
  const selectionOptions = statusSelector.options;
  const selectedOptionIndex = selectionOptions.selectedIndex;
  const selectedOptionValue = selectionOptions[selectedOptionIndex].value;
  if (selectedOptionValue === 'opened') {
    const divSelection = document.querySelector('#div-status');
    const submitButton = document.createElement('input');
    const submitButtonAttributes = [
      ['type', 'button'],
      ['value', 'ok'],
      ['id', 'submit-status'],
      ['style', 'margin-left:5px;'],
      ['onclick', 'sendStatus()'],
    ];
    submitButtonAttributes.forEach(([type, value]) =>
      submitButton.setAttribute(type, value),
    );
    divSelection.append(submitButton);
  } else {
    const submitButton = document.querySelector('#submit-status');
    if (submitButton) {
      submitButton.remove();
    }
  }
  return;
}


// Elements
const statusSelector = document.querySelector('#status-selection');

// Events
document.addEventListener("DOMContentLoaded", () => {
  calculateTotal();
});

statusSelector.addEventListener('change', changeStatusHandler);
