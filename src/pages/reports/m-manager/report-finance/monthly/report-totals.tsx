import { useMeStore } from "@/store/me-store";
import { TKassareportData } from "../type";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

interface ReportTotalsProps {
  data?: TKassareportData;
  filteredTotals?: any;
  hasActiveFilter?: boolean;
  onGreenCardClick?: () => void;
}

const metricCards = [
  { key: "totalSale", label: "Umumiy sotuv", color: "border-blue-500 bg-blue-50" },
  { key: "debt_sum", label: "Qarz savdosi", color: "" },
  { key: "totalPlasticSum", label: "Terminal", color: "" },
  { key: "totalSaleReturn", label: "Qaytarilgan", color: "border-orange-400 text-orange-600", negative: true },
  { key: "totalCashCollection", label: "Inkasatsiya", color: "" },
  { key: "totalSize", label: "Sotuv hajmi m²", color: "", suffix: " m²" },
  { key: "additionalProfitTotalSum", label: "Navar foydasi", color: "" },
  { key: "totalDiscount", label: "Chegirma", color: "border-orange-400 bg-orange-50 text-orange-600", negative: true },
];

const filteredTotalsMap: Record<string, string> = {
  totalSale: "totalPrice",
  debt_sum: "totalDebtSum",
  totalPlasticSum: "plasticSum",
  totalSaleReturn: "totalReturnSale",
  totalCashCollection: "totalCashCollection",
  totalSize: "kv",
  additionalProfitTotalSum: "totalAdditionalProfit",
  totalDiscount: "totalDiscount",
};

export default function ReportTotals({ data, filteredTotals, hasActiveFilter, onGreenCardClick }: ReportTotalsProps) {
  const { meUser } = useMeStore();
  const role = meUser?.position?.role;

  // Role-based yashil card
  let mainSum = 0;
  let prixod = hasActiveFilter ? (filteredTotals?.totalIncome || 0) : (data?.totalIncome || 0);
  let rasxod = hasActiveFilter ? (filteredTotals?.totalExpense || 0) : (data?.totalExpense || 0);
  let saldo = 0;

  if (role === 9) {
    mainSum = data?.managerSum || 0;
    saldo = data?.managerSaldo || 0;
  } else if (role === 10) {
    mainSum = data?.accountantSum || data?.accauntantSum || 0;
    saldo = data?.accountantSaldo || 0;
  } else {
    mainSum = data?.totalSale || 0;
  }

  return (
    <div className="px-4 mb-4">
      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Yashil card */}
        <div
          className="bg-[#89A143] text-white rounded-xl p-5 min-w-[260px] cursor-pointer hover:bg-[#7a9138] transition-colors"
          onClick={onGreenCardClick}
        >
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm opacity-80">Umumiy summa</span>
          </div>
          <p className="text-3xl font-bold mb-4">
            {mainSum.toLocaleString("uz-UZ", { minimumFractionDigits: 2 })} $
          </p>
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <ArrowDown className="w-4 h-4" />
              <span>Prixod: {prixod.toLocaleString()} $</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              <span>Rasxod: {rasxod.toLocaleString()} $</span>
            </div>
          </div>
          <div className="mt-2 text-sm opacity-80">
            Saldo balans: {saldo.toLocaleString()} $
          </div>
        </div>

        {/* 8 ta metrika card — 2x4 grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
          {metricCards.map((card) => {
            const filteredKey = filteredTotalsMap[card.key];
            const value = (hasActiveFilter && filteredTotals && filteredKey)
              ? (filteredTotals[filteredKey] || 0)
              : ((data as any)?.[card.key] || 0);
            const displayValue = card.negative ? `-${Math.abs(value).toLocaleString()}` : value.toLocaleString();
            return (
              <div
                key={card.key}
                className={`border rounded-xl p-3 text-center ${card.color || "border-border"}`}
              >
                <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                <p className="text-lg font-semibold">
                  {displayValue}{card.suffix || " $"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
