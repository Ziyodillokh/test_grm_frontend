import QRCodeGenerator from "./index";

const Route = [
  {
    url: "/qrcode",
    Element: QRCodeGenerator,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;