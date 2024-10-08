const modal = jSuites.modal(document.getElementById('modal'), {
  width: '600px',
  height: '400px',
  closed: true,
});

const modalButton = document.getElementById('modal-button');
modalButton.addEventListener('click', () => {
  modal.open();
});
