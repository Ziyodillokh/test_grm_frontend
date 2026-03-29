
import ItemsPage from "../filial/re-register/table";
import SingleReportPage from "../filial/report";
import CollectionTable from "./remaider/collection-table";
import CountryTable from "./remaider/county-table";
import FoctoryTable from "./remaider/factory-table";
import ModelTable from "./remaider/model-table";
import SizeTable from "./remaider/size-table";
import Page from "./table";

const Route = [
  {
    url: "/warehouse",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
 
  {
    url: "/warehouse-report",
    Element: CountryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/warehouse-report/:countryId",
    Element: FoctoryTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/warehouse-report/:countryId/:factoryId",
    Element:CollectionTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/warehouse-report/:countryId/:factoryId/:collectionId",
    Element:ModelTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/warehouse-report/:countryId/:factoryId/:collectionId/:modelId",
    Element:SizeTable,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

  {
    url: "/warehouse/:id",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

  {
    url: "/warehouse/:id/info",
    Element: SingleReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/warehouse/:filialId/info/:filialReportId/info",
    Element: ItemsPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
