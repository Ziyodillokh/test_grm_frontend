import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useMeStore } from "@/store/me-store";
import { useAuthStore } from "@/store/auth-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { SiTahlilIcon } from "@/components/icons/si-tahlil-icon";
import { DataMenu } from "./menu-datas";

const REMEMBER_KEY = "remember_login";

// Widget — 36×36 avatar + 16×16 icon, 10px gap, 2 textlar (15px medium / 13px regular), 36px height
function Widget({
  active,
  onClick,
  bg,
  iconColor,
  icon,
  title,
  subtitle,
  hoverable = true,
}: {
  active?: boolean;
  onClick?: () => void;
  bg: string;
  iconColor: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  hoverable?: boolean;
}) {
  const isButton = !!onClick;
  const Comp: any = isButton ? "button" : "div";
  return (
    <Comp
      type={isButton ? "button" : undefined}
      onClick={onClick}
      className={`group flex items-center gap-[10px] text-left ${
        isButton ? "cursor-pointer" : ""
      }`}
    >
      <div
        className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0"
        style={{ background: bg }}
      >
        <div className="w-[16px] h-[16px] flex items-center justify-center" style={{ color: iconColor }}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col justify-between h-[36px] py-[1px]">
        <span
          className={`text-[15px] font-medium leading-[18px] ${
            active
              ? "text-[#0078d4]"
              : hoverable
                ? "text-[#1a1a1a] group-hover:text-[#0078d4] transition-colors"
                : "text-[#1a1a1a]"
          }`}
        >
          {title}
        </span>
        <span
          className={`text-[13px] font-normal leading-[16px] ${
            active
              ? "text-[#0078d4]"
              : hoverable
                ? "text-[#1a1a1a] group-hover:text-[#0078d4] transition-colors"
                : "text-[#1a1a1a]"
          }`}
        >
          {subtitle}
        </span>
      </div>
    </Comp>
  );
}

// Custom toggle — 25×16, white bg / e1e1e1 border, 12×12 inner circle. Active = blue bg+border, white inner
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-[25px] h-[16px] rounded-full relative shrink-0 transition-colors"
      style={{
        background: checked ? "#0078d4" : "#ffffff",
        border: `1px solid ${checked ? "#0078d4" : "#e1e1e1"}`,
      }}
      aria-pressed={checked}
    >
      <span
        className="absolute top-1/2 -translate-y-1/2 w-[12px] h-[12px] rounded-full transition-all"
        style={{
          left: checked ? "calc(100% - 13px)" : "1px",
          background: checked ? "#ffffff" : "#e1e1e1",
        }}
      />
    </button>
  );
}

function SidebarBottom({ isBoss }: { isBoss: boolean }) {
  const today = format(new Date(), "dd MMM yyyy");
  const navigate = useNavigate();
  const location = useLocation();
  const setMenu = useBreadcrumbStore((s) => s.setMenu);
  const { removeUserMe } = useMeStore();
  const { removeToken } = useAuthStore();

  const [remember, setRemember] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(REMEMBER_KEY) === "true";
  });

  const isSiActive = location.pathname === "/si-tahlil";

  const handleToggle = (v: boolean) => {
    setRemember(v);
    localStorage.setItem(REMEMBER_KEY, String(v));
  };

  const handleLogout = () => {
    removeToken();
    removeUserMe();
    window.location.replace("/login");
  };

  return (
    <div className="flex flex-col pl-[10px] pb-[40px]">
      {/* Si widget — faqat Boss */}
      {isBoss && (
        <Widget
          active={isSiActive}
          onClick={() => {
            setMenu("/si-tahlil", "Si tahlil");
            navigate("/si-tahlil");
          }}
          bg="#1a1a1a"
          iconColor="#ffffff"
          icon={<SiTahlilIcon className="w-[16px] h-[16px]" />}
          title="Si tahlil"
          subtitle="Sun'iy intellekt tahlili"
        />
      )}

      {/* Currency — 20px above weather (so margin-top auto here is 20px from si if boss) */}
      <div style={{ marginTop: isBoss ? 20 : 0 }}>
        <Widget
          bg="#fd0"
          iconColor="#1a1a1a"
          icon={<img src="/icons/currency-dollar.svg" alt="" className="w-[16px] h-[16px]" />}
          title="1$ ~ 12 110 uzs"
          subtitle={`Markaziy Bank ${today}`}
        />
      </div>

      {/* Weather — 20px above currency */}
      <div style={{ marginTop: 20 }}>
        <Widget
          bg="#ffffff"
          iconColor="#1a1a1a"
          icon={<img src="/icons/sunset-2.svg" alt="" className="w-[16px] h-[16px]" />}
          title="+4 ℃"
          subtitle="Quyoshli kun"
          hoverable={false}
        />
      </div>

      {/* Toggle row — 60px above weather */}
      <div className="flex items-center" style={{ marginTop: 60 }}>
        <Toggle checked={remember} onChange={handleToggle} />
        <span className="ml-[10px] text-[13px] font-normal text-[#1a1a1a] hover:text-[#0078d4] transition-colors cursor-pointer select-none"
          onClick={() => handleToggle(!remember)}
        >
          Kirish parametrlarini eslab qolish
        </span>
      </div>

      {/* Chiqish — 20px above toggle */}
      <button
        type="button"
        onClick={handleLogout}
        className="group flex items-center gap-[10px] text-left"
        style={{ marginTop: 20 }}
      >
        <div className="w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center shrink-0 text-[#1a1a1a] group-hover:text-[#e5484d] transition-colors">
          <img
            src="/icons/lock.svg"
            alt=""
            className="w-[16px] h-[16px] [filter:none] group-hover:[filter:invert(38%)_sepia(73%)_saturate(2851%)_hue-rotate(335deg)_brightness(97%)_contrast(91%)]"
          />
        </div>
        <span className="text-[15px] font-medium text-[#1a1a1a] group-hover:text-[#e5484d] transition-colors">
          Chiqish
        </span>
      </button>
    </div>
  );
}

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { meUser } = useMeStore();
  const activeMenuLink = useBreadcrumbStore((s) => s.activeMenuLink);
  const setMenu = useBreadcrumbStore((s) => s.setMenu);

  const role = meUser?.position?.role;
  const isBoss = role === 12;
  const menuItems = DataMenu[(role || "admin") as keyof typeof DataMenu] || [];

  useEffect(() => {
    if (activeMenuLink || menuItems.length === 0) return;
    const match = menuItems
      .filter((e) => location.pathname.includes(e.link))
      .sort((a, b) => b.link.length - a.link.length)[0];
    if (match) {
      const label = (match as any).headerText || match.text;
      setMenu(match.link, label);
    }
  }, [location.pathname, activeMenuLink, menuItems, setMenu]);

  const isActive = (link: string) => activeMenuLink === link;

  const handleClick = (item: (typeof menuItems)[0]) => {
    const label = (item as any).headerText || item.text;
    setMenu(item.link, label);
    navigate(item.link);
  };

  return (
    <nav className="flex flex-col h-full pt-[2px]">
      {/* Top: Menu items */}
      <div className="flex flex-col gap-[6px]">
        {menuItems
          .filter((item) => item.link !== "/si-tahlil")
          .map((item) => {
            const active = isActive(item.link);
            return (
              <button
                key={item.link}
                type="button"
                onClick={() => handleClick(item)}
                className={`relative flex items-center h-[42px] w-[200px] rounded-[6px] pl-[20px] pr-[12px] cursor-pointer transition-colors text-left ${
                  active ? "bg-white" : "hover:bg-white/40"
                }`}
              >
                {active && (
                  <span className="absolute left-[4px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-[10px] bg-[#0078d4]" />
                )}
                <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0 [&_svg]:w-[18px] [&_svg]:h-[18px]">
                  {item.icons()}
                </div>
                <span className="ml-[8px] text-[15px] font-normal text-[#1a1a1a] whitespace-nowrap">
                  {item.text}
                </span>
              </button>
            );
          })}
      </div>

      {/* Bottom section pinned via mt-auto */}
      <div className="mt-auto">
        <SidebarBottom isBoss={isBoss} />
      </div>
    </nav>
  );
}
