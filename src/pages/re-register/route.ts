import Page from "./table";

const Route = [
  {
    url: "/re-register",
    Element: Page,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
 
];

export default Route;
