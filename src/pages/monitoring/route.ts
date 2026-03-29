import Page from ".";

const Route = [
  {
    url: "/monitoring",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
