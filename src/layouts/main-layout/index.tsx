import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useMeStore } from "@/store/me-store";

import Header from "./header";
import Menu from "./menu";
// import CashierHeader from "./cashier-header";

export default function MainLayout() {
  const { token } = useAuthStore();
  const pathname = useLocation();
  const navigate = useNavigate();
  const { meUser } = useMeStore();

  useEffect(() => {
    if (!token) {
      window.location.replace("/login");
    } else if (pathname.pathname == "/") {
      const role = meUser?.position?.role;
      if (role === 4) {
        navigate("/f-manager/kassa");
      } else if (role === 9 || role === 10) {
        navigate("/m-manager/current-month");
      } else {
        navigate("/dashboard");
      }
    }
  }, [token, meUser]);

  return (
    <SidebarProvider className="px-2.5 gap-4 overflow-hidden">
      <Menu />
      <SidebarInset >
        {meUser?.position?.role === 4 ? (
          <div className="h-5"></div>
        ) : pathname.pathname == "/f-manager/kassa" ? (
          <div className="h-5"></div>
        ) : (
          <Header />
        )}
        <div
          className={`${(meUser?.position?.role === 4 || pathname.pathname == "/f-manager/kassa") ? "max-h-[calc(100vh-20px)] " : "max-h-[calc(100vh-68px)] "} scrollCastom`}
        >
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
