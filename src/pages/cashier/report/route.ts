import Page from "./page";

const Route = [
  {
    url: "/cashier/report",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "4", "8"]) },
  },
  {
    url: "/cashier/report/:id",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "4", "8"]) },
  },
  {
    url: "/cashier/home",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "4", "8"]) },
  },
  {
    url: "/f-manager/reports",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "4", "8"]) },
  },
  {
    url: "/f-manager/reports/:id",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "4", "8"]) },
  },
  {
    url: "/f-manager/kassa",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "4", "8"]) },
  },
  {
    url: "/i-manager/kassa",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "8"]) },
  },
];

export default Route;
