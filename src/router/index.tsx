import { Fragment } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "@/layouts/main-layout";
import PublicLayout from "@/layouts/main-layout/PublicLayout";
import NotFound from "@/not-found";
import LoginForm from "@/pages/login/form";
import { useMeStore } from "@/store/me-store";

// Rol bo'yicha default sahifa
function RoleHome() {
  const role = useMeStore.getState().meUser?.position?.role;
  switch (role) {
    case 12: // Boss
      return <Navigate to="/boss/dashboard" replace />;
    case 9: // M-manager
      return <Navigate to="/m-manager/reports-hub" replace />;
    case 10: // Hisobchi
      return <Navigate to="/m-manager/reports-hub" replace />;
    case 7: // W-manager (Skladchi)
      return <Navigate to="/products" replace />;
    case 4: // F-manager
      return <Navigate to="/f-manager/kassa" replace />;
    case 8: // I-manager
      return <Navigate to="/f-manager/kassa" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
}

interface Imeta {
  role: Set<string>;
  isAuth: boolean;
}

interface IRouter {
  url: string;
  Element: React.ComponentType;
  children?: IRouter[];
  meta?: Imeta;
  hideIfchildern?: boolean;
}

const dynimicImportRoutes = import.meta.glob("../pages/**/route.ts", {
  eager: true,
}) as Record<string, { default: IRouter[] }>;

const router: IRouter[] = [];

Object.values(dynimicImportRoutes).forEach((el) => {
  router.push(...el.default);
});

const nestedRoutes = (routes: IRouter[]) =>
  routes.map(({ Element, url, children, meta }: IRouter) => {
    
    if (meta?.isAuth) {
      if (children?.length) {
        return (
          <Fragment key={url}>
            <Route path={url} element={<Element />} />
            {nestedRoutes(children)}
          </Fragment>
        );
      }
      return <Route key={url} path={url} element={<Element />} />;
    }
  });

export function MyRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<RoleHome />} />
        {nestedRoutes(router)}
        <Route path="/*" element={<NotFound />} />
      </Route>
      <Route element={<PublicLayout />}>
        <Route path={"/login"} element={<LoginForm />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
