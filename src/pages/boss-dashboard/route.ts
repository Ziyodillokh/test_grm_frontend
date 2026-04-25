import BossDashboard from ".";

const Route = [
  {
    url: "/boss/dashboard",
    Element: BossDashboard,
    meta: { isAuth: true, role: new Set(["admin", "12"]) },
  },
];

export default Route;
