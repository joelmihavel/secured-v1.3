export const formatCurrency = (value: number): string =>
  `₹${Math.round(Math.abs(value)).toLocaleString("en-IN")}`;
