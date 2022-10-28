async function deleteItem(itemInfo) {
  const needToDelete = confirm(`Вы уверены?`);
  if (!needToDelete) return;
  const [id, item] = itemInfo.split('_');
  if (item === 'order') {
    try {
      const response = await fetch(`/order/${id}`, {
        method: 'DELETE'
      })
      location.href = location.href;
      return;
    } catch (e) {
      console.log('Request failed', e);
    }
  } else if (item === 'car') {
    try {
      const response = await fetch(`/car/${id}`, {
        method: 'DELETE'
      })
      location.href = location.href;
      return;
    } catch (e) {
      console.log('Request failed', e);
    }
  }

}