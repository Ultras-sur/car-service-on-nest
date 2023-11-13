export const createOrderNumber = (car, client): string => {
  const brandAbbrev = car.brand.split(' ').reduce((acc, word) => {
    acc += word.slice(0, 1).toUpperCase();
    return acc;
  }, '');
  const modelAbbrev = car.model.split(' ').reduce((acc, word) => {
    acc += word.slice(0, 1).toUpperCase();
    return acc;
  }, '');
  const clientAbbrev = client.name.split(' ').reduce((acc, word) => {
    acc += word.slice(0, 1).toUpperCase();
    return acc;
  }, '');
  const idPart = String(car._id).slice(0, 2).toUpperCase();
  const datePart = String(Date.now()).slice(9);
  const number = brandAbbrev + modelAbbrev + idPart + clientAbbrev + datePart;
  return number;
};
