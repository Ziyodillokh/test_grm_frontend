import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import FilterSelect from "@/components/filters-ui/filter-select";
import { ListRow } from "@/components/ui/list-row";
import { MonthsArray } from "@/consts";
import { useCustomsDetail } from "./queries";
import formatPrice from "@/utils/formatPrice";
import TebleAvatar from "@/components/teble-avatar";
import ReportToolbar from "@/components/report-toolbar";
import { CustomsDetailItem } from "./type";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

const gridTemplate = "90px 60px 120px 120px 1fr";
const columnLabels = ["Summa", "", "Turi", "Sana", "Ma'lumotlar"];

export default function CustomsDetailPage() {
  const { customsId } = useParams();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));
  const [yearFilter] = useQueryState("year", parseAsString.withDefault(String(new Date().getFullYear())));

  const activeYear = Number(yearFilter);

  const { data, isLoading } = useCustomsDetail({
    customsId: customsId || "",
    queries: {
      year: activeYear,
      month: Number(month),
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;
  const customs = data?.pages?.[0]?.customs;

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar
        totalsItems={[
          { label: (customs?.title || "") + ":", value: totals?.total_income || 0, color: "#FF6600" },
          { value: totals?.total_expense || 0, color: "#47B13C" },
          { value: customs?.totalDebt || 0, color: "#1a1a1a" },
        ]}
        filterContent={
          <>
            <div>
              <p className="text-[13px] text-muted-foreground mb-1">Yil</p>
              <FilterSelect
                placeholder="Yil tanlang"
                className="w-full"
                options={yearsArray}
                name="year"
                defaultValue={String(activeYear)}
              />
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground mb-1">Oy</p>
              <FilterSelect
                placeholder="Oy tanlang"
                className="w-full"
                options={MonthsArray}
                name="month"
                defaultValue={String(new Date().getMonth() + 1)}
              />
            </div>
            <Button variant="outline" className="w-full mt-2">
              Tozalash
            </Button>
          </>
        }
      />

      {/* Column labels */}
      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "16px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className={`text-[13px] text-[#A3A3A3] ${i === 0 ? "text-right" : ""}`}>{label}</span>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          items.map((item: CustomsDetailItem) => {
            const isIncome = item.type === "Приход";
            const typeColor = isIncome ? "#3ABC49" : "#EF5C12";

            const avatarName = item.createdBy?.firstName || "?";
            const avatarUrl = item.createdBy?.avatar?.path;

            return (
              <ListRow
                key={item.id}
                gridTemplate={gridTemplate}
                gridGap="16px"
              >
                {/* Summa */}
                <div className="text-right">
                  <span className={`text-[15px] font-medium ${isIncome ? "text-[#1a1a1a]" : "text-[#EF5C12]"}`}>
                    {isIncome ? "+" : "-"} {formatPrice(item.price || 0)}
                  </span>
                </div>

                {/* Avatar */}
                <div className="flex items-center justify-center">
                  <TebleAvatar
                    size={42}
                    name={avatarName}
                    url={avatarUrl}
                    status="success"
                  />
                </div>

                {/* Turi */}
                <div className="flex items-center gap-[6px]">
                  <span
                    className="w-[6px] h-[6px] rounded-full shrink-0"
                    style={{ backgroundColor: typeColor }}
                  />
                  <span className="text-[13px] font-medium text-[#1a1a1a]">
                    {isIncome ? "Kirim" : "Chiqim"}
                  </span>
                </div>

                {/* Sana */}
                <span className="text-[13px] text-[#1a1a1a]">
                  {item.date ? format(new Date(item.date), "dd MMM yyyy") : "—"}
                </span>

                {/* Malumotlar */}
                <span className="text-[13px] text-[#1a1a1a] truncate">
                  {item.comment || item.tip || "—"}
                  {item.cashflow_type && (
                    <span className="text-[#a3a3a3] ml-2">({item.cashflow_type.title})</span>
                  )}
                </span>
              </ListRow>
            );
          })
        )}
      </div>
    </div>
  );
}
