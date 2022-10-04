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


document.addEventListener("DOMContentLoaded", () => {
  calculateTotal();
});