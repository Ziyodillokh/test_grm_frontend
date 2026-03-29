// import SinglePage from "./info";
import NotPublishedPage from "./table/index";

const Route = [
  {
    url: "/not-published-products",
    Element: NotPublishedPage,
    meta: { isAuth: true, role: new Set(["I-manager"]) },
  },
];

export default Route;