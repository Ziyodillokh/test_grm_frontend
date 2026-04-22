import { useNavigate } from "react-router-dom";
import { ListRow } from "@/components/ui/list-row";
import { ChevronRight, CalendarDays, Handshake } from "lucide-react";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

const reports = [
  {
    title: "Oylik Hisobotlar",
    description: "Oylik moliyaviy hisobotlar",
    link: "/d-manager/reports-hub/monthly",
    icon: CalendarDays,
  },
  {
    title: "Qarzdorlik Hisoboti",
    description: "Diller qarzdorligi to'langan va qoldiq",
    link: "/d-manager/reports-hub/dealers",
    icon: Handshake,
  },
];

export default function DManagerReportsHubPage() {
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
