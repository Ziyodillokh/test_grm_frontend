import Page from "./page";

const Route = [
  {
    url: "/cashier/report",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "3"]) },
  },
  {
    url: "/cashier/report/:id",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "3"]) },
  },
  {
    url: "/f-manager/reports",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "3"]) },
  },
  {
    url: "/f-manager/report",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "3"]) },
  },
  {
    url: "/f-manager/reports/:id",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "3"]) },
  },
  {
    url: "/f-manager/kassa",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "4"]) },
  },
];

export default Route;
