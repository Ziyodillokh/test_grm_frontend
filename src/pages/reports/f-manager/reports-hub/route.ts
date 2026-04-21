import ReportsHubPage from ".";
import MonthlyReportsPage from "./monthly";
import MonthlyKassaDetailPage from "./monthly/kassa-detail";
import SinglePage from "../report-single";
import PageSellerCashFlow from "../../seller/seller-cashflow";
import ClientDebtFilials from "../../m-manager/reports-hub/client-debt";
import ClientDebtClients from "../../m-manager/reports-hub/client-debt/clients";
import ClientDebtOrders from "../../m-manager/reports-hub/client-debt/client-orders";
import PageSellerReport from "../../seller/seller-report";
import PageOrginal from "../../report-orginal";
import GeneralReportDetail from "../../report-orginal/detail-page";
import CountryTable from "../remaider/county-table";
import FoctoryTable from "../remaider/factory-table";
import CollectionTable from "../remaider/collection-table";
import ModelTable from "../remaider/model-table";
import SizeTable from "../remaider/size-table";
import SalesPage from "../../m-manager/sales";
import SalesCountryTable from "../../m-manager/sales/country-table";
import SalesFactoryTable from "../../m-manager/sales/factory-table";
import SalesCollectionTable from "../../m-manager/sales/collection-table";
import SalesModelTable from "../../m-manager/sales/model-table";
import SalesSizeTable from "../../m-manager/sales/size-table";

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
    Element: MonthlyKassaDetailPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/monthly/:id/info",
    Element: MonthlyKassaDetailPage,
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
    Element: SalesPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Drill-down: :tabType = filial|dealer|internet|partiya
  // Partiya: level1=collection, level2=model, level3=size (3 levels)
  // Others: level1=country, level2=factory, level3=collection, level4=model, level5=size
  {
    url: "/f-manager/reports-hub/sales/:tabType/:entityId",
    Element: SalesCountryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/sales/:tabType/:entityId/:countryId",
    Element: SalesFactoryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/sales/:tabType/:entityId/:countryId/:factoryId",
    Element: SalesCollectionTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/sales/:tabType/:entityId/:countryId/:factoryId/:collectionId",
    Element: SalesModelTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/sales/:tabType/:entityId/:countryId/:factoryId/:collectionId/:modelId",
    Element: SalesSizeTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  // Qarz hisoboti
  {
    url: "/f-manager/reports-hub/client-debt",
    Element: ClientDebtFilials,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/client-debt/:filialId",
    Element: ClientDebtClients,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/reports-hub/client-debt/:filialId/:clientId",
    Element: ClientDebtOrders,
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
  {
    url: "/f-manager/reports-hub/general/detail/:type",
    Element: GeneralReportDetail,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
