function getFormatDateFrom(date) {
  const day = date.toISOString().split('T')[0].split('-').reverse().join('-');
  return `${day} 00:00`;
}

function getFormatDateTo(date) {
  console.log(date);
  const day = date.toISOString().split('T')[0].split('-').reverse().join('-');
  return `${day} 23:59`;
}

function getMonth(date) {
  const datePlusMonth = date.setMonth(date.getMonth() + 2);
  return new Date(datePlusMonth);
}
let calendar_date_from = jSuites.calendar(
  document.getElementById('calendar_date_from'),
  {
    format: 'DD-MM-YYYY HH:MM',
    time: true,
  },
);

let calendar_date_to = jSuites.calendar(
  document.getElementById('calendar_date_to'),
  {
    format: 'DD-MM-YYYY HH:MM',
    time: true,
  },
);
