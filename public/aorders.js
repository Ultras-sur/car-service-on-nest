async function deleteOrder(orderId) {
  const needToDelete = confirm(`Вы уверены, что хотите удалить заказ?`);
  if (!needToDelete) return;
  try {
    const response = await fetch(`/order/${orderId}`, {
      method: 'DELETE'
    })
    location.href = location.href;
    return;
  } catch (e) {
    console.log('Request failed', e);
  }
}