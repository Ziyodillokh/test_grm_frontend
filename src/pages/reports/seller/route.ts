
import PageSellerCashFlow from "./seller-cashflow";
import PageSellerReport from "./seller-report";
const Route = [
  {
    url: "/statement/report-seller",
    Element: PageSellerReport,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/statement/report-seller/:id/info",
    Element: PageSellerCashFlow,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
