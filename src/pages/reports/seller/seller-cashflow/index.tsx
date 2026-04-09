import { useState } from "react";
import { useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { format, getMonth } from "date-fns";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

import { useYear } from "@/store/year-store";
import formatPrice from "@/utils/formatPrice";
import { MonthsArray } from "@/consts";
import TebleAvatar from "@/components/teble-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSellerDailyReport } from "./queries";

export default function PageSellerCashFlow() {
  const { id } = useParams();
  const { year } = useYear();
  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault(String(getMonth(new Date()) + 1))
  );
  const [userName] = useQueryState("userName", parseAsString.withDefault(""));
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const { data, isLoading } = useSellerDailyReport(id, year, Number(month));

  const totals = data?.totals;
  const plan = data?.plan;
  const seller = data?.seller;
  const days = data?.days || [];

  const stats = [
    { label: "Sotuv", value: `${formatPrice(totals?.earn || 0)}$`, color: "text-[#89A143]" },
    { label: "Soni", value: `${totals?.count || 0} sht` },
    { label: "Hajm", value: `${totals?.kv || 0} m²` },
    { label: "Skidka", value: `${formatPrice(totals?.discount || 0)}$`, color: "text-[#E38157]" },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-muted rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          {seller?.avatar && (
            <TebleAvatar
              status="none"
              name={seller.firstName}
              url={seller.avatar.path}
              size={40}
            />
          )}
          <div>
            <p className="text-[18px] font-semibold">
              {seller?.firstName || userName?.split(" ")[0]} {seller?.lastName || userName?.split(" ")[1]}
            </p>
          </div>
        </div>

        <div className="ml-auto">
          <Select value={month || ""} onValueChange={(v) => setMonth(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Oy tanlang" />
            </SelectTrigger>
            <SelectContent>
              {MonthsArray.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-4">
            <p className="text-[12px] text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-[18px] font-bold ${s.color || ""}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Planka progress */}
      {(plan?.planPrice ?? 0) > 0 && (
        <div className="bg-card rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[14px] text-muted-foreground">
              Planka: <span className="font-semibold text-foreground">{formatPrice(plan?.planPrice || 0)}$</span>
            </p>
            <p className={`text-[14px] font-bold ${(plan?.progress || 0) >= 100 ? "text-[#89A143]" : "text-[#E38157]"}`}>
              {plan?.progress || 0}%
            </p>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${(plan?.progress || 0) >= 100 ? "bg-[#89A143]" : "bg-[#E38157]"}`}
              style={{ width: `${Math.min(plan?.progress || 0, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[12px] text-muted-foreground">
              {formatPrice(totals?.earn || 0)}$ / {formatPrice(plan?.planPrice || 0)}$
            </p>
          </div>
        </div>
      )}

      {/* Daily table */}
      <div className="bg-card rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b text-[12px] font-medium text-muted-foreground bg-muted/30">
          <span className="w-[110px]">Kun</span>
          <span className="w-[90px] text-center">Soni</span>
          <span className="w-[110px] text-center">Hajm</span>
          <span className="flex-1 text-right pr-4">Sotuv</span>
          <span className="w-[130px] text-right pr-4">Skidka</span>
          <span className="w-[130px] text-right pr-4">Terminal</span>
          <span className="w-[24px]"></span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Yuklanmoqda...
          </div>
        ) : days.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Ma'lumot topilmadi
          </div>
        ) : (
          <>
            {days.map((day) => {
              const isExpanded = expandedDate === day.date;
              return (
                <div key={day.date}>
                  {/* Kun qatori */}
                  <div
                    className="flex items-center px-4 py-3 border-b text-[14px] cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedDate(isExpanded ? null : day.date)}
                  >
                    <span className="w-[110px]">{format(new Date(day.date), "dd.MM.yyyy")}</span>
                    <span className="w-[90px] text-center">{day.count}</span>
                    <span className="w-[110px] text-center">{day.kv} m²</span>
                    <span className="flex-1 text-right pr-4 text-[#89A143] font-semibold">
                      {formatPrice(day.earn)}$
                    </span>
                    <span className="w-[130px] text-right pr-4 text-[#E38157]">
                      {formatPrice(day.discount)}$
                    </span>
                    <span className="w-[130px] text-right pr-4 text-[#58A0C6]">
                      {formatPrice(day.plastic)}$
                    </span>
                    <span className="w-[24px] flex justify-end">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </span>
                  </div>

                  {/* Orderlar (ochilsa) */}
                  {isExpanded && day.orders && day.orders.length > 0 && (
                    <div className="bg-muted/20 border-b">
                      <div className="flex items-center px-4 py-2 text-[11px] font-medium text-muted-foreground border-b border-border/50">
                        <span className="w-[80px]">Vaqt</span>
                        <span className="flex-1">Mahsulot</span>
                        <span className="w-[60px] text-center">Hajm</span>
                        <span className="w-[110px] text-right pr-4">Sotuv</span>
                        <span className="w-[110px] text-right pr-4">Skidka</span>
                        <span className="w-[110px] text-right pr-4">Terminal</span>
                        <span className="w-[24px]"></span>
                      </div>
                      {day.orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center px-4 py-2.5 text-[13px] border-b border-border/30 last:border-b-0"
                        >
                          <span className="w-[80px] text-muted-foreground">
                            {format(new Date(order.date), "HH:mm")}
                          </span>
                          <span className="flex-1 flex flex-wrap items-center gap-1">
                            {order.collection && (
                              <span className="font-medium">{order.collection}</span>
                            )}
                            {order.size && (
                              <span className="text-muted-foreground">
                                · {order.size}
                              </span>
                            )}
                            {order.color && (
                              <span className="text-muted-foreground">
                                · {order.color}
                              </span>
                            )}
                            {order.shape && (
                              <span className="text-muted-foreground">
                                · {order.shape}
                              </span>
                            )}
                          </span>
                          <span className="w-[60px] text-center text-muted-foreground">
                            {order.kv} m²
                          </span>
                          <span className="w-[110px] text-right pr-4 text-[#89A143] font-medium">
                            {formatPrice(order.price)}$
                          </span>
                          <span className="w-[110px] text-right pr-4 text-[#E38157]">
                            {order.discountSum > 0
                              ? `${formatPrice(order.discountSum)}$`
                              : "-"}
                          </span>
                          <span className="w-[110px] text-right pr-4 text-[#58A0C6]">
                            {order.plasticSum > 0
                              ? `${formatPrice(order.plasticSum)}$`
                              : "-"}
                          </span>
                          <span className="w-[24px]"></span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* JAMI */}
            <div className="flex items-center px-4 py-3 bg-muted/50 text-[14px] font-semibold">
              <span className="w-[110px]">JAMI</span>
              <span className="w-[90px] text-center">{totals?.count}</span>
              <span className="w-[110px] text-center">{totals?.kv} m²</span>
              <span className="flex-1 text-right pr-4 text-[#89A143]">
                {formatPrice(totals?.earn || 0)}$
              </span>
              <span className="w-[130px] text-right pr-4 text-[#E38157]">
                {formatPrice(totals?.discount || 0)}$
              </span>
              <span className="w-[130px] text-right pr-4 text-[#58A0C6]">
                {formatPrice(totals?.plastic || 0)}$
              </span>
              <span className="w-[24px]"></span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
