import Hub from "./hub";
import Barcodes from "./barcodes";
import Page from "./table";

const Route = [
  {
    url: "/data-library",
    Element: Hub,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/data-library/barcodes",
    Element: Barcodes,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/data-library/:id",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
