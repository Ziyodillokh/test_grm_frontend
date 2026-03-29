import Items from "./items";
import Page from "./table";


const Route = [
  {
    url: "/order",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/order/:id/info",
    Element: Items,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

];

export default Route;
