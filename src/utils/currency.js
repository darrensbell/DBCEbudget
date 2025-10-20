export const formatCurrency = (value) => {
  const number = Number(value);
  if (isNaN(number)) {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(0);
  }
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(number);
};
