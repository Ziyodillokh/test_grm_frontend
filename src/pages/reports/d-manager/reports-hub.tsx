import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ChevronRight, CalendarDays, Handshake } from "lucide-react";

const reports = [
  {
    title: "Oylik Hisobotlar",
    description: "Oylik moliyaviy hisobotlar",
    link: "/d-manager/reports-hub/monthly",
    icon: CalendarDays,
  },
  {
    title: "Dillerlar Hisoboti",
    description: "Diller qarzdorligi to'langan va qoldiq",
    link: "/d-manager/reports-hub/dealers",
    icon: Handshake,
  },
];

export default function DManagerReportsHubPage() {
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
