import { ListRow } from "@/components/ui/list-row";
import { Loader } from "lucide-react";
import SalesFilter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useSalesPartiya } from "./queries";
import { useNavigate, useLocation } from "react-router-dom";
import { useYear } from "@/store/year-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

const gridTemplate = "80px 1fr 1fr 100px 70px 100px 100px 100px 100px";
const columnLabels = ["Partiya", "Davlat", "Zavod", "Sana", "Soni", "Hajm", "Summa", "Foyda", "Chegirma"];

export default function PartiyaTable() {
  const { year } = useYear();
  const navigate = useNavigate();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));

  const { data, isLoading } =
    useSalesPartiya({
      queries: {
        year,
        month: Number(month),
      },
    });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.meta?.totals;

  return (
    <div className="flex flex-col h-full">
      <SalesFilter
        totalCount={totals?.totalCount || 0}
        totalKv={totals?.totalKv || 0}
        totalSum={totals?.totalSum || 0}
        totalProfit={totals?.totalProfit || 0}
        totalDiscount={totals?.totalDiscount || 0}
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
              key={item.partiyaId || i}
              gridTemplate={gridTemplate}
              className="pl-[20px]"
              minHeight={60}
              onClick={() => {
                const path = `${location.pathname}/partiya/${item.partiyaId}`;
                push(item.partiyaNo || "Partiya", path);
                navigate(path);
              }}
            >
              <span className="text-[13px] font-medium text-[#1a1a1a]">{item.partiyaNo}</span>
              <span className="text-[13px] text-[#1a1a1a]">{item.country}</span>
              <span className="text-[13px] text-[#1a1a1a]">{item.factory}</span>
              <span className="text-[13px] text-[#1a1a1a]">{item.date ? new Date(item.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }) : ""}</span>
              <span className="text-[13px] text-[#1a1a1a]">{(item.soldCount || 0).toLocaleString()} ta</span>
              <span className="text-[13px] text-[#1a1a1a]">{(item.soldKv || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²</span>
              <span className="text-[13px] text-[#1a1a1a]">{(item.soldSum || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $</span>
              <span className="text-[13px] text-[#47B13C]">+{(item.profit || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $</span>
              <span className="text-[13px] text-[#FF6527]">-{(item.discount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $</span>
            </ListRow>
          ))
        )}
      </div>
    </div>
  );
}
