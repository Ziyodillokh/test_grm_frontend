import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, LogOut } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { useMeStore } from "@/store/me-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

import { DataMenu } from "./menu-datas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { minio_img_url } from "@/constants";
import { BellRingingIcon } from "@/components/icons";

export default function Header() {
  const { meUser, removeUserMe } = useMeStore();
  const { removeToken } = useAuthStore();
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbStore((s) => s.items);
  const goBack = useBreadcrumbStore((s) => s.goBack);
  const activeMenuLink = useBreadcrumbStore((s) => s.activeMenuLink);

  // Hozirgi sahifa menu ma'lumotlari — activeMenuLink asosida
  const role = meUser?.position?.role;
  const menuItems = DataMenu?.[role as keyof typeof DataMenu];

  const currentMenu = menuItems?.find((e) => e.link === activeMenuLink);

  // Breadcrumb — store dan olinadi
  // items[0] = root (menu nomi), items[1+] = ichki sahifalar
  const hasBreadcrumb = breadcrumbItems.length > 1;
  const isDeepRoute = hasBreadcrumb;

  const handleLogout = () => {
    removeToken();
    removeUserMe();
    window.location.replace("/login");
  };

  return (
    <header
      className="h-[90px] shrink-0"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(16, 1fr)",
        columnGap: "20px",
        padding: "0 20px",
        alignItems: "center",
      }}
    >
      {/* Col 1-4: Logo + theme + profil + notification + logout */}
      <div
        style={{ gridColumn: "1 / 5" }}
        className="flex items-center gap-[32px] h-full"
      >
        <img src="/logo.svg" className="h-[32px]" alt="OneIP" />

        <button className="w-[20px] h-[20px] flex items-center justify-center shrink-0">
          <Sun className="w-[20px] h-[20px] text-[#272727]" />
        </button>

        <div
          onClick={() => navigate("/profile")}
          className="h-[40px] pl-[4px] pr-[10px] bg-white rounded-full flex items-center gap-[8px] cursor-pointer shrink-0"
        >
          <Avatar className="w-[32px] h-[32px]">
            <AvatarImage src={minio_img_url + meUser?.avatar?.path} />
            <AvatarFallback className="bg-primary text-white text-[12px]">
              {meUser?.firstName?.[0]}
              {meUser?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-medium text-[#272727]">Profil</span>
        </div>

        <button
          onClick={() => navigate("/xabarnoma")}
          className="w-[20px] h-[20px] flex items-center justify-center shrink-0"
        >
          <BellRingingIcon />
        </button>

        <button
          onClick={handleLogout}
          className="w-[20px] h-[20px] flex items-center justify-center shrink-0 opacity-40 hover:opacity-100 transition-opacity"
        >
          <LogOut className="w-[20px] h-[20px] text-[#272727]" />
        </button>
      </div>

      {/* Col 6-16: Breadcrumb */}
      <div
        style={{ gridColumn: "5 / 16" }}
        className="flex items-center gap-[12px] h-full"
      >
        {isDeepRoute && hasBreadcrumb ? (
          <>
            {/* Back arrow */}
            <button
              onClick={() => {
                const prev = goBack();
                if (prev?.path) {
                  navigate(prev.path);
                } else {
                  navigate(-1);
                }
              }}
              className="shrink-0"
            >
              <ArrowLeft className="w-[32px] h-[32px] text-[#1a1a1a]" />
            </button>

            {/* Oldingi sahifalar — opacity 0.4 */}
            {breadcrumbItems.slice(0, -1).map((item, i) => (
              <div key={i} className="flex items-center gap-[12px]">
                {i > 0 && (
                  <span className="w-[6px] h-[6px] rounded-full bg-[#1a1a1a] opacity-40 shrink-0" />
                )}
                <span className="text-[28px] font-normal text-[#1a1a1a] opacity-40 whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}

            {/* Ajratuvchi nuqta */}
            <span className="w-[6px] h-[6px] rounded-full bg-[#1a1a1a] opacity-40 shrink-0" />

            {/* Hozirgi sahifa — active */}
            <span className="text-[28px] font-normal text-[#1a1a1a] whitespace-nowrap">
              {breadcrumbItems[breadcrumbItems.length - 1].label}
            </span>
          </>
        ) : (
          <>
            {/* Menu icon — 32x32 */}
            {currentMenu && (
              <div className="w-[32px] h-[32px] flex items-center justify-center shrink-0 [&_svg]:w-[32px] [&_svg]:h-[32px]">
                {currentMenu.icons()}
              </div>
            )}
            {/* Sahifa nomi */}
            <span className="text-[28px] font-normal text-[#1a1a1a]">
              {breadcrumbItems[0]?.label || currentMenu?.text || ""}
            </span>
          </>
        )}
      </div>
    </header>
  );
}
