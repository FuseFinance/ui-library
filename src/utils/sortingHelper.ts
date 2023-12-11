export const sortByString = (list, key) => {
  if (!list || list.length === 0) return [];

  const sortedList = list.sort(function (a, b) {
    const textA = a[key].toUpperCase();
    const textB = b[key].toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  return [...sortedList];
};
