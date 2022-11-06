
const responseConfig = {
  order: (id) => `/order/${id}`,
  client: (id) => `/client/${id}`,
  car: (id) => `/car/${id}`,
  user: (id) => `/user/admin/delete/${id}`,
}

async function deleteItem(itemInfo) {
  const needToDelete = confirm(`Вы уверены?`);
  if (!needToDelete) return;

  const [id, item] = itemInfo.split('_');
  const responseURL = responseConfig[item](id);

  try {
    const response = await fetch(responseURL, {
      method: 'DELETE'
    })
    location.href = location.href;
    return;
  } catch (e) {
    console.log('Request failed', e);
  }
}