import SinglePage from "../filial/single";
import TrasferDealerSinglePage from "./single";
import Page from "./table";

const Route = [
  {
    url: "/dealer",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/dealer/:id/info",
    Element: SinglePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

  {
    url: "/dealer/:toId/info",
    Element: TrasferDealerSinglePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

];

export default Route;
