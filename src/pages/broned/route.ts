import Page from "./table";

const Route = [
  {
    url: "/broned",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
