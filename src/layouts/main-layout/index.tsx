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
      if (meUser?.position?.role === 3) {
        navigate("/products");
      } else {
        navigate("/dashboard");
      }
    }
  }, [token, meUser]);

  return (
    <SidebarProvider className="px-2.5 gap-4 overflow-hidden">
      <Menu />
      <SidebarInset >
        {meUser?.position?.role === 3 ? (
          <div className="h-5"></div>
        ) : pathname.pathname == "/cashier/home" ? (
          <div className="h-5"></div>
        ) : (
          <Header />
        )}
        <div
          className={`${(meUser?.position?.role === 3 || pathname.pathname == "/cashier/home") ? "max-h-[calc(100vh-20px)] " : "max-h-[calc(100vh-68px)] "} scrollCastom`}
        >
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
