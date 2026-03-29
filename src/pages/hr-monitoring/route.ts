// route.ts
import Dashboard from ".";

const Route = [
  {
    url: "/dashboard",
    Element: Dashboard,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/monitoring",
    Element: Dashboard,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;