import SiTahlilPage from ".";

const Route = [
  {
    url: "/si-tahlil",
    Element: SiTahlilPage,
    meta: { isAuth: true, role: new Set(["admin", "9", "12"]) },
  },
];

export default Route;
