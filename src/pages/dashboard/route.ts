import Dashboard from ".";
import DashboardKassaDetail from "./kassa-detail";

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
];

export default Route;
