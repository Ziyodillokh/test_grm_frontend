import CurrentMonthPage from ".";

const Route = [
  {
    url: "/m-manager/current-month",
    Element: CurrentMonthPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
