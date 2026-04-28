import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { ListRow } from "@/components/ui/list-row";
import ReportToolbar from "@/components/report-toolbar";
import RefreshRequestButton from "@/components/refresh-request-button";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

interface LibraryItem {
  title: string;
  description: string;
  link: string;
  icon: string;
}

const items: LibraryItem[] = [
  {
    title: "Barkodlar bazasi",
    description: "Barkodlarni qidirish, yangi barkod yuklash va shuningdek tahrirlash",
    link: "/data-library/barcodes",
    icon: "/icons/lib-barcode.svg",
  },
  {
    title: "Davlatlar",
    description: "Davlatlarni qidirish, yangi davlat yaratish va shuningdek tahrirlash",
    link: "/data-library/countries",
    icon: "/icons/lib-world.svg",
  },
  {
    title: "Taminotchilar",
    description: "Taminotchilarni qidirish, yangi taminotchi yaratish va shuningdek tahrirlash",
    link: "/data-library/factories",
    icon: "/icons/lib-factory.svg",
  },
  {
    title: "Kolleksiyalar",
    description: "Kolleksiyalarni qidirish, yangi kolleksiya yaratish va shuningdek tahrirlash",
    link: "/data-library/collections",
    icon: "/icons/lib-collection.svg",
  },
  {
    title: "Model (Design)",
    description: "Modellarni qidirish, yangi model yaratish va shuningdek tahrirlash",
    link: "/data-library/models",
    icon: "/icons/lib-model.svg",
  },
  {
    title: "O'lchamlar",
    description: "O'lchamlarni qidirish, yangi o'lcham yaratish va shuningdek tahrirlash",
    link: "/data-library/sizes",
    icon: "/icons/lib-ruler.svg",
  },
  {
    title: "Shakllar",
    description: "Shakllarni qidirish, yangi shakl yaratish va shuningdek tahrirlash",
    link: "/data-library/shapes",
    icon: "/icons/lib-shape.svg",
  },
  {
    title: "Ranglar",
    description: "Ranglarni qidirish, yangi rang yaratish va shuningdek tahrirlash",
    link: "/data-library/colors",
    icon: "/icons/lib-palette.svg",
  },
  {
    title: "Uslubiyatlar",
    description: "Uslubiyatlarni qidirish, yangi uslubiyat yaratish va shuningdek tahrirlash",
    link: "/data-library/styles",
    icon: "/icons/lib-wand.svg",
  },
];

export default function DataLibraryHubPage() {
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar — search/sort/filter/excel iconlari */}
      <div className="shrink-0">
        <ReportToolbar />
      </div>

      {/* Monitoring + Yangilanishni so'rash */}
      <div className="shrink-0 pb-[20px] flex items-center gap-[40px]">
        <RefreshRequestButton
          title="Monitoring"
          subtitle="Filial kesimida"
          icon={<img src="/icons/device-analytics.svg" alt="" className="w-[36px] h-[36px]" />}
        />
        <RefreshRequestButton />
      </div>

      {/* Menu list — har biri ListRow */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollCastom space-y-[4px] pb-[20px]">
        {items.map((item) => (
          <ListRow
            key={item.link}
            className="group flex items-center gap-[24px]"
            onClick={() => {
              push(item.title, item.link);
              navigate(item.link);
            }}
          >
            <span className="w-[40px] h-[40px] flex items-center justify-center shrink-0 text-[#1a1a1a]">
              <img src={item.icon} alt="" className="w-[40px] h-[40px]" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-normal text-[#1a1a1a]">{item.title}</p>
              <p className="text-[13px] text-[#a3a3a3] mt-[2px]">{item.description}</p>
            </div>
            <ChevronRight
              className="w-[24px] h-[24px] text-[#a3a3a3] group-hover:text-[#1a1a1a] shrink-0 transition-colors"
              strokeWidth={1.5}
            />
          </ListRow>
        ))}
      </div>
    </div>
  );
}
