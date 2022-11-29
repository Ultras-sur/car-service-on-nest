
const responseConfig = {
  order: (id) => `/order/${id}`,
  client: (id) => `/client/${id}`,
  car: (id) => `/car/${id}`,
  user: (id) => `/user/admin/delete/${id}`,
}

const alerts = {
  order: `Вы уверены, что хотите удалить данный заказ?`,
  client: `Вы уверены, что хотите удалить клиента? 
  Вся информация об автомобилях и заказах будет так же удалена.`,
  car: `Вы уверены, что хотите удалить данный автомобиль? 
  Вся информация о заказах так же будет удалена?`,
  user: `Вы уверены, что хотите удалить пользователя?`,
}

async function deleteItem(itemInfo) {
  const [id, item] = itemInfo.split('_');
  const needToDelete = confirm(alerts[item]);
  if (!needToDelete) return;
  const responseURL = responseConfig[item](id);
  console.log(responseURL)
  try {
    const response = await fetch(responseURL, {
      method: 'DELETE'
    })
    location.href = location.href.replace(location.search, '');
    return;
  } catch (e) {
    console.log('Request failed', e);
  }
}