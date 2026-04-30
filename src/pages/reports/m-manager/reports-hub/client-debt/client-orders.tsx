import { useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { Loader } from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import { ListRow } from "@/components/ui/list-row";
import formatPrice from "@/utils/formatPrice";
import { MonthsArray } from "@/consts";
import { useDebtOrders } from "./queries";
import ReportToolbar from "@/components/report-toolbar";

const yearsArray = Array.from({ length: 3 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

const gridTemplate = "40px 1fr 100px 80px 60px 80px 120px 140px 100px";
const columnLabels = ["№", "Kolleksiya", "Model", "Razmer", "Soni", "m²", "Narx", "Sotuvchi", "Sana"];

export default function ClientDebtOrders() {
  const { clientId } = useParams();
  const currentYear = String(new Date().getFullYear());
  const [yearFilter, setYearFilter] = useQueryState("year", parseAsString.withDefault(currentYear));
  const [month, setMonth] = useQueryState("month", parseAsString);

  const year = Number(yearFilter);

  const hasActiveFilter = yearFilter !== currentYear || (!!month && month !== "clear");
  const clearFilters = () => {
    setYearFilter(null);
    setMonth(null);
  };

  const { data, isLoading } = useDebtOrders(clientId, {
    year,
    month: month ? Number(month) : undefined,
    page: 1,
    limit: 100,
  });

  const items = data?.items || [];
  const client = data?.client || {};

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar
        totalsItems={client.id ? [
          { label: (client.fullName || "") + ":", value: client.owed || 0, color: "#FF6600" },
          { value: client.given || 0, color: "#47B13C" },
          { value: client.balance || 0, color: "#1a1a1a" },
        ] : undefined}
        hasActiveFilter={hasActiveFilter}
        onClearFilters={clearFilters}
        filterContent={
          <>
            <div className="flex flex-col gap-[6px]">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Yil</p>
              <FilterSelect
                variant="filter"
                placeholder="Yil tanlang"
                options={yearsArray}
                name="year"
                defaultValue={currentYear}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Oy</p>
              <FilterSelect
                variant="filter"
                placeholder="Barcha oylar"
                options={[{ label: "Hammasi", value: "clear" }, ...MonthsArray]}
                name="month"
                defaultValue="clear"
              />
            </div>
          </>
        }
      />

      {/* Column labels */}
      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className="text-[13px] text-[#A3A3A3]">{label}</span>
        ))}
      </div>

      {/* List */}
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
              minHeight={56}
            >
              <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">
                {item.product?.bar_code?.collection?.title || "—"}
              </span>
              <span className="text-[13px] text-[#1a1a1a]">
                {item.product?.bar_code?.model?.title || "—"}
              </span>
              <span className="text-[13px] text-[#1a1a1a]">
                {item.product?.bar_code?.size?.title || "—"}
              </span>
              <span className="text-[13px] text-[#1a1a1a]">
                {item.x || 1}
              </span>
              <span className="text-[13px] text-[#1a1a1a]">
                {Number(item.kv || 0).toFixed(2)}
              </span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">
                {formatPrice(item.price || 0)} $
              </span>
              <span className="text-[13px] text-[#a3a3a3]">
                {item.seller?.firstName || ""} {item.seller?.lastName || ""}
              </span>
              <span className="text-[13px] text-[#a3a3a3]">
                {item.date ? new Date(item.date).toLocaleDateString("ru-RU") : "—"}
              </span>
            </ListRow>
          ))
        )}
      </div>
    </div>
  );
}
