

import ItemsPage from "./re-register/table";
import Page from "./table";

const Route = [
  {
    url: "/parties",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  
  {
    url: "/parties/:id/info",
    Element: ItemsPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
