import NotePage from "./list";

const Route = [
  {
    url: "/note",
    Element: NotePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
