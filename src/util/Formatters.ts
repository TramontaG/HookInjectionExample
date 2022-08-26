import {FormatMoney} from 'format-money-js';
const ToReal = new FormatMoney({
  grouping: true,
  separator: '.',
  decimalPoint: ',',
  decimals: 2,
  symbol: 'R$ ',
  append: false,
});

export const formatDate = (date: Date) => {
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};

export const formatMoney = (amount: number) => {
  return ToReal.from(amount, {});
};
