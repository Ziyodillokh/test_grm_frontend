import MManagerReportsHubPage from ".";
import DealerListPage from "./dealers";
import DealerDetailPage from "../../d-manager/report";
import LogisticsReportPage from "./logistics";
import LogisticsDetailPage from "./logistics/detail";
import CustomsReportPage from "./customs";
import CustomsDetailPage from "./customs/detail";
import KentReportPage from "./kents";
import KentDetailPage from "./kents/detail";
import FactoryReportPage from "./factories";
import FactoryDetailPage from "./factories/detail";
import MonthlyReportsPage from "../report-finance/monthly";
import ReportDetailPage from "./monthly/report-detail";
import KassaCashflowsPage from "./monthly/kassa-cashflows";
import ReportPage from "../report";
import PageSellerReport from "../../seller/seller-report";
import PageSellerCashFlow from "../../seller/seller-cashflow";
import PageOrginal from "../../report-orginal";
import InventoryPage from "../remaider/index";
import FoctoryTable from "../remaider/factory-table";
import CollectionTable from "../remaider/collection-table";
import ModelTable from "../remaider/model-table";
import SizeTable from "../remaider/size-table";
import SalesPage from "../sales";
import SalesCountryTable from "../sales/country-table";
import SalesFactoryTable from "../sales/factory-table";
import SalesCollectionTable from "../sales/collection-table";
import SalesModelTable from "../sales/model-table";
import SalesSizeTable from "../sales/size-table";

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
    url: "/m-manager/reports-hub/monthly/:reportId/info/:kassaId/info",
    Element: KassaCashflowsPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Qoldiq hisoboti
  {
    url: "/m-manager/reports-hub/inventory",
    Element: InventoryPage,
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
  // Sotuv hisoboti
  {
    url: "/m-manager/reports-hub/sales",
    Element: SalesPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/sales/:tabType/:entityId",
    Element: SalesCountryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/sales/:tabType/:entityId/:countryId",
    Element: SalesFactoryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/sales/:tabType/:entityId/:countryId/:factoryId",
    Element: SalesCollectionTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/sales/:tabType/:entityId/:countryId/:factoryId/:collectionId",
    Element: SalesModelTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/sales/:tabType/:entityId/:countryId/:factoryId/:collectionId/:modelId",
    Element: SalesSizeTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Savdo bo'yicha hisobot (legacy)
  {
    url: "/m-manager/reports-hub/sales-legacy",
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
  // Kent hisoboti
  {
    url: "/m-manager/reports-hub/clients",
    Element: KentReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/clients/:debtId",
    Element: KentDetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/clients/:debtId/info",
    Element: KentDetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Diller hisoboti
  {
    url: "/m-manager/reports-hub/dealers",
    Element: DealerListPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/dealers/:dealerId",
    Element: DealerDetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Zavod hisoboti
  {
    url: "/m-manager/reports-hub/factories",
    Element: FactoryReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/factories/:factoryId",
    Element: FactoryDetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/logistics",
    Element: LogisticsReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/logistics/:logisticsId",
    Element: LogisticsDetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/logistics/:logisticsId/info",
    Element: LogisticsDetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Bojxona hisoboti
  {
    url: "/m-manager/reports-hub/bojxona",
    Element: CustomsReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/bojxona/:customsId",
    Element: CustomsDetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/reports-hub/bojxona/:customsId/info",
    Element: CustomsDetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
