import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/auth-store";
import { useMeStore } from "@/store/me-store";

import Header from "./header";
import Menu from "./menu";

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
    <div className="h-screen w-screen flex flex-col bg-[#f5f5f5] overflow-hidden">
      {/* Header — 90px, 16-column grid */}
      <Header />

      {/* Content — 16-column grid, 4:8:4 */}
      <div
        className="flex-1 min-h-0"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(16, 1fr)",
          columnGap: "20px",
          padding: "0 20px",
        }}
      >
        {/* Sidebar — 4 cols */}
        <aside
          style={{ gridColumn: "1 / 5" }}
          className="min-h-0 overflow-hidden"
        >
          <Menu />
        </aside>

        {/* Main content — 10 cols */}
        <main
          style={{ gridColumn: "5 / 15" }}
          className="min-h-0 overflow-hidden"
        >
          <div className="h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
