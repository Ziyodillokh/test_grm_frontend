import QrLogoPage from "./table/index";

const Route = [
  {
    url: "/qr-logo",
    Element: QrLogoPage,
    meta: { isAuth: true, role: new Set(["I-manager"]) },
  },
];

export default Route;
