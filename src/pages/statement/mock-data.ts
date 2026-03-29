// mock-data.ts
import {  Statement1, StatementEmployee } from "./type";

// Mock statement employees
export const mockEmployees: StatementEmployee[] = [
  {
    id: "1",
    name: "Аббос Жанизаков",
    avatar: null,
    filial: "Sanat Hali",
    salary: 400,
    bonus: 871,
    premium: 200,
    advance: 0,
    total: 1471,
    plastic: 471,
    cash: 1000
  },
  {
    id: "2",
    name: "Аббос Жанизаков",
    avatar: null,
    filial: "Samerteks",
    salary: 330,
    bonus: 0,
    premium: 200,
    advance: 0,
    total: 530,
    plastic: 230,
    cash: 300
  },
  {
    id: "3",
    name: "Аббос Жанизаков",
    avatar: null,
    filial: "Milat Hali",
    salary: 0,
    bonus: 0,
    premium: 0,
    advance: 200,
    total: 200,
    plastic: 200,
    cash: 0
  },
  {
    id: "4",
    name: "Аббос Жанизаков",
    avatar: null,
    filial: "Elexus hall",
    salary: 500,
    bonus: 40,
    premium: 200,
    advance: 0,
    total: 740,
    plastic: 240,
    cash: 500
  }
];

// Mock statements
export const mockStatements: Statement1[] = [
  {
    id: "1",
    number: "235",
    name: "Март учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 0,
    bonusesTotal: 0,
    salaryTotal: 0,
    totalSum: 0,
    status: "В процессе"
  },
  {
    id: "2",
    number: "234",
    name: "Февраль учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 1400,
    bonusesTotal: 760,
    salaryTotal: 2440,
    totalSum: 130890.00,
    status: "Отказана"
  },
  {
    id: "3",
    number: "233",
    name: "Январь учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 1400,
    bonusesTotal: 760,
    salaryTotal: 2440,
    totalSum: 130890.00,
    status: "В процессе"
  },
  {
    id: "4",
    number: "232",
    name: "Декабрь учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 1400,
    bonusesTotal: 760,
    salaryTotal: 2440,
    totalSum: 130890.00,
    status: "В процессе"
  },
  {
    id: "5",
    number: "231",
    name: "Ноябрь учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 1400,
    bonusesTotal: 760,
    salaryTotal: 2440,
    totalSum: 130890.00,
    status: "В процессе"
  },
  {
    id: "6",
    number: "230",
    name: "Октябрь учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 1400,
    bonusesTotal: 760,
    salaryTotal: 2440,
    totalSum: 130890.00,
    status: "Принято"
  },
  {
    id: "7",
    number: "229",
    name: "Сентябрь учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 1400,
    bonusesTotal: 760,
    salaryTotal: 2440,
    totalSum: 130890.00,
    status: "Принято"
  },
  {
    id: "8",
    number: "228",
    name: "Август учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 1400,
    bonusesTotal: 760,
    salaryTotal: 2440,
    totalSum: 130890.00,
    status: "Принято"
  },
  {
    id: "9",
    number: "227",
    name: "Июль учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 1400,
    bonusesTotal: 760,
    salaryTotal: 2440,
    totalSum: 130890.00,
    status: "Принято"
  },
  {
    id: "10",
    number: "226",
    name: "Июнь учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 1400,
    bonusesTotal: 760,
    salaryTotal: 2440,
    totalSum: 130890.00,
    status: "Принято"
  },
  {
    id: "11",
    number: "225",
    name: "Май учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 1400,
    bonusesTotal: 760,
    salaryTotal: 2440,
    totalSum: 130890.00,
    status: "Принято"
  },
  {
    id: "12",
    number: "224",
    name: "Апрель учун зарплата",
    createdAt: "2025-02-12T00:00:00.000Z",
    premiumsTotal: 1400,
    bonusesTotal: 760,
    salaryTotal: 2440,
    totalSum: 130890.00,
    status: "Принято"
  }
];

export const getMockStatementWithEmployees = (id: string): Statement1 | undefined => {
  const statement = mockStatements.find(s => s.id === id);
  
  if (!statement) return undefined;
  
  // if (id === "1") {
  //   return {
  //     ...statement,
  //     employees: mockEmployees
  //   };
  // }
  
  return statement;
};

// Sample filials for dropdowns
export const mockFilials = [
  { id: "1", name: "Sanat Hali" },
  { id: "2", name: "Samerteks" },
  { id: "3", name: "Milat Hali" },
  { id: "4", name: "Elexus hall" }
];

// Sample employees for dropdowns
export const mockEmployeesList = [
  { id: "1", name: "Аббос Жанизаков", avatar: null },
  { id: "2", name: "Михаил Иванов", avatar: null },
  { id: "3", name: "Анна Петрова", avatar: null },
  { id: "4", name: "Сергей Сидоров", avatar: null },
  { id: "5", name: "Елена Смирнова", avatar: null }
];