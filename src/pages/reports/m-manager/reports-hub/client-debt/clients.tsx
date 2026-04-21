import { useNavigate, useParams, useLocation } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { Loader } from "lucide-react";
import { ListRow } from "@/components/ui/list-row";
import formatPrice from "@/utils/formatPrice";
import { useDebtClients } from "./queries";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import ReportToolbar from "@/components/report-toolbar";

const gridTemplate = "40px 1fr 140px 120px 120px 120px";
const columnLabels = ["№", "Ism", "Telefon", "Qarzlar", "Qaytarilgan", "Qoldiq"];

export default function ClientDebtClients() {
  const navigate = useNavigate();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const { filialId } = useParams();
  const { data, isLoading } = useDebtClients(filialId);
  const [search] = useQueryState("search", parseAsString);

  const basePath = location.pathname.includes("/f-manager/")
    ? "/f-manager/reports-hub/client-debt"
    : "/m-manager/reports-hub/client-debt";

  const allItems = data?.items || [];
  const items = search
    ? allItems.filter((item: any) =>
        (item.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.phone || "").includes(search)
      )
    : allItems;
  const summary = data?.summary || { totalOwed: 0, totalGiven: 0, balance: 0 };

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar
        totalsItems={[
          { label: "Umumiy:", value: summary.totalOwed || 0, color: "#FF6600" },
          { value: summary.totalGiven || 0, color: "#47B13C" },
          { value: summary.balance || 0, color: "#1a1a1a" },
        ]}
      />

      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className="text-[13px] text-[#A3A3A3]">{label}</span>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          items.map((item: any, i: number) => (
            <ListRow
              key={item.id || i}
              gridTemplate={gridTemplate}
              className="pl-[12px]"
              minHeight={60}
              onClick={() => {
                const path = `${basePath}/${filialId}/${item.id}`;
                push(item.fullName || "Mijoz", path);
                navigate(path);
              }}
            >
              <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">{item.fullName}</span>
              <span className="text-[13px] text-[#a3a3a3]">{item.phone || "—"}</span>
              <span className="text-[13px] font-medium text-[#FF6600]">{formatPrice(item.owed || 0)} $</span>
              <span className="text-[13px] font-medium text-[#47B13C]">{formatPrice(item.given || 0)} $</span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">{formatPrice(item.balance || 0)} $</span>
            </ListRow>
          ))
        )}
      </div>
    </div>
  );
}
