import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { Loader } from "lucide-react";
import { ListRow } from "@/components/ui/list-row";
import formatPrice from "@/utils/formatPrice";
import { useMeStore } from "@/store/me-store";
import { Roles } from "@/constants";
import { useDebtFilials } from "./queries";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import ReportToolbar from "@/components/report-toolbar";

const gridTemplate = "40px 1fr 120px 120px 120px 80px";
const columnLabels = ["№", "Filial", "Qarzlar", "Qaytarilgan", "Qoldiq", "Clientlar"];

export default function ClientDebtFilials() {
  const navigate = useNavigate();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const { meUser } = useMeStore();
  const { data, isLoading } = useDebtFilials();
  const [search] = useQueryState("search", parseAsString);

  const basePath = location.pathname.includes("/f-manager/")
    ? "/f-manager/reports-hub/client-debt"
    : "/m-manager/reports-hub/client-debt";

  useEffect(() => {
    if (meUser?.position?.role === Roles.F_MANAGER && meUser?.filial?.id) {
      navigate(`${basePath}/${meUser.filial.id}`, { replace: true });
    }
  }, [meUser, basePath, navigate]);

  const allItems = data?.items || [];
  const items = search
    ? allItems.filter((item: any) =>
        item.filialTitle?.toLowerCase().includes(search.toLowerCase())
      )
    : allItems;
  const totals = data?.totals || { totalOwed: 0, totalGiven: 0, balance: 0 };

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar
        totalsItems={[
          { label: "Umumiy:", value: totals.totalOwed || 0, color: "#FF6600" },
          { value: totals.totalGiven || 0, color: "#47B13C" },
          { value: totals.balance || 0, color: "#1a1a1a" },
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
              key={item.filialId || i}
              gridTemplate={gridTemplate}
              className="pl-[12px]"
              minHeight={60}
              onClick={() => {
                const path = `${basePath}/${item.filialId}`;
                push(item.filialTitle || "Filial", path);
                navigate(path);
              }}
            >
              <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">{item.filialTitle}</span>
              <span className="text-[13px] font-medium text-[#FF6600]">{formatPrice(item.totalOwed || 0)} $</span>
              <span className="text-[13px] font-medium text-[#47B13C]">{formatPrice(item.totalGiven || 0)} $</span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">{formatPrice(item.balance || 0)} $</span>
              <span className="text-[13px] text-[#a3a3a3]">{item.clientCount || 0}</span>
            </ListRow>
          ))
        )}
      </div>
    </div>
  );
}
