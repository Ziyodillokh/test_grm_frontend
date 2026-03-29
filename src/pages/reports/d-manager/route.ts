// import ReportPage from "./report";

import PageKassaReport from "./kassa-report";
import ReportPage from "./report";
import PageFinance from "./report-finance";
import TrasferDealerSinglePage from "./transfer/single";
import TrasferDealerPage from "./transfer/table";


const Route = [
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
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
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
