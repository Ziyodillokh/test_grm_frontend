import Form from "./form/index.tsx";

const AuthRoute = [
  {
    url: "/login",
    Element: Form,
    meta: { isAuth: false, role: new Set(["admin"]) },
  },
];

export default AuthRoute;
