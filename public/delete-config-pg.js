const responseConfig = {
  order: (id) => `/pgorder/${id}`,
  client: (id) => `/pgclient/${id}`,
  car: (id) => `/pgcar/${id}`,
  user: (id) => `/pguser/delete/${id}`,
};

const alerts = {
  order: (name) => `Вы уверены, что хотите удалить заказ № ${name}?`,
  client: (name) => `Вы уверены, что хотите удалить клиента ${name}? Вся информация об автомобилях и заказах будет так же удалена.`,
  car: (name) => `Вы уверены, что хотите удалить данные автомобиля ${name}, вся информация о заказах так же будет удалена?`,
  user: (name) => `Вы уверены, что хотите удалить пользователя ${name}?`,
};

async function deleteItem(itemInfo) {
  const [id, item, name] = itemInfo.split('_');
  const needToDelete = confirm(alerts[item](name));
  if (!needToDelete) return;
  const responseURL = responseConfig[item](id);
  try {
    const response = await fetch(responseURL, {
      method: 'DELETE',
    });
    location.href = location.href.replace(location.search, '');
    return;
  } catch (e) {
    console.log('Request failed', e);
  }
}