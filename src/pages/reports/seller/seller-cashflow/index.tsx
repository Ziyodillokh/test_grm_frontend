import { useState } from "react";
import { useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { format, getMonth } from "date-fns";
import { ChevronDown, ChevronRight, Loader } from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import { ListRow } from "@/components/ui/list-row";
import { MonthsArray } from "@/consts";
import { useYear } from "@/store/year-store";
import formatPrice from "@/utils/formatPrice";
import TebleAvatar from "@/components/teble-avatar";
import ReportToolbar from "@/components/report-toolbar";

import { useSellerDailyReport } from "./queries";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

const gridTemplate = "110px 80px 100px 1fr 120px 120px 120px 30px";

export default function PageSellerCashFlow() {
  const { id } = useParams();
  const { year } = useYear();
  const currentYear = String(new Date().getFullYear());
  const currentMonth = String(getMonth(new Date()) + 1);
  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault(currentMonth)
  );
  const [yearQ, setYearQ] = useQueryState("year", parseAsString.withDefault(currentYear));
  const [userName] = useQueryState("userName", parseAsString.withDefault(""));
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const hasActiveFilter = month !== currentMonth || yearQ !== currentYear;
  const clearFilters = () => {
    setMonth(null);
    setYearQ(null);
  };

  const { data, isLoading } = useSellerDailyReport(id, year, Number(month));

  const totals = data?.totals;
  const plan = data?.plan;
  const seller = data?.seller;
  const days = data?.days || [];

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar
        beforeIcons={
          <div className="flex items-center gap-[8px] bg-white rounded-sm px-[12px] h-[42px]">
            {seller?.avatar && (
              <TebleAvatar
                status="none"
                name={seller.firstName}
                url={seller.avatar.path}
                size={32}
              />
            )}
            <span className="text-[14px] font-medium text-[#1a1a1a]">
              {seller?.firstName || userName?.split(" ")[0]} {seller?.lastName || userName?.split(" ")[1]}
            </span>
          </div>
        }
        totalsItems={[
          { label: "Sotuv:", value: totals?.earn || 0, color: "#47B13C" },
          { label: "Skidka:", value: totals?.discount || 0, color: "#FF6600" },
          { label: "Terminal:", value: totals?.plastic || 0, color: "#58A0C6" },
        ]}
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
                placeholder="Oy tanlang"
                options={MonthsArray}
                name="month"
                defaultValue={currentMonth}
              />
            </div>
          </>
        }
      />

      {/* Plan progress */}
      {(plan?.planPrice ?? 0) > 0 && (
        <div className="flex items-center gap-[12px] bg-white rounded-sm px-[16px] h-[42px] shrink-0 mb-[10px]">
          <span className="text-[13px] text-[#a3a3a3]">Planka:</span>
          <span className="text-[14px] font-medium">{formatPrice(plan?.planPrice || 0)} $</span>
          <div className="flex-1 h-[6px] bg-[#f0f0f0] rounded-full overflow-hidden max-w-[200px]">
            <div
              className={`h-full rounded-full ${(plan?.progress || 0) >= 100 ? "bg-[#47B13C]" : "bg-[#FF6600]"}`}
              style={{ width: `${Math.min(plan?.progress || 0, 100)}%` }}
            />
          </div>
          <span className={`text-[13px] font-medium ${(plan?.progress || 0) >= 100 ? "text-[#47B13C]" : "text-[#FF6600]"}`}>
            {plan?.progress || 0}%
          </span>
        </div>
      )}

      {/* Column labels */}
      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        <span className="text-[13px] text-[#A3A3A3]">Kun</span>
        <span className="text-[13px] text-[#A3A3A3]">Soni</span>
        <span className="text-[13px] text-[#A3A3A3]">Hajm</span>
        <span className="text-[13px] text-[#A3A3A3]"></span>
        <span className="text-[13px] text-[#A3A3A3]">Sotuv</span>
        <span className="text-[13px] text-[#A3A3A3]">Skidka</span>
        <span className="text-[13px] text-[#A3A3A3]">Terminal</span>
        <span></span>
      </div>

      {/* Days list */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : days.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <span className="text-[13px] text-[#a3a3a3]">Ma'lumot topilmadi</span>
          </div>
        ) : (
          days.map((day) => {
            const isExpanded = expandedDate === day.date;
            return (
              <div key={day.date}>
                <ListRow
                  gridTemplate={gridTemplate}
                  className="pl-[12px] cursor-pointer"
                  minHeight={52}
                  onClick={() => setExpandedDate(isExpanded ? null : day.date)}
                >
                  <span className="text-[13px] font-medium text-[#1a1a1a]">
                    {format(new Date(day.date), "dd.MM.yyyy")}
                  </span>
                  <span className="text-[13px] text-[#1a1a1a]">{day.count}</span>
                  <span className="text-[13px] text-[#1a1a1a]">{day.kv} m²</span>
                  <span></span>
                  <span className="text-[13px] font-medium text-[#47B13C]">
                    {formatPrice(day.earn)} $
                  </span>
                  <span className="text-[13px] text-[#FF6600]">
                    {formatPrice(day.discount)} $
                  </span>
                  <span className="text-[13px] text-[#58A0C6]">
                    {formatPrice(day.plastic)} $
                  </span>
                  <div className="flex items-center justify-center">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#a3a3a3]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#a3a3a3]" />
                    )}
                  </div>
                </ListRow>

                {/* Expanded orders */}
                {isExpanded && day.orders && day.orders.length > 0 && (
                  <div className="flex flex-col gap-[2px] ml-[12px]">
                    {day.orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-[#f5f7f9] rounded-sm px-[12px] py-[10px]"
                        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px", alignItems: "center" }}
                      >
                        <span className="text-[12px] text-[#a3a3a3]">
                          {format(new Date(order.date), "HH:mm")}
                        </span>
                        <span className="text-[12px] text-[#a3a3a3]">{order.x || 1}</span>
                        <span className="text-[12px] text-[#a3a3a3]">{order.kv} m²</span>
                        <span className="text-[12px] text-[#1a1a1a]">
                          {order.collection || "—"}
                          {order.size && <span className="text-[#a3a3a3] ml-1">· {order.size}</span>}
                        </span>
                        <span className="text-[12px] font-medium text-[#47B13C]">
                          {formatPrice(order.price)} $
                        </span>
                        <span className="text-[12px] text-[#FF6600]">
                          {order.discount > 0 ? `${formatPrice(order.discount)} $` : "—"}
                        </span>
                        <span className="text-[12px] text-[#58A0C6]">
                          {order.plastic > 0 ? `${formatPrice(order.plastic)} $` : "—"}
                        </span>
                        <span></span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* JAMI footer */}
        {!isLoading && days.length > 0 && (
          <div
            className="bg-white rounded-sm px-[12px] py-[14px] mt-[4px] shrink-0"
            style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px", alignItems: "center" }}
          >
            <span className="text-[13px] font-bold text-[#1a1a1a]">JAMI</span>
            <span className="text-[13px] font-bold text-[#1a1a1a]">{totals?.count}</span>
            <span className="text-[13px] font-bold text-[#1a1a1a]">{totals?.kv} m²</span>
            <span></span>
            <span className="text-[13px] font-bold text-[#47B13C]">{formatPrice(totals?.earn || 0)} $</span>
            <span className="text-[13px] font-bold text-[#FF6600]">{formatPrice(totals?.discount || 0)} $</span>
            <span className="text-[13px] font-bold text-[#58A0C6]">{formatPrice(totals?.plastic || 0)} $</span>
            <span></span>
          </div>
        )}
      </div>
    </div>
  );
}
