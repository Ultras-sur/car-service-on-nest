const requestConfig = {
  order: (id) => `/pgorder/${id}`,
  client: (id) => `/pgclient/${id}`,
  car: (id) => `/pgcar/${id}`,
  user: (id) => `/pguser/delete/${id}`,
  session: (id) => `/pguser/sessions/${id}`,
};

const alerts = {
  order: (name) => `Вы уверены, что хотите удалить заказ № ${name}?`,
  client: (name) =>
    `Вы уверены, что хотите удалить клиента ${name}? Вся информация об автомобилях и заказах будет так же удалена.`,
  car: (name) =>
    `Вы уверены, что хотите удалить данные автомобиля ${name}, вся информация о заказах так же будет удалена?`,
  user: (name) => `Вы уверены, что хотите удалить пользователя ${name}?`,
  session: (name) =>
    `Вы уверены, что хотите удалить сессию пользователя ${name}?`,
};

async function deleteItem(id, item, name) {
  //const [id, item, name] = itemInfo.split('_');
  console.log([id, item, name]);
  const needToDelete = confirm(alerts[item](name));
  if (!needToDelete) return;
  const requestURL = requestConfig[item](id);
  try {
    await fetch(requestURL, {
      method: 'DELETE',
    });
    location.href = location.href.replace(location.search, '');
    return;
  } catch (e) {
    console.log('Request failed', e);
  }
}
