import Page from "./table";

const Route = [
  {
    url: "/data-library",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/data-library/:id",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
 
];

export default Route;
