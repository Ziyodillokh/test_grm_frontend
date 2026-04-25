import { useNavigate } from "react-router-dom";
import { Network, Tag } from "lucide-react";
import formatPrice from "@/utils/formatPrice";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { useYear } from "@/store/year-store";

const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

interface Props {
  /** Umumiy Hisobot data (monthly/v2) — turnover/profit/business_expense/return_orders */
  data?: any;
  /** Manager/Accountant kassa data (current-month) — manager.income/expense */
  kassaData?: any;
  isLoading?: boolean;
  filialName?: string;
  month: number;
  year: number;
  filial?: string | null;
}

export default function CurrentMonthCard({
  data,
  kassaData,
  isLoading,
  filialName,
  month,
  year,
  filial,
}: Props) {
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);
  const setYear = useYear((s) => s.setYear);

  // monthly/v2 fields
  const turnover = data?.turnover || {};
  const profit = data?.profit || {};
  const businessExpense = data?.business_expense || {};
  const returnOrders = data?.return_orders || {};

  // Manager/Accountant kassa (eski endpoint)
  const manager = kassaData?.manager || {};
  const accountant = kassaData?.accountant || {};

  // Title — "Joriy oy" / "Yanvar" / "Yanvar Getter"
  const isDefaultMonth = month === new Date().getMonth() + 1 && year === new Date().getFullYear();
  let title = "Joriy oy";
  if (filial) {
    title = `${MONTHS[month - 1]}${filialName ? " " + filialName : ""}`;
  } else if (!isDefaultMonth) {
    title = MONTHS[month - 1];
  }

  // Kassa progress: prixod = 100%, rasxod foizi qizil rang bilan to'ladi
  const managerIncome = Number(manager.income || 0);
  const managerExpense = Number(manager.expense || 0);
  const managerPct = managerIncome > 0 ? Math.min(100, (managerExpense / managerIncome) * 100) : 0;

  const accountantIncome = Number(accountant.income || 0);
  const accountantExpense = Number(accountant.expense || 0);
  const accountantPct = accountantIncome > 0 ? Math.min(100, (accountantExpense / accountantIncome) * 100) : 0;

  // Navigatsiya — Umumiy Hisobot URL params:
  //  - month: number string
  //  - filial: id (Umumiy Hisobot expects 'filial', not 'filialId')
  //  - year: Zustand store (set qilinadi navigatsiya oldidan)
  const goGeneral = () => {
    setYear(year);
    const params = new URLSearchParams();
    if (month) params.set("month", String(month));
    if (filial) params.set("filial", filial);
    const path = `/m-manager/reports-hub/general${params.toString() ? "?" + params.toString() : ""}`;
    push("Umumiy Hisobot", path);
    navigate(path);
  };

  const goCashflow = (role: "manager" | "accountant") => {
    setYear(year);
    const params = new URLSearchParams();
    if (month) params.set("month", String(month));
    const slug = role === "manager" ? "manager-cashflow" : "accountant-cashflow";
    const path = `/boss/dashboard/${slug}${params.toString() ? "?" + params.toString() : ""}`;
    push(role === "manager" ? "Menejer Kassa" : "Hisobchi Kassa", path);
    navigate(path);
  };

  return (
    <div className="flex flex-col gap-[8px] w-full">
      {/* Joriy oy card — bosiladi */}
      <button
        onClick={goGeneral}
        className="bg-white h-[62px] rounded-[8px] flex items-center justify-between px-[14px] hover:shadow-sm transition cursor-pointer w-full"
      >
        <span className="text-[17px] text-[#1a1a1a] font-normal truncate">{title}</span>
        <div className="flex items-center gap-[16px] shrink-0">
          <span className="text-[17px] text-[#1a1a1a] font-medium opacity-60">
            {isLoading ? "—" : `${formatPrice(Number(turnover.kv || 0))} m²`}
          </span>
          <span className="text-[17px] text-[#1a1a1a] font-medium">
            {isLoading ? "—" : `${formatPrice(Number(turnover.price || 0))} $`}
          </span>
        </div>
      </button>

      {/* 3 stat cards — bosilmaydi (faqat ko'rsatkich) */}
      <div className="grid grid-cols-3 gap-[8px]">
        <div className="bg-white h-[90px] rounded-[8px] relative">
          <Network className="absolute left-[18px] top-[19px] w-[16px] h-[16px] text-[#1a1a1a]" strokeWidth={1.5} />
          <span className="absolute left-[40px] top-[19px] text-[13px] text-black">Foyda</span>
          <span className="absolute left-[18px] top-[52px] text-[17px] text-black">
            {isLoading ? "—" : `${formatPrice(Number(profit.price || 0))} $`}
          </span>
        </div>

        <div className="bg-white h-[90px] rounded-[8px] relative">
          <Network className="absolute left-[18px] top-[19px] w-[16px] h-[16px] text-[#1a1a1a]" strokeWidth={1.5} />
          <span className="absolute left-[40px] top-[19px] text-[13px] text-black">Xarajat</span>
          <span className="absolute left-[18px] top-[52px] text-[17px] text-black">
            {isLoading ? "—" : `${formatPrice(Number(businessExpense.price || 0))} $`}
          </span>
        </div>

        <div className="bg-white h-[90px] rounded-[8px] relative">
          <Tag className="absolute left-[18px] top-[19px] w-[16px] h-[16px] text-[#1a1a1a]" strokeWidth={1.5} />
          <span className="absolute left-[40px] top-[19px] text-[13px] text-black">Qaytgan</span>
          <span className="absolute left-[18px] top-[52px] text-[17px] text-black">
            {isLoading ? "—" : `${formatPrice(Number(returnOrders.price || 0))} $`}
          </span>
        </div>
      </div>

      {/* Title label */}
      <p className="text-[15px] font-medium text-[#1a1a1a] mt-[10px]">Title</p>

      {/* Manager kassasi — bosilsa Boss cashflow sahifasi */}
      <button
        onClick={() => goCashflow("manager")}
        className="bg-white h-[90px] rounded-[8px] relative w-full text-left hover:shadow-sm transition cursor-pointer"
      >
        <span className="absolute left-[14px] top-[11px] text-[13px] text-[#333]">Menejer kassasi</span>
        <div className="absolute left-[14px] top-[40px] right-[14px] h-[4px] bg-[#f5f7f9] rounded-full overflow-hidden">
          <div className="h-full bg-[#ff6527]" style={{ width: `${managerPct}%` }} />
        </div>
        <span className="absolute left-[14px] top-[54px] text-[13px] text-[#1a1a1a] font-medium">
          {isLoading ? "—" : `${formatPrice(managerExpense)} $`}
        </span>
        <span className="absolute right-[14px] top-[54px] text-[13px] text-[#1a1a1a] font-medium">
          {isLoading ? "—" : `${formatPrice(managerIncome)} $`}
        </span>
      </button>

      {/* Hisobchi kassasi — bosilsa Boss cashflow sahifasi */}
      <button
        onClick={() => goCashflow("accountant")}
        className="bg-white h-[90px] rounded-[8px] relative w-full text-left hover:shadow-sm transition cursor-pointer"
      >
        <span className="absolute left-[14px] top-[11px] text-[13px] text-[#333]">Hisobchi kassasi</span>
        <div className="absolute left-[14px] top-[40px] right-[14px] h-[4px] bg-[#f5f7f9] rounded-full overflow-hidden">
          <div className="h-full bg-[#2fe8ff]" style={{ width: `${accountantPct}%` }} />
        </div>
        <span className="absolute left-[14px] top-[54px] text-[13px] text-[#1a1a1a] font-medium">
          {isLoading ? "—" : `${formatPrice(accountantExpense)} $`}
        </span>
        <span className="absolute right-[14px] top-[54px] text-[13px] text-[#1a1a1a] font-medium">
          {isLoading ? "—" : `${formatPrice(accountantIncome)} $`}
        </span>
      </button>
    </div>
  );
}
