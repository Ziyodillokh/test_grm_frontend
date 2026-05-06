import { useNavigate } from "react-router-dom";
import { ListRow } from "@/components/ui/list-row";
import {
  ChevronRight,
  CalendarDays,
  Package,
  ShoppingCart,
  Users,
  Factory,
  Truck,
  UserCheck,
  FileText,
  Handshake,
  CreditCard,
} from "lucide-react";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

const reports = [
  {
    title: "Oylik hisobotlar",
    description: "Sotuvlarni tasdiqlash",
    link: "/m-manager/reports-hub/monthly",
    icon: CalendarDays,
  },
  {
    title: "Qoldiq Hisoboti",
    description: "Mahsulotlar qoldig'i bo'yicha hisobot",
    link: "/m-manager/reports-hub/inventory",
    icon: Package,
  },
  {
    title: "Savdo bo'yicha hisobot",
    description: "Sotuv ma'lumotlari",
    link: "/m-manager/reports-hub/sales",
    icon: ShoppingCart,
  },
  {
    title: "Ko'cha Hisoboti",
    description: "Mijozlar qarzdorligi",
    link: "/m-manager/reports-hub/kents",
    icon: Users,
  },
  {
    title: "Sherikchilik Hisoboti",
    description: "Biznes sheriklar va ularning foyda va ulush taqsimoti",
    link: "/m-manager/reports-hub/sherikchilik",
    icon: Users,
  },
  {
    title: "Dillerlar Hisoboti",
    description: "Diller qarzdorligi to'langan va qoldiq",
    link: "/m-manager/reports-hub/dealers",
    icon: Handshake,
  },
  {
    title: "Zavodlar Hisoboti",
    description: "Qarzdorlik to'langan va qoldiq",
    link: "/m-manager/reports-hub/factories",
    icon: Factory,
  },
  {
    title: "Logistika Hisoboti",
    description: "Qarzdorlik to'langan va qoldiq",
    link: "/m-manager/reports-hub/logistics",
    icon: Truck,
  },
  {
    title: "Qarz Hisoboti",
    description: "Filiallar bo'yicha mijozlar qarzdorligi",
    link: "/m-manager/reports-hub/client-debt",
    icon: CreditCard,
  },
  {
    title: "Sotuvchi Hisoboti",
    description: "Sotuvchilar faoliyati",
    link: "/m-manager/reports-hub/sellers",
    icon: UserCheck,
  },
  {
    title: "Umumiy Hisobot",
    description: "Oylik jarayonlar umumiy ko'rinishi",
    link: "/m-manager/reports-hub/general",
    icon: FileText,
  },
];

export default function MManagerReportsHubPage() {
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);

  return (
    <div className="py-2 space-y-[4px] h-full overflow-y-auto scrollCastom">
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
