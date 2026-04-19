import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { DataMenu } from "./menu-datas";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { meUser } = useMeStore();
  const activeMenuLink = useBreadcrumbStore((s) => s.activeMenuLink);
  const setMenu = useBreadcrumbStore((s) => s.setMenu);

  const role = meUser?.position?.role;
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
    <nav className="flex flex-col gap-0 w-fit">
      {menuItems.map((item) => {
        const active = isActive(item.link);
        return (
          <div
            key={item.link}
            onClick={() => handleClick(item)}
            className={`flex items-center py-[12px] rounded-[8px] cursor-pointer transition-colors ${
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
    </nav>
  );
}
