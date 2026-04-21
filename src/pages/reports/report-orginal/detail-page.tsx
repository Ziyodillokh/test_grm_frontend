import { useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { getMonth } from "date-fns";
import { Loader } from "lucide-react";

import { ListRow } from "@/components/ui/list-row";
import { CashflowRow, cashflowGridTemplate, cashflowLabels } from "@/components/cashflow-row";
import ReportToolbar from "@/components/report-toolbar";
import { useYear } from "@/store/year-store";
import { useMeStore } from "@/store/me-store";
import formatPrice from "@/utils/formatPrice";

import { useReportDetail } from "./queries";

const TITLES: Record<string, string> = {
  naqd_kassa: "Naqd kassa",
  terminal: "Terminal va o'tkazma",
  inkassatsiya: "Inkassatsiya",
  dealer_cash: "Diller naqd",
  dealer_terminal: "Diller o'tkazma",
  kelgan_qarz: "Kelgan qarzlar",
  opening_balance: "Oydan o'tgan pul",
  boss_income: "Bossdan kirim",
  kent_income: "Kentdan kirim",
  extra_income: "Boshqa kirimlar",
  business_expense: "Biznes xarajatlari",
  boss_expense: "Bossdan chiqim",
  kent_expense: "Kentga chiqim",
  factory: "Taminotchiga to'lov",
  logistics: "Logistika xarajatlari",
  tamojniy: "Bojxona xarajatlari",
  navar_expense: "Ustama(navar)dan xarajat",
  return_orders: "Qaytgan tovarlar",
};

const filialGridTemplate = "40px 1fr 130px";

export default function ReportDetailPage() {
  const { type } = useParams<{ type: string }>();
  const { meUser } = useMeStore();
  const { year } = useYear();
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(String(getMonth(new Date()) + 1))
  );
  const [filial] = useQueryState("filial");
  const [tip] = useQueryState("tip", parseAsString);

  const isFManager = meUser?.position?.role == 4;
  const detailFilialId = isFManager
    ? meUser?.filial?.id
    : filial && filial !== "#dealers"
      ? filial
      : undefined;

  const { data, isLoading } = useReportDetail(
    {
      type: type || "",
      month: +month || undefined,
      year,
      filialId: detailFilialId,
      tip: tip || undefined,
    },
    !!type
  );

  const items = data?.items || [];
  const title = TITLES[type || ""] || type || "";

  const isTerminalType = type === "terminal";
  const isInkassatsiya = type === "inkassatsiya";
  const isFilialList = isTerminalType || isInkassatsiya;

  const totalSum = items.reduce((acc: number, item: any) => {
    return acc + Number(item.price || item.plasticSum || 0);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar
        beforeIcons={
          <div className="flex items-center bg-white rounded-sm px-[12px] h-[42px]">
            <span className="text-[14px] font-medium text-[#1a1a1a]">
              {title}
            </span>
          </div>
        }
        totalsItems={[
          { label: "Jami:", value: totalSum, color: "#1a1a1a" },
        ]}
      />

      {/* Column labels */}
      {!isFilialList && (
        <div
          className="mb-[10px] shrink-0 px-[12px]"
          style={{ display: "grid", gridTemplateColumns: cashflowGridTemplate, gap: "16px" }}
        >
          {cashflowLabels.map((label, i) => (
            <span
              key={i}
              className={`text-[13px] text-[#A3A3A3] ${label.right ? "text-right" : ""} ${label.center ? "text-center" : ""}`}
            >
              {label.text}
            </span>
          ))}
        </div>
      )}

      {isFilialList && (
        <div
          className="mb-[10px] shrink-0 px-[12px]"
          style={{ display: "grid", gridTemplateColumns: filialGridTemplate, gap: "8px" }}
        >
          <span className="text-[13px] text-[#A3A3A3]">#</span>
          <span className="text-[13px] text-[#A3A3A3]">Filial</span>
          <span className="text-[13px] text-[#A3A3A3] text-right">Summa</span>
        </div>
      )}

      {/* List */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <span className="text-[13px] text-[#a3a3a3]">Ma'lumot topilmadi</span>
          </div>
        ) : isFilialList ? (
          items.map((item: any, i: number) => (
            <ListRow
              key={item.filialId || item.id || i}
              gridTemplate={filialGridTemplate}
              minHeight={52}
            >
              <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">
                {item.filialTitle}
              </span>
              <span className="text-[13px] font-medium text-[#1a1a1a] text-right">
                {formatPrice(Number(item.plasticSum || item.price || 0))} $
              </span>
            </ListRow>
          ))
        ) : (
          items.map((item: any, i: number) => (
            <CashflowRow key={item.id || i} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
