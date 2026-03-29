import SinglePage from "./info";
import Page from "./table";

const Route = [
  {
    url: "/products",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/products/:id/info",
    Element: SinglePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
