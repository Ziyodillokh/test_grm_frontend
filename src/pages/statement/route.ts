import DetailPage from "./detail";
import Page from "./table";

const Route = [
  {
    url: "/statement",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/statement/:id/info",
    Element: DetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/report-finance/statement/:id/info",
    Element: DetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;