import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  ChevronRight,
  CalendarDays,
  Package,
  ShoppingCart,
  Users,
  Factory,
  Truck,
  Shield,
  UserCheck,
  FileText,
} from "lucide-react";

const reports = [
  {
    title: "Oylik hisobotlar",
    description: "Sotuvlarni tasdiqlash",
    link: "/m-manager/reports-hub/monthly",
    icon: CalendarDays,
  },
  {
    title: "Qoldiq Hisoboti",
    description: "O'zi norm faqat qaysi muddada qanchaligi ko'rinishi kerak",
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
    title: "Kentlar Hisoboti",
    description: "Mijozlar qarzdorligi",
    link: "/m-manager/reports-hub/clients",
    icon: Users,
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
    title: "Tamojniy",
    description: "Qarzdorlik to'langan va qoldiq",
    link: "/m-manager/reports-hub/customs",
    icon: Shield,
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

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold mb-4">Hisobotlar</h2>
      {reports.map((report) => (
        <Card
          key={report.link}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(report.link)}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                <report.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-[15px]">{report.title}</p>
                <p className="text-sm text-muted-foreground">
                  {report.description}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
}
