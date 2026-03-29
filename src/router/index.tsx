import { Fragment } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "@/layouts/main-layout";
import PublicLayout from "@/layouts/main-layout/PublicLayout";
import NotFound from "@/not-found";
import LoginForm from "@/pages/login/form";

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
        {nestedRoutes(router)}
        <Route path="/*" element={<NotFound />} />
      </Route>
      <Route element={<PublicLayout />}>
        <Route path={"/login"} element={<LoginForm />} />
        <Route path="/*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}
