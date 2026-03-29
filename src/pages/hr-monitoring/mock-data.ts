// mock-data.ts
import { MonitoringItem, MonitoringSummary } from "./types";

export const mockSummary: MonitoringSummary = {
  total: 2600,
  plastic: 50450,
  cash: 67890,
  bonus: 790,
  premium: 550,
  advance: 450,
  date: "2025-02-12T00:00:00.000Z"
};

export const mockMonitoringItems: MonitoringItem[] = [
  {
    id: "1",
    type: "bonus",
    amount: 40,
    condition: "Бонус 1% от 100 м² в день",
    details: "170 м²",
    dateTime: "2025-02-12T10:37:00.000Z",
    employee: {
      id: "1",
      name: "Аббос Жанизаков",
      avatar: "/avatar.png"
    },
    manager: {
      id: "2",
      name: "Михаил Иванов",
      avatar: "/manager-avatar.png"
    },
    status: "Принять"
  },
  {
    id: "2",
    type: "salary",
    amount: 430,
    condition: "12.02.2025 зарплата",
    details: "189 час время работы",
    dateTime: "2025-02-12T10:37:00.000Z",
    employee: {
      id: "1",
      name: "Аббос Жанизаков",
      avatar: "/avatar.png"
    },
    manager: {
      id: "2",
      name: "Михаил Иванов",
      avatar: "/manager-avatar.png"
    },
    status: "В ожидании"
  },
  {
    id: "3",
    type: "premium",
    amount: 200,
    condition: "Премье",
    details: "Для праздника «Hayit bayrami»",
    dateTime: "2025-02-12T10:37:00.000Z",
    employee: {
      id: "1",
      name: "Аббос Жанизаков",
      avatar: "/avatar.png"
    },
    manager: {
      id: "2",
      name: "Михаил Иванов",
      avatar: "/manager-avatar.png"
    },
    status: "Принять"
  },
  {
    id: "4",
    type: "bonus",
    amount: 3,
    condition: "Бонус 1% от 100 м² в день",
    details: "104 м²",
    dateTime: "2025-02-12T10:37:00.000Z",
    employee: {
      id: "1",
      name: "Аббос Жанизаков",
      avatar: "/avatar.png"
    },
    manager: {
      id: "2",
      name: "Михаил Иванов",
      avatar: "/manager-avatar.png"
    },
    status: "Принято"
  }
];

// Mock filials
export const mockFilials = [
  { id: "1", name: "Центральный" },
  { id: "2", name: "Восточный" },
  { id: "3", name: "Западный" },
  { id: "4", name: "Северный" }
];

// Mock employees
export const mockEmployees = [
  { id: "1", name: "Аббос Жанизаков", avatar: "/avatar.png" },
  { id: "2", name: "Михаил Иванов", avatar: "/manager-avatar.png" },
  { id: "3", name: "Анна Петрова", avatar: null },
  { id: "4", name: "Сергей Сидоров", avatar: null }
];

// Mock types
export const monitoringTypes = [
  { id: "all", name: "Все типы" },
  { id: "bonus", name: "Бонусы" },
  { id: "salary", name: "Зарплата" },
  { id: "premium", name: "Премии" }
];