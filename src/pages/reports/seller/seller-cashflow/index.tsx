import { useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { getMonth } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
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
import { SellerDailyColumns } from "./columns";

export default function PageSellerCashFlow() {
  const { id } = useParams();
  const { year } = useYear();
  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault(String(getMonth(new Date()) + 1))
  );
  const [userName] = useQueryState("userName", parseAsString.withDefault(""));

  const { data, isLoading } = useSellerDailyReport(
    id,
    year,
    Number(month)
  );

  const totals = data?.totals;
  const plan = data?.plan;
  const seller = data?.seller;
  const days = data?.days || [];

  const stats = [
    { label: "Sotuv", value: `${formatPrice(totals?.earn || 0)}$`, color: "text-[#89A143]" },
    { label: "Soni", value: `${totals?.count || 0} sht` },
    { label: "Hajm", value: `${totals?.kv || 0} m²` },
    { label: "Skidka", value: `${formatPrice(totals?.discount || 0)}$`, color: "text-[#E38157]" },
    { label: "Terminal", value: `${formatPrice(totals?.plastic || 0)}$`, color: "text-[#58A0C6]" },
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
      <div className="grid grid-cols-5 gap-3 mb-4">
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
        <DataTable
          columns={SellerDailyColumns}
          data={days}
          isLoading={isLoading}
        />
        {/* Totals row */}
        {days.length > 0 && (
          <div className="flex items-center border-t px-4 py-3 bg-muted/50 text-[14px] font-semibold">
            <span className="min-w-[100px]">JAMI</span>
            <span className="min-w-[80px]">{totals?.count}</span>
            <span className="min-w-[100px]">{totals?.kv} m²</span>
            <span className="min-w-[120px] text-[#89A143]">{formatPrice(totals?.earn || 0)}$</span>
            <span className="min-w-[120px] text-[#E38157]">{formatPrice(totals?.discount || 0)}$</span>
            <span className="min-w-[120px] text-[#58A0C6]">{formatPrice(totals?.plastic || 0)}$</span>
          </div>
        )}
      </div>
    </div>
  );
}
