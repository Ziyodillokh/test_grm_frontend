import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/auth-store";

import Header from "./header";
import Menu from "./menu";

export default function MainLayout() {
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      window.location.replace("/login");
    }
    // `/` navigatsiyasi router ichidagi RoleHome komponenti tomonidan boshqariladi
  }, [token]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f5f7f9] overflow-hidden">
      {/* Header — 90px, 16-column grid */}
      <Header />

      {/* Content — 16-column grid, 4:10 → 4:12 on narrow screens */}
      <div
        className="flex-1 min-h-0 layout-grid"
      >
        {/* Sidebar — 4 cols */}
        <aside
          className="min-h-0 overflow-hidden layout-sidebar"
        >
          <Menu />
        </aside>

        {/* Main content — 10 cols, expands to 12 on narrow */}
        <main
          className="min-h-0 overflow-hidden layout-content"
        >
          <div className="h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
