import DManagerReportsHubPage from "./reports-hub";
import PageKassaReport from "./kassa-report";
import DealerReportPage from "./report";
import PageFinance from "./report-finance";
import TrasferDealerSinglePage from "./transfer/single";
import TrasferDealerPage from "./transfer/table";
import DealerListPage from "../m-manager/reports-hub/dealers";

const Route = [
  // Reports Hub
  {
    url: "/d-manager/reports-hub",
    Element: DManagerReportsHubPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Oylik hisobotlar (reports-hub ichida)
  {
    url: "/d-manager/reports-hub/monthly",
    Element: PageFinance,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/d-manager/reports-hub/monthly/:id/info",
    Element: PageKassaReport,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/d-manager/reports-hub/monthly/:reportId/info/:id/info",
    Element: DealerReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Dillerlar hisoboti (reports-hub ichida)
  {
    url: "/d-manager/reports-hub/dealers",
    Element: DealerListPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/d-manager/reports-hub/dealers/:dealerId",
    Element: DealerReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Legacy routes (eski linklar ishlashi uchun)
  {
    url: "/d-manager/report-monthly",
    Element: PageFinance,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/d-manager/report-monthly/:id/info",
    Element: PageKassaReport,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/d-manager/report-monthly/:reportId/info/:id/info",
    Element: DealerReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Transfer
  {
    url: "/d-manager/transfer",
    Element: TrasferDealerPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/d-manager/transfer/:package_id",
    Element: TrasferDealerSinglePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];


export default Route;
