import Page from "./table";

const Route = [
  {
    url: "/i-products",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
 
];

export default Route;
