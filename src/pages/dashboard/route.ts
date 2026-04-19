import Dashboard from ".";
import DashboardKassaDetail from "./kassa-detail";
import FManagerCurrent from "./f-manager-current";

const Route = [
  {
    url: "/m-manager/current-month",
    Element: Dashboard,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/current-month/:id/info",
    Element: DashboardKassaDetail,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/f-manager/kassa",
    Element: FManagerCurrent,
    meta: { isAuth: true, role: new Set(["admin", "4", "8"]) },
  },
];

export default Route;
