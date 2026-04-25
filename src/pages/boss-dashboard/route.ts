import BossDashboard from ".";
import BossCashflowPage from "./cashflow";

const Route = [
  {
    url: "/boss/dashboard",
    Element: BossDashboard,
    meta: { isAuth: true, role: new Set(["admin", "12"]) },
  },
  {
    url: "/boss/dashboard/manager-cashflow",
    Element: BossCashflowPage,
    meta: { isAuth: true, role: new Set(["admin", "12"]) },
  },
  {
    url: "/boss/dashboard/accountant-cashflow",
    Element: BossCashflowPage,
    meta: { isAuth: true, role: new Set(["admin", "12"]) },
  },
];

export default Route;
