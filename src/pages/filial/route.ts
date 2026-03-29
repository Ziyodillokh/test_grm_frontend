import ItemsPage from "./re-register/table";
import SingleReportPage from "./report";
import Page from "./table";

const Route = [
  {
    url: "/filial",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/filial/:id",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/filial/:id/info",
    Element: SingleReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/filial/:filialId/info/:filialReportId/info",
    Element: ItemsPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
