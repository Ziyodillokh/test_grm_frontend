export const MonthsArray = [
  { label: "Yanvar", value: "1" },
  { label: "Fevral", value: "2" },
  { label: "Mart", value: "3" },
  { label: "Aprel", value: "4" },
  { label: "May", value: "5" },
  { label: "Iyun", value: "6" },
  { label: "Iyul", value: "7" },
  { label: "Avgust", value: "8" },
  { label: "Sentabr", value: "9" },
  { label: "Oktabr", value: "10" },
  { label: "Noyabr", value: "11" },
  { label: "Dekabr", value: "12" },
];

const startYear = 2024;
const currentYear = new Date().getFullYear();

export const Years = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => currentYear - i
);
