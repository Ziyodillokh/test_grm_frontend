import CurrentMonthPage from ".";
import KassaCashflowsPage from "../monthly/kassa-cashflows";

const Route = [
  {
    url: "/m-manager/current-month",
    Element: CurrentMonthPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/m-manager/current-month/:id/info",
    Element: KassaCashflowsPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
