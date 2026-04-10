import ReportPage from "./report";
import SinglePage from "./report-single";
import PageSellerCashFlow from "../seller/seller-cashflow";
import PageSellerReport from "../seller/seller-report";
import PageCleintDebt from "./client-debt";
import PageOrginal from "../report-orginal";
import InventoryPage from "./remaider/index";
import FoctoryTable from "./remaider/factory-table";
import CollectionTable from "./remaider/collection-table";
import ModelTable from "./remaider/model-table";
import SizeTable from "./remaider/size-table";
import PageFinance from "./finance";

const Route = [
  // Kassa sahifasi (cashflow ro'yxati)
  {
    url: "/f-manager/reports",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports/:id",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/report/:id/",
    Element: SinglePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Ежемесячный отчет (oylik kassa ro'yxati)
  {
    url: "/f-manager/report-finance",
    Element: PageFinance,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/report-finance/:id/info",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/report-finance/:report/info/:id/info",
    Element: SinglePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Qoldiq hisoboti (inventory)
  {
    url: "/f-manager/report-remaider",
    Element: InventoryPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/report-remaider/:countryId",
    Element: FoctoryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/report-remaider/:countryId/:factoryId",
    Element: CollectionTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/report-remaider/:countryId/:factoryId/:collectionId",
    Element: ModelTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/report-remaider/:countryId/:factoryId/:collectionId/:modelId",
    Element: SizeTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Sotuvchi hisoboti
  {
    url: "/f-manager/report-seller",
    Element: PageSellerReport,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/report-seller/:id/info",
    Element: PageSellerCashFlow,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Mijoz qarzi
  {
    url: "/f-manager/report-finance/client-debt",
    Element: PageCleintDebt,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Umumiy hisobot
  {
    url: "/f-manager/report-orginal",
    Element: PageOrginal,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
