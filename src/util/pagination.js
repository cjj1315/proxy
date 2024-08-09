export const getPagination = (page, size) => {
  const adjustedPage = page >= 1 ? page - 1 : 0;
  const limit = size ? size : 5;
  const from = adjustedPage * limit;
  const to = from + limit - 1;
  return { from, to };
};
