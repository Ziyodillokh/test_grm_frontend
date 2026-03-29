export const MonthsArray = [
  { label: "Январь", value: "1" },
  { label: "Февраль", value: "2" },
  { label: "Март", value: "3" },
  { label: "Апрель", value: "4" },
  { label: "Май", value: "5" },
  { label: "Июнь", value: "6" },
  { label: "Июль", value: "7" },
  { label: "Август", value: "8" },
  { label: "Сентябрь", value: "9" },
  { label: "Октябрь", value: "10" },
  { label: "Ноябрь", value: "11" },
  { label: "Декабрь", value: "12" },
];

const startYear = 2024;
const currentYear = new Date().getFullYear();

export const Years = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => currentYear - i
);
