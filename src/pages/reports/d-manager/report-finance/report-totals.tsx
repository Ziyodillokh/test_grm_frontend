import { TrendingUp, TrendingDown } from "lucide-react";
import { TKassareportData } from "./type";

interface ReportTotalsProps {
  data?: TKassareportData;
}

const metricCards: { key: keyof TKassareportData; label: string; suffix?: string; negative?: boolean; valueColor?: string }[] = [
  { key: "totalSale", label: "Umumiy sotuv" },
  { key: "totalSize", label: "Sotuv hajmi", suffix: " m²" },
  { key: "totalDiscount", label: "Chegirma", negative: true, valueColor: "#FF6314" },
  { key: "debt_sum", label: "Yuborilgan" },
  { key: "dealer_frozen_owed", label: "Qarzdorlik qoldig'i" },
];

function CashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.3333 6.00065V4.66732C11.3333 4.3137 11.1929 3.97456 10.9428 3.72451C10.6928 3.47446 10.3536 3.33398 10 3.33398H3.33333C2.97971 3.33398 2.64057 3.47446 2.39052 3.72451C2.14048 3.97456 2 4.3137 2 4.66732V8.66732C2 9.02094 2.14048 9.36008 2.39052 9.61013C2.64057 9.86017 2.97971 10.0007 3.33333 10.0007H4.66667M6 6.00065H12.6667C13.403 6.00065 14 6.5976 14 7.33398V11.334C14 12.0704 13.403 12.6673 12.6667 12.6673H6C5.26362 12.6673 4.66667 12.0704 4.66667 11.334V7.33398C4.66667 6.5976 5.26362 6.00065 6 6.00065ZM10.6667 9.33398C10.6667 10.0704 10.0697 10.6673 9.33333 10.6673C8.59695 10.6673 8 10.0704 8 9.33398C8 8.5976 8.59695 8.00065 9.33333 8.00065C10.0697 8.00065 10.6667 8.5976 10.6667 9.33398Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowsExchangeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.66667 6.66667H14L11.3333 4M11.3333 9.33333H2L4.66667 12" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ReportTotals({ data }: ReportTotalsProps) {
  const mainSum = data?.totalIncome || 0;
  const naqd = data?.in_hand || 0;
  const terminal = data?.totalPlasticSum || 0;

  return (
    <div className="flex gap-[4px] flex-col lg:flex-row">
      {/* Yashil card */}
      <div
        className="bg-[#47B13C] text-white rounded-sm min-w-[260px] w-[25%] shrink-0 relative overflow-hidden flex flex-col justify-between"
        style={{ height: 80, paddingLeft: 20, paddingTop: 10, paddingBottom: 10, paddingRight: 20 }}
      >
        <p className="text-[20px] font-medium leading-tight">
          ${mainSum.toLocaleString("uz-UZ", { minimumFractionDigits: 2 })}
        </p>
        <div className="flex items-center gap-[16px]">
          <span className="text-[15px] font-normal opacity-80 flex items-center gap-[4px]">
            <CashIcon /> ${naqd.toLocaleString()}
          </span>
          <span className="text-[15px] font-normal opacity-80 flex items-center gap-[4px]">
            <ArrowsExchangeIcon /> ${terminal.toLocaleString()}
          </span>
        </div>
        <svg className="absolute right-[8px] bottom-[8px] opacity-70" width="60" height="38" viewBox="0 0 61 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.3" d="M6.72032 23.7873L0.368164 30.6778V40H60.3677V2.64208L55.5589 5.65377C53.8525 6.72247 52.4565 8.22039 51.5105 9.99777C48.9524 14.804 43.3749 17.1583 38.1467 15.6386L35.4451 14.8534C34.0685 14.4533 32.9121 13.5137 32.2385 12.2482C29.9493 7.94705 23.5607 8.73988 22.3922 13.4702L20.8222 19.8261C19.9904 23.1934 16.1106 24.7635 13.1711 22.9226C11.0929 21.621 8.38237 21.9844 6.72032 23.7873Z" fill="url(#paint0_linear_dgreen)"/>
          <path d="M0.368164 30.7143L6.72067 23.8152C8.38208 22.0108 11.0937 21.6472 13.1717 22.9502C16.1099 24.7925 19.99 23.2228 20.8207 19.8558L22.3924 13.4853C23.5599 8.7532 29.9515 7.96069 32.2393 12.2643C32.9124 13.5303 34.0686 14.4705 35.4452 14.8711L38.1372 15.6545C43.37 17.1772 48.9533 14.8199 51.5115 10.0078C52.4568 8.22951 53.8524 6.73052 55.5586 5.66065L60.3677 2.64522" stroke="white"/>
          <defs>
            <linearGradient id="paint0_linear_dgreen" x1="30.3679" y1="0" x2="30.3679" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="white"/>
              <stop offset="1" stopColor="white" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 5 ta oq metrika card */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-[4px] flex-1" style={{ maxHeight: 80 }}>
        {metricCards.map((card) => {
          const value = (data as any)?.[card.key] || 0;
          const displayValue = card.suffix
            ? `${value.toLocaleString()}${card.suffix}`
            : card.negative
              ? `-${Math.abs(value).toLocaleString()}$`
              : `${value.toLocaleString()}$`;
          const isNegative = card.negative || value < 0;
          return (
            <div
              key={card.key}
              className="bg-white rounded-sm flex flex-col gap-[2px]"
              style={{ padding: 10 }}
            >
              <p
                className="text-[15px] font-normal"
                style={card.valueColor ? { color: card.valueColor } : undefined}
              >
                {displayValue}
              </p>
              <div className={`flex items-center gap-1 text-[12px] ${isNegative ? "text-red-500" : "text-green-500"}`}>
                {isNegative
                  ? <TrendingDown className="w-3 h-3" />
                  : <TrendingUp className="w-3 h-3" />
                }
                <span>--%</span>
              </div>
              <p className="text-[13px] text-[#1a1a1a] opacity-60">{card.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
