import Page from "./page";

const Route = [
  {
    url: "/cashier/home",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
