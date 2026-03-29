import ProductCharacteristics from "./table";

const Route = [
  {
    url: "/product-characteristics",
    Element: ProductCharacteristics,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;