import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const breadcrumbItems = useBreadcrumbStore((s) => s.items);
  const goBack = useBreadcrumbStore((s) => s.goBack);
  const goTo = useBreadcrumbStore((s) => s.goTo);
  const activeMenuLink = useBreadcrumbStore((s) => s.activeMenuLink);

  // Hozirgi sahifa menu ma'lumotlari — activeMenuLink asosida
  const role = meUser?.position?.role;
  const menuItems = DataMenu?.[role as keyof typeof DataMenu];

  const currentMenu = menuItems?.find((e) => e.link === activeMenuLink);

  // Breadcrumb — store dan olinadi
  // items[0] = root (menu nomi), items[1+] = ichki sahifalar
  const hasBreadcrumb = breadcrumbItems.length > 1;

  // URL menu linkdan chuqurroq bo'lsa — ichki sahifa (refresh qilganda ham ishlaydi)
  const isDeepByUrl =
    activeMenuLink && location.pathname !== activeMenuLink &&
    location.pathname.startsWith(activeMenuLink);

  const isDeepRoute = hasBreadcrumb || isDeepByUrl;

  const handleLogout = () => {
    removeToken();
    removeUserMe();
    window.location.replace("/login");
  };

  const handleBack = () => {
    if (hasBreadcrumb) {
      // Store'da breadcrumb bor — uni pop qilish
      const prev = goBack();
      if (prev?.path) {
        navigate(prev.path);
      } else {
        navigate(-1);
      }
    } else {
      // Store'da breadcrumb yo'q (refresh bo'lgan) — parent URL ga qaytish
      navigate(-1);
    }
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
      {/* Col 1-4: Logo + theme + notification + profil */}
      <div
        style={{ gridColumn: "1 / 5", gap: "clamp(4px, 2vw, 32px)" }}
        className="flex items-center h-full min-w-0 overflow-hidden"
      >
        <img src="/logo.svg" className="h-[32px] shrink-0" alt="OneIP" />

        <button className="w-[20px] h-[20px] flex items-center justify-center shrink-0">
          <Sun className="w-[20px] h-[20px] text-[#272727]" />
        </button>

        <button
          onClick={() => navigate("/xabarnoma")}
          className="w-[20px] h-[20px] flex items-center justify-center shrink-0"
        >
          <BellRingingIcon />
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
          <span className="text-[13px] font-medium text-[#272727] whitespace-nowrap">
            {{ 4: "F-menejer", 6: "D-menejer", 7: "Skladchi", 8: "I-menejer", 9: "Menejer", 10: "Hisobchi", 12: "Boss" }[role as number] || "Profil"}
          </span>
        </div>
      </div>

      {/* Col 5-15: Breadcrumb */}
      <div
        style={{ gridColumn: "5 / 15" }}
        className="flex items-center gap-[12px] h-full"
      >
        {isDeepRoute ? (
          <>
            {/* Back arrow */}
            <button onClick={handleBack} className="shrink-0">
              <ArrowLeft className="w-[32px] h-[32px] text-[#1a1a1a]" />
            </button>

            {hasBreadcrumb ? (
              <>
                {/* Oldingi sahifalar — opacity 0.4, clickable */}
                {breadcrumbItems.slice(0, -1).map((item, i) => (
                  <div key={i} className="flex items-center gap-[12px]">
                    {i > 0 && (
                      <span className="w-[6px] h-[6px] rounded-full bg-[#1a1a1a] opacity-40 shrink-0" />
                    )}
                    <span
                      className="text-[28px] font-medium text-[#1a1a1a] opacity-40 whitespace-nowrap cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => {
                        const target = goTo(i);
                        if (target?.path) navigate(target.path);
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}

                {/* Ajratuvchi nuqta */}
                <span className="w-[6px] h-[6px] rounded-full bg-[#1a1a1a] opacity-40 shrink-0" />

                {/* Hozirgi sahifa — active */}
                <span className="text-[28px] font-medium text-[#1a1a1a] whitespace-nowrap">
                  {breadcrumbItems[breadcrumbItems.length - 1].label}
                </span>
              </>
            ) : (
              <>
                {/* Refresh bo'lganda — faqat root nomi (opacity 0.4) + hozirgi sahifa nomi */}
                <span className="text-[28px] font-medium text-[#1a1a1a] opacity-40 whitespace-nowrap">
                  {breadcrumbItems[0]?.label || currentMenu?.text || ""}
                </span>
              </>
            )}
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
            <span className="text-[28px] font-medium text-[#1a1a1a]">
              {breadcrumbItems[0]?.label || currentMenu?.text || ""}
            </span>
          </>
        )}
      </div>

      {/* Col 16: Logout */}
      <div
        style={{ gridColumn: "16 / 17" }}
        className="flex items-center justify-end h-full"
      >
        <button
          onClick={handleLogout}
          className="flex items-center gap-[8px] opacity-40 hover:opacity-100 transition-opacity"
        >
          <span className="text-[15px] font-medium text-[#272727] cursor-pointer">Chiqish</span>
          <LogOut className="w-[18px] h-[18px] text-[#272727]" />
        </button>
      </div>
    </header>
  );
}
