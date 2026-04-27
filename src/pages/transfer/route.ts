import SinglePage from "./single";
import Page from "./table";

const Route = [
  {
    url: "/transfers",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin", "4", "7", "9"]) },
  },
  {
    url: "/transfers/:id/to/:uuid",
    Element: SinglePage,
    meta: { isAuth: true, role: new Set(["admin", "4", "7", "9"]) },
  },
];

export default Route;
