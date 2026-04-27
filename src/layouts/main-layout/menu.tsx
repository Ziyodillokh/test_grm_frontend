import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bot, DollarSign, Sun } from "lucide-react";
import { format } from "date-fns";
import { useMeStore } from "@/store/me-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { DataMenu } from "./menu-datas";

// Figma o'lchamlari (Boss sidebar pastki widgetlari):
// container 223×172, har widget 52h, orasidagi gap 8px
// Avatar 52×52 round, text block 109w (Si tahlil) / 159w (Currency) / 71w (Weather)
// Avatar va text orasi 12px (text x=64 = avatar 52 + gap 12)
// Title 17px Medium (h=20), subtitle 13px Regular (h=16), text orasi 2px
function BossSidebarWidgets() {
  const today = format(new Date(), "dd MMM yyyy");
  const navigate = useNavigate();
  const location = useLocation();
  const setMenu = useBreadcrumbStore((s) => s.setMenu);
  const isSiActive = location.pathname === "/si-tahlil";

  return (
    <div className="flex flex-col gap-[8px] mt-auto pb-[20px]">
      {/* Si tahlil — bosilsa /si-tahlil sahifasiga o'tadi */}
      <button
        type="button"
        onClick={() => {
          setMenu("/si-tahlil", "Si tahlil");
          navigate("/si-tahlil");
        }}
        className={`flex items-center gap-[12px] h-[52px] rounded-[8px] transition-colors text-left ${
          isSiActive ? "bg-white" : "hover:bg-white/60"
        }`}
      >
        <div className="w-[52px] h-[52px] rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0">
          <Bot className="w-[26px] h-[26px] text-white" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[17px] font-medium text-[#1a1a1a] leading-[20px]">Si tahlil</span>
          <span className="text-[13px] font-normal text-[#1a1a1a] leading-[16px]">
            Sun'iy intellekt tahlili
          </span>
        </div>
      </button>

      {/* Currency */}
      <div className="flex items-center gap-[12px] h-[52px]">
        <div className="w-[52px] h-[52px] rounded-full bg-[#fd0] flex items-center justify-center shrink-0">
          <DollarSign className="w-[24px] h-[24px] text-[#1a1a1a]" strokeWidth={2} />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[17px] font-medium text-[#1a1a1a] leading-[20px]">
            1$ ~ 12 110 uzs
          </span>
          <span className="text-[13px] font-normal text-[#1a1a1a] leading-[16px]">
            Markaziy Bank {today}
          </span>
        </div>
      </div>

      {/* Weather */}
      <div className="flex items-center gap-[12px] h-[52px]">
        <div className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shrink-0">
          <Sun className="w-[28px] h-[28px] text-[#1a1a1a]" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[17px] font-medium text-[#1a1a1a] leading-[20px]">+4 ℃</span>
          <span className="text-[13px] font-normal text-[#1a1a1a] leading-[16px]">Quyoshli kun</span>
        </div>
      </div>
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
  const menuItems =
    DataMenu[(role || "admin") as keyof typeof DataMenu] || [];

  // Sahifaga to'g'ridan-to'g'ri kirganda (login redirect, refresh) — URLga qarab menu activate
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

  // Figma (Boss sidebar): item 200×42 rounded-6, active bg-white +
  // 3×18 ko'k bar at left=4. Icon 18×18, text 15px (line-height 18).
  // Icon va text orasi 8px. Item ichida pl=20 (bar 4 + 13 gap + ... aslida
  // icon at left=20 from card edge).
  return (
    <nav className="flex flex-col gap-[6px] h-full pt-[2px]">
      {menuItems.map((item) => {
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
            {/* Active blue bar — 3×18, left 4 from card edge */}
            {active && (
              <span className="absolute left-[4px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-[10px] bg-[#0078d4]" />
            )}

            {/* Icon — 18×18 */}
            <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0 [&_svg]:w-[18px] [&_svg]:h-[18px]">
              {item.icons()}
            </div>

            {/* Text — 8px gap from icon */}
            <span className="ml-[8px] text-[15px] font-normal text-[#1a1a1a] whitespace-nowrap">
              {item.text}
            </span>
          </button>
        );
      })}

      {isBoss && <BossSidebarWidgets />}
    </nav>
  );
}
