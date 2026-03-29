import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/auth-store";

export default function PublicLayout() {
  const { token } = useAuthStore();

  return token ? <Navigate to="/" replace /> : <Outlet />;
}
