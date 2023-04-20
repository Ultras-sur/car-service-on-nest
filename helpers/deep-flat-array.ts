export const deepFlatArray = (arr: []): [] => {
  return arr.reduce((acc, elem) => {
    Array.isArray(elem) ? acc.push(...deepFlatArray(elem)) : acc.push(elem);
    return acc;
  }, []);
};
