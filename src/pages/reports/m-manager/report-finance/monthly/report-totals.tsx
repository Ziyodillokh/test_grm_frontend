import { useMeStore } from "@/store/me-store";
import { TKassareportData } from "../type";
import { ArrowDown, ArrowUp, TrendingUp, TrendingDown } from "lucide-react";

interface ReportTotalsProps {
  data?: TKassareportData;
  filteredTotals?: any;
  hasActiveFilter?: boolean;
  onGreenCardClick?: () => void;
}

const metricCards = [
  { key: "totalSale", label: "Umumiy sotuv", isFirst: true },
  { key: "debt_sum", label: "Qarz savdosi" },
  { key: "totalPlasticSum", label: "Terminal" },
  { key: "totalSaleReturn", label: "Qaytarilgan", negative: true },
  { key: "totalCashCollection", label: "Inkasatsiya" },
  { key: "totalSize", label: "Sotuv hajmi m²", suffix: " m²" },
  { key: "additionalProfitTotalSum", label: "Navar foydasi" },
  { key: "totalDiscount", label: "Chegirma", negative: true, valueColor: "#FF6314" },
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
    <div>
      <div className="flex gap-[4px] flex-col lg:flex-row">
        {/* Yashil card */}
        <div
          className="bg-[#47B13C] text-white rounded-[8px] p-5 min-w-[260px] h-[140px] w-[30%] shrink-0 cursor-pointer hover:bg-[#3da032] transition-colors flex flex-col justify-between relative overflow-hidden"
          onClick={onGreenCardClick}
        >
          <p className="text-[28px] font-medium">
            ${mainSum.toLocaleString("uz-UZ", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-[16px] text-[15px]">
            <div className="flex items-center gap-1">
              <ArrowDown className="w-4 h-4" />
              <span>${prixod.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              <span>${rasxod.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-[15px] opacity-50">
            Saldo balans — ${saldo.toLocaleString()}
          </div>
          <svg className="absolute right-[10px] bottom-[20px] opacity-70" width="92" height="60" viewBox="0 0 61 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.3" d="M6.72032 23.7873L0.368164 30.6778V40H60.3677V2.64208L55.5589 5.65377C53.8525 6.72247 52.4565 8.22039 51.5105 9.99777C48.9524 14.804 43.3749 17.1583 38.1467 15.6386L35.4451 14.8534C34.0685 14.4533 32.9121 13.5137 32.2385 12.2482C29.9493 7.94705 23.5607 8.73988 22.3922 13.4702L20.8222 19.8261C19.9904 23.1934 16.1106 24.7635 13.1711 22.9226C11.0929 21.621 8.38237 21.9844 6.72032 23.7873Z" fill="url(#paint0_linear_green)"/>
            <path d="M0.368164 30.7143L6.72067 23.8152C8.38208 22.0108 11.0937 21.6472 13.1717 22.9502C16.1099 24.7925 19.99 23.2228 20.8207 19.8558L22.3924 13.4853C23.5599 8.7532 29.9515 7.96069 32.2393 12.2643C32.9124 13.5303 34.0686 14.4705 35.4452 14.8711L38.1372 15.6545C43.37 17.1772 48.9533 14.8199 51.5115 10.0078C52.4568 8.22951 53.8524 6.73052 55.5586 5.66065L60.3677 2.64522" stroke="white"/>
            <defs>
              <linearGradient id="paint0_linear_green" x1="30.3679" y1="0" x2="30.3679" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 8 ta metrika card — 2x4 grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-2 gap-[4px] flex-1 h-[140px]">
          {metricCards.map((card) => {
            const filteredKey = filteredTotalsMap[card.key];
            const value = (hasActiveFilter && filteredTotals && filteredKey)
              ? (filteredTotals[filteredKey] || 0)
              : ((data as any)?.[card.key] || 0);
            const displayValue = card.negative ? `-${Math.abs(value).toLocaleString()}` : value.toLocaleString();
            const isFirst = (card as any).isFirst;
            const isNegative = card.negative || value < 0;
            return (
              <div
                key={card.key}
                className={`rounded-[8px] p-[10px] flex flex-col justify-between ${isFirst ? "bg-[#0078D4] text-white" : "bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-[17px] font-medium ${isFirst ? "text-white" : ""}`} style={(card as any).valueColor ? { color: (card as any).valueColor } : undefined}>
                    {displayValue}
                  </p>
                  <div className={`flex items-center gap-1 text-[12px] ${isNegative ? "text-red-500" : "text-green-500"}`}>
                    {isNegative
                      ? <TrendingDown className="w-3 h-3" />
                      : <TrendingUp className="w-3 h-3" />
                    }
                    <span>-1.8%</span>
                  </div>
                </div>
                <p className={`text-[13px] ${isFirst ? "text-white/60" : "text-[#1a1a1a] opacity-60"}`}>{card.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
