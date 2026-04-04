import MManagerReportsHubPage from ".";
import PlaceholderPage from "./placeholder";
import MonthlyReportsPage from "../report-finance/monthly";
import ReportDetailPage from "./monthly/report-detail";
import ReportPage from "../report";
import PageSellerReport from "../../seller/seller-report";
import PageSellerCashFlow from "../../seller/seller-cashflow";
import PageOrginal from "../../report-orginal";
import CountryTable from "../remaider/county-table";
import FoctoryTable from "../remaider/factory-table";
import CollectionTable from "../remaider/collection-table";
import ModelTable from "../remaider/model-table";
import SizeTable from "../remaider/size-table";
import PageFinanceFilial from "../filial-report-finance";

const Route = [
  {
    url: "/m-manager/reports-hub",
    Element: MManagerReportsHubPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Oylik hisobotlar
  {
    url: "/m-manager/reports-hub/monthly",
    Element: MonthlyReportsPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/monthly/:id/info",
    Element: ReportDetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/monthly/:id/info/my",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/monthly/:reportId/info/:id/info",
    Element: PageFinanceFilial,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/monthly/:reportId/info/:kassaReportId/info/f-managers",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/monthly/:reportId/info/:kassaReportId/info/:id/info",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Qoldiq hisoboti
  {
    url: "/m-manager/reports-hub/inventory",
    Element: CountryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/inventory/:countryId",
    Element: FoctoryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/inventory/:countryId/:factoryId",
    Element: CollectionTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/inventory/:countryId/:factoryId/:collectionId",
    Element: ModelTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/inventory/:countryId/:factoryId/:collectionId/:modelId",
    Element: SizeTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Savdo bo'yicha hisobot
  {
    url: "/m-manager/reports-hub/sales",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Sotuvchi hisoboti
  {
    url: "/m-manager/reports-hub/sellers",
    Element: PageSellerReport,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/sellers/:id/info",
    Element: PageSellerCashFlow,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Umumiy hisobot
  {
    url: "/m-manager/reports-hub/general",
    Element: PageOrginal,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Placeholder sahifalar
  {
    url: "/m-manager/reports-hub/clients",
    Element: PlaceholderPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/factories",
    Element: PlaceholderPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/logistics",
    Element: PlaceholderPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/customs",
    Element: PlaceholderPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
