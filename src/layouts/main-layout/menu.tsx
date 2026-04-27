import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bot, DollarSign, Sun } from "lucide-react";
import { format } from "date-fns";
import { useMeStore } from "@/store/me-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { DataMenu } from "./menu-datas";

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
        className={`flex items-center gap-[12px] rounded-[8px] px-[4px] py-[4px] transition-colors text-left ${
          isSiActive ? "bg-white" : "hover:bg-white/60"
        }`}
      >
        <div className="w-[52px] h-[52px] rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0">
          <Bot className="w-[26px] h-[26px] text-white" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[17px] font-medium text-[#1a1a1a]">Si tahlil</span>
          <span className="text-[13px] font-normal text-[#1a1a1a]">Sun'iy intellekt tahlili</span>
        </div>
      </button>

      {/* Currency */}
      <div className="flex items-center gap-[12px]">
        <div className="w-[52px] h-[52px] rounded-full bg-[#fd0] flex items-center justify-center shrink-0">
          <DollarSign className="w-[24px] h-[24px] text-[#1a1a1a]" strokeWidth={2} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[17px] font-medium text-[#1a1a1a]">1$ ~ 12 110 uzs</span>
          <span className="text-[13px] font-normal text-[#1a1a1a]">Markaziy Bank {today}</span>
        </div>
      </div>

      {/* Weather */}
      <div className="flex items-center gap-[12px]">
        <div className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shrink-0">
          <Sun className="w-[28px] h-[28px] text-[#1a1a1a]" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[17px] font-medium text-[#1a1a1a]">+4 ℃</span>
          <span className="text-[13px] font-normal text-[#1a1a1a]">Quyoshli kun</span>
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

  return (
    <nav className="flex flex-col gap-0 w-fit h-full">
      {menuItems.map((item) => {
        const active = isActive(item.link);
        return (
          <div
            key={item.link}
            onClick={() => handleClick(item)}
            className={`flex items-center py-[12px] rounded-sm cursor-pointer transition-colors ${
              active ? "bg-white" : ""
            }`}
            style={{ paddingLeft: 0, paddingRight: "16px" }}
          >
            {/* Tayoqcha — 5px left, 3x18px */}
            <div className="w-[3px] h-[18px] rounded-full shrink-0" style={{ marginLeft: "5px", backgroundColor: active ? "#4A9FE5" : "transparent" }} />

            {/* Badge — 5px gap, 4x4px */}
            <div className="w-[4px] h-[4px] rounded-full shrink-0" style={{ marginLeft: "5px", backgroundColor: active ? "#E38157" : "transparent" }} />

            {/* Icon — 5px gap, 20x20 */}
            <div className="w-[20px] h-[20px] flex items-center justify-center shrink-0" style={{ marginLeft: "5px" }}>
              {item.icons()}
            </div>

            {/* Text */}
            <span className="text-[15px] font-normal text-[#1a1a1a] whitespace-nowrap ml-[12px]">
              {item.text}
            </span>
          </div>
        );
      })}

      {isBoss && <BossSidebarWidgets />}
    </nav>
  );
}
