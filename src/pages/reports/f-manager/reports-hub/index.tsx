import { useNavigate } from "react-router-dom";
import { ChevronRight, CalendarDays, Package, ShoppingCart, Users, FileText, CreditCard } from "lucide-react";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { ListRow } from "@/components/ui/list-row";

const reports = [
  {
    title: "Oylik Hisobotlar",
    description: "Har oyda ochilgan kassalar ro'yxati",
    link: "/f-manager/reports-hub/monthly",
    icon: CalendarDays,
  },
  {
    title: "Qoldiq Hisoboti",
    description: "Mahsulotlar qoldig'i bo'yicha hisobot",
    link: "/f-manager/reports-hub/inventory",
    icon: Package,
  },
  {
    title: "Sotuv Hisoboti",
    description: "Oylik sotuv ma'lumotlari",
    link: "/f-manager/reports-hub/sales",
    icon: ShoppingCart,
  },
  {
    title: "Qarz Hisoboti",
    description: "Mijozlar qarzdorligi",
    link: "/f-manager/reports-hub/client-debt",
    icon: CreditCard,
  },
  {
    title: "Sotuvchi Hisoboti",
    description: "Sotuvchilar faoliyati",
    link: "/f-manager/reports-hub/sellers",
    icon: Users,
  },
  {
    title: "Umumiy Hisobot",
    description: "Oylik jarayonlar umumiy ko'rinishi",
    link: "/f-manager/reports-hub/general",
    icon: FileText,
  },
];

export default function ReportsHubPage() {
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);

  return (
    <div className="py-2 space-y-[4px]">
      {reports.map((report) => (
        <ListRow
          key={report.link}
          className="group flex items-center gap-[24px]"
          onClick={() => {
            push(report.title, report.link);
            navigate(report.link);
          }}
        >
          <report.icon className="w-[28px] h-[28px] text-[#1a1a1a] shrink-0" strokeWidth={1.5} />
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-normal text-[#1a1a1a]">{report.title}</p>
            <p className="text-[13px] text-[#a3a3a3] mt-[2px]">{report.description}</p>
          </div>
          <ChevronRight className="w-[24px] h-[24px] text-[#a3a3a3] group-hover:text-[#1a1a1a] shrink-0 transition-colors" strokeWidth={1.5} />
        </ListRow>
      ))}
    </div>
  );
}
