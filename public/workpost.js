// Functions
async function loadOrdersInQueue() {
  const response = await fetch('https://Nest.gigantgiga.repl.co/order/res/queue');
  const ordersInQueue = await response.json();
  return ordersInQueue;
}

function setCheckboxEvents() {
  const checkBoxes = Array.from(document.getElementsByClassName('order-checkboxes'));
  checkBoxes.forEach(checkBox => {
    console.log(checkBox);
    checkBox.onchange = function() {
      const isChecked = document.getElementById(this.id).checked;
      checkBox.value = isChecked === true ? true : false;
    }
  })
}

async function loadQueueOrdersToSelect() {
  const selectElements = Array.from(document.getElementsByClassName('order-selection'));
  const orders = await loadOrdersInQueue();
  selectElements.forEach(select => {
    select.add(new Option(), null);
    orders.forEach(order => {
      const car = `${order.car.brand} ${order.car.model}`.toUpperCase();
      const newOption =
        new Option(`${car} - ${order.number}`, order._id);
      select.add(newOption);
    })
  })
}

// Elements


// Listeners
document.addEventListener("DOMContentLoaded", () => {
  setCheckboxEvents();
  //loadQueueOrdersToSelect();
});


