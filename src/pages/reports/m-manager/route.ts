import DealerReportPage from "./dealer-report";
import PageKassaReportDealer from "../d-manager/kassa-report";
import ReportPage from "./report";
import PageFinance from "./report-finance";
import PageFinanceSingle from "./report-finance-single";
import PageSellerReport from "../seller/seller-report";
import PageSellerCashFlow from "../seller/seller-cashflow";
import InventoryPage from "./remaider/index";
import FoctoryTable from "./remaider/factory-table";
import CollectionTable from "./remaider/collection-table";
import ModelTable from "./remaider/model-table";
import SizeTable from "./remaider/size-table";
import PartiyaCollectionTable from "./remaider/partiya-collection-table";
import PartiyaModelTable from "./remaider/partiya-model-table";
import PartiyaSizeTable from "./remaider/partiya-size-table";
import PageOrginal from "../report-orginal";
import GeneralReportDetail from "../report-orginal/detail-page";

const Route = [
  {
    url: "/m-manager/report",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

  {
    url: "/m-manager/report-remaider",
    Element: InventoryPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

  // Partiya drill-down
  {
    url: "/m-manager/remaider-partiya/:partiyaId",
    Element: PartiyaCollectionTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/remaider-partiya/:partiyaId/:collectionId",
    Element: PartiyaModelTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/remaider-partiya/:partiyaId/:collectionId/:modelId",
    Element: PartiyaSizeTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

  // Country drill-down
  {
    url: "/m-manager/report-remaider/:countryId",
    Element: FoctoryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/report-remaider/:countryId/:factoryId",
    Element: CollectionTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/report-remaider/:countryId/:factoryId/:collectionId",
    Element: ModelTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/report-remaider/:countryId/:factoryId/:collectionId/:modelId",
    Element: SizeTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

  {
    url: "/m-manager/d-manager/report-monthly/:id/info",
    Element: PageKassaReportDealer,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  
  {
    url: "/m-manager/d-manager/report-monthly/:reportId/info/:id/info",
    Element: DealerReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/report-finance",
    Element: PageFinance,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/report-finance/:id/info",
    Element: PageFinanceSingle,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/report-finance/:id/info/my",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/report-finance/:reportId/info/:id/info",
    Element: PageFinanceSingle,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/report-seller",
    Element: PageSellerReport,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/report-seller/:id/info",
    Element: PageSellerCashFlow,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // {
  //   url: "/m-manager/report-orginal",
  //   Element: PageOrginal,
  //   meta: { isAuth: true, role: new Set(["admin"]) },
  // },
  {
    url: "/m-manager/report-orginal",
    Element: PageOrginal,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/report-orginal/detail/:type",
    Element: GeneralReportDetail,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];


export default Route;
