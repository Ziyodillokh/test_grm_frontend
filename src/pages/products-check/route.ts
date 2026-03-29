import ActionPage from "./form";

const Route = [
  {
    url: "/product-check",
    Element: ActionPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
]

export default Route;
