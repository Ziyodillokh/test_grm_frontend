import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import {
  DollarSign,
  Calendar,
  FileOutput,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { Button } from "@/components/ui/button";
import { useYear } from "@/store/year-store";
import { useFactoryDetail } from "./queries";
import formatPrice from "@/utils/formatPrice";
import { format } from "date-fns";
import { FactoryDetailItem } from "./type";

export default function FactoryDetailPage() {
  const { factoryId } = useParams();
  const { year } = useYear();
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(String(new Date().getMonth() + 1))
  );
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data, isLoading } = useFactoryDetail({
    factoryId: factoryId || "",
    queries: {
      year,
      month: Number(month),
    },
  });

  const flatData: FactoryDetailItem[] =
    data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;
  const factory = data?.pages?.[0]?.factory;

  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    window.open(
      `${baseUrl}/factory/report/excel?year=${year}&month=${month}&factoryId=${factoryId}`,
      "_blank"
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const cards = [
    { title: "Olingan", price: formatPrice(factory?.owed || 0) },
    { title: "To'langan", price: formatPrice(factory?.given || 0) },
    { title: "Qolgan", price: formatPrice(factory?.totalDebt || 0) },
  ];

  return (
    <div>
      {/* Header */}
      <div className="px-5 h-[64px] flex items-center gap-2 border-b border-border bg-sidebar">
        <p className="text-[20px] mr-auto font-medium">
          {factory?.title || ""}
        </p>

        <FilterSelect
          placeholder="Oy"
          className="border-border max-w-[160px] w-full border-l"
          options={MonthsArray}
          name="month"
          icons={<Calendar size={18} />}
          defaultValue={String(new Date().getMonth() + 1)}
        />

        <Button
          onClick={handleExport}
          variant="secondary"
          className="h-full border-l border-border rounded-none px-4"
        >
          <FileOutput size={18} />
          Export
        </Button>
      </div>

      {/* Card sort */}
      <div className="flex bg-sidebar border-b border-border">
        <div className="p-5 pl-7 w-full border-border border-r max-w-[350px]">
          <div className="flex items-center">
            <DollarSign size={48} />
            <div>
              <p className="text-[12px]">Jami qarz</p>
              <p className="text-[22px] font-bold text-foreground">
                {formatPrice(factory?.totalDebt || 0)} $
              </p>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-3">
          {cards.map((e) => (
            <div
              key={e.title}
              className="bg-sidebar h-[78px] border-border border-r border-b flex justify-between items-center px-4 py-5"
            >
              <div>
                <p className="text-[12px] mb-0.5">{e.title}</p>
                <p className="text-[15px] font-medium">{e.price} $</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Period totals */}
      {totals && (
        <div className="bg-[#EEEEEE] flex">
          <p className="p-[20px] border-border border-r text-[14px] w-full">
            Davriy balans
          </p>
          <p className="p-[20px] border-border border-r text-[14px] w-full text-[#FF6600]">
            Olingan: {formatPrice(totals.period_owed || 0)} $
          </p>
          <p className="p-[20px] border-border border-r text-[14px] w-full text-[#89A143]">
            To'langan: {formatPrice(totals.period_given || 0)} $
          </p>
          <p className="p-[20px] text-[14px] w-full font-bold">
            Qolgan: {formatPrice(totals.period_balance || 0)} $
          </p>
        </div>
      )}

      {/* Table */}
      <div className="w-full">
        {/* Table header */}
        <div className="grid grid-cols-[48px_180px_120px_1fr_160px_40px] px-5 py-3 border-b border-border bg-muted/50 text-[13px] text-muted-foreground font-medium">
          <div></div>
          <div>Summasi</div>
          <div>Turi</div>
          <div>Ma'lumoti</div>
          <div>Kim to'lagan</div>
          <div></div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            Yuklanmoqda...
          </div>
        )}

        {/* Table rows */}
        {flatData.map((item) => {
          const isPartiya = item.entry_type === "partiya";
          const isExpanded = expandedRows.has(item.id);
          const hasCollections =
            isPartiya && item.collections && item.collections.length > 0;

          return (
            <div key={item.id}>
              {/* Main row */}
              <div
                className={`grid grid-cols-[48px_180px_120px_1fr_160px_40px] px-5 py-3 border-b border-border items-center ${
                  hasCollections ? "cursor-pointer hover:bg-muted/30" : ""
                }`}
                onClick={() => {
                  if (hasCollections) toggleExpand(item.id);
                }}
              >
                {/* Icon */}
                <div>
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded ${
                      isPartiya
                        ? "bg-[#FF6600] text-white"
                        : "bg-[#89A143] text-white"
                    }`}
                  >
                    {isPartiya ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </div>
                </div>

                {/* Summa */}
                <div>
                  <span
                    className={`font-bold text-[16px] ${
                      isPartiya ? "text-[#FF6600]" : "text-[#89A143]"
                    }`}
                  >
                    {formatPrice(item.total_cost || 0)} $
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {format(new Date(item.date), "dd MMM yyyy")}
                  </p>
                </div>

                {/* Turi */}
                <div
                  className={`text-[13px] font-medium ${
                    isPartiya ? "text-[#FF6600]" : "text-[#89A143]"
                  }`}
                >
                  {isPartiya ? "Расход" : "Приход"}
                </div>

                {/* Ma'lumoti */}
                <div className="text-[13px]">
                  {isPartiya ? (
                    <span className="font-medium">
                      {item.partiya_name || "Partiya"}
                      <span className="text-muted-foreground font-normal ml-2">
                        {item.total_kv ? `${formatPrice(item.total_kv)} m²` : ""}
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {item.comment || ""}
                    </span>
                  )}
                </div>

                {/* Kim to'lagan */}
                <div className="text-[13px]">
                  {!isPartiya && item.who_paid ? item.who_paid : ""}
                </div>

                {/* Chevron */}
                <div className="flex items-center justify-center">
                  {hasCollections ? (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )
                  ) : null}
                </div>
              </div>

              {/* Expanded collection rows */}
              {isPartiya && isExpanded && item.collections && (
                <div className="bg-muted/20">
                  {item.collections.map((col, idx) => (
                    <div
                      key={`${item.id}-col-${idx}`}
                      className="grid grid-cols-[48px_180px_120px_1fr_160px_40px] px-5 py-2 border-b border-border/50 items-center"
                    >
                      <div></div>
                      <div className="text-[13px] text-[#FF6600] font-medium pl-1">
                        {formatPrice(col.total_cost)} $
                      </div>
                      <div></div>
                      <div className="text-[13px]">
                        <span>{col.collection_title}</span>
                        <span className="text-muted-foreground ml-3">
                          {formatPrice(col.total_kv)} m²
                        </span>
                        <span className="text-muted-foreground ml-3">
                          × {formatPrice(col.price_per_kv)} $
                        </span>
                      </div>
                      <div></div>
                      <div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {!isLoading && flatData.length === 0 && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            Ma'lumot topilmadi
          </div>
        )}
      </div>
    </div>
  );
}
