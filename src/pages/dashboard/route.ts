import Dashboard from ".";
import DashboardKassaDetail from "./kassa-detail";

const Route = [
  {
    url: "/dashboard",
    Element: Dashboard,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/dashboard/:id/info",
    Element: DashboardKassaDetail,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
