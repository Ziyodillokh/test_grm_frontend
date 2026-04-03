import ReportsHubPage from ".";
import MonthlyReportsPage from "./monthly";
import SalesReportPage from "./sales";
import ReportPage from "../report";
import SinglePage from "../report-single";
import PageSellerCashFlow from "../../seller/seller-cashflow";
import PageSellerReport from "../../seller/seller-report";
import PageOrginal from "../../report-orginal";
import CountryTable from "../remaider/county-table";
import FoctoryTable from "../remaider/factory-table";
import CollectionTable from "../remaider/collection-table";
import ModelTable from "../remaider/model-table";
import SizeTable from "../remaider/size-table";

const Route = [
  {
    url: "/f-manager/reports-hub",
    Element: ReportsHubPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Oylik Hisobotlar
  {
    url: "/f-manager/reports-hub/monthly",
    Element: MonthlyReportsPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/monthly/:id",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/monthly/:report/info/:id/info",
    Element: SinglePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Qoldiq Hisoboti
  {
    url: "/f-manager/reports-hub/inventory",
    Element: CountryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/inventory/:countryId",
    Element: FoctoryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/inventory/:countryId/:factoryId",
    Element: CollectionTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/inventory/:countryId/:factoryId/:collectionId",
    Element: ModelTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/inventory/:countryId/:factoryId/:collectionId/:modelId",
    Element: SizeTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Sotuv Hisoboti
  {
    url: "/f-manager/reports-hub/sales",
    Element: SalesReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Sotuvchi Hisoboti
  {
    url: "/f-manager/reports-hub/sellers",
    Element: PageSellerReport,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/sellers/:id/info",
    Element: PageSellerCashFlow,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Umumiy Hisobot
  {
    url: "/f-manager/reports-hub/general",
    Element: PageOrginal,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
