import { useNavigate } from "react-router-dom";
import { Network, Tag } from "lucide-react";
import formatPrice from "@/utils/formatPrice";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

interface Props {
  data?: any;
  isLoading?: boolean;
  filialName?: string;
  month: number;
  year: number;
  filialId?: string | null;
}

export default function CurrentMonthCard({ data, isLoading, filialName, month, year, filialId }: Props) {
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);

  const totals = data?.totals || {};
  const order = data?.order || {};
  const boss = data?.boss || {};
  const manager = data?.manager || {};
  const accountant = data?.accountant || {};

  const isDefaultMonth = month === new Date().getMonth() + 1 && year === new Date().getFullYear();
  let title = "Joriy oy";
  if (filialId) {
    title = `${MONTHS[month - 1]}${filialName ? " " + filialName : ""}`;
  } else if (!isDefaultMonth) {
    title = MONTHS[month - 1];
  }

  const managerIncome = Number(manager.income || 0);
  const managerExpense = Number(manager.expense || 0);
  const managerBalance = Math.max(0, managerIncome - managerExpense);
  const managerPct = managerIncome > 0 ? Math.min(100, (managerBalance / managerIncome) * 100) : 0;

  const accountantIncome = Number(accountant.income || 0);
  const accountantExpense = Number(accountant.expense || 0);
  const accountantBalance = Math.max(0, accountantIncome - accountantExpense);
  const accountantPct = accountantIncome > 0 ? Math.min(100, (accountantBalance / accountantIncome) * 100) : 0;

  const params = new URLSearchParams();
  if (month) params.set("month", String(month));
  if (year) params.set("year", String(year));
  if (filialId) params.set("filialId", filialId);
  const generalReportUrl = `/m-manager/reports-hub/general?${params.toString()}`;

  const goGeneral = () => {
    push("Umumiy Hisobot", generalReportUrl);
    navigate(generalReportUrl);
  };

  return (
    <div className="flex flex-col gap-[8px] w-full">
      {/* "Joriy oy" wide card */}
      <button
        onClick={goGeneral}
        className="bg-white h-[62px] rounded-[8px] flex items-center justify-between px-[14px] hover:shadow-sm transition cursor-pointer w-full"
      >
        <span className="text-[17px] text-[#1a1a1a] font-normal truncate">{title}</span>
        <div className="flex items-center gap-[16px] shrink-0">
          <span className="text-[17px] text-[#1a1a1a] font-medium opacity-60">
            {isLoading ? "—" : `${formatPrice(Number(totals.total_kv || 0))} m²`}
          </span>
          <span className="text-[17px] text-[#1a1a1a] font-medium">
            {isLoading ? "—" : `${formatPrice(Number(totals.total_sum || 0))} $`}
          </span>
        </div>
      </button>

      {/* 3 stat cards row */}
      <div className="grid grid-cols-3 gap-[8px]">
        <button
          onClick={goGeneral}
          className="bg-white h-[90px] rounded-[8px] relative hover:shadow-sm transition text-left cursor-pointer"
        >
          <Network className="absolute left-[18px] top-[19px] w-[16px] h-[16px] text-[#1a1a1a]" strokeWidth={1.5} />
          <span className="absolute left-[40px] top-[19px] text-[13px] text-black">Foyda</span>
          <span className="absolute left-[18px] top-[52px] text-[17px] text-black">
            {isLoading ? "—" : `${formatPrice(Number(order.total_profit_sum || 0))} $`}
          </span>
        </button>

        <button
          onClick={goGeneral}
          className="bg-white h-[90px] rounded-[8px] relative hover:shadow-sm transition text-left cursor-pointer"
        >
          <Network className="absolute left-[18px] top-[19px] w-[16px] h-[16px] text-[#1a1a1a]" strokeWidth={1.5} />
          <span className="absolute left-[40px] top-[19px] text-[13px] text-black">Xarajat</span>
          <span className="absolute left-[18px] top-[52px] text-[17px] text-black">
            {isLoading ? "—" : `${formatPrice(Number(boss.total_expense || 0))} $`}
          </span>
        </button>

        <button
          onClick={goGeneral}
          className="bg-white h-[90px] rounded-[8px] relative hover:shadow-sm transition text-left cursor-pointer"
        >
          <Tag className="absolute left-[18px] top-[19px] w-[16px] h-[16px] text-[#1a1a1a]" strokeWidth={1.5} />
          <span className="absolute left-[40px] top-[19px] text-[13px] text-black">Qaytgan</span>
          <span className="absolute left-[18px] top-[52px] text-[17px] text-black">
            {isLoading ? "—" : `${formatPrice(Number(order.total_return || 0))} $`}
          </span>
        </button>
      </div>

      {/* Title label */}
      <p className="text-[15px] font-medium text-[#1a1a1a] mt-[10px]">Title</p>

      {/* Manager kassasi */}
      <button
        onClick={goGeneral}
        className="bg-white h-[90px] rounded-[8px] relative hover:shadow-sm transition text-left cursor-pointer w-full"
      >
        <span className="absolute left-[14px] top-[11px] text-[13px] text-[#333]">Menejer kassasi</span>
        <div className="absolute left-[14px] top-[40px] right-[14px] h-[4px] bg-[#f3f3f3] rounded-full overflow-hidden">
          <div className="h-full bg-[#ff6527]" style={{ width: `${managerPct}%` }} />
        </div>
        <span className="absolute left-[14px] top-[54px] text-[13px] text-[#1a1a1a] font-medium">
          {isLoading ? "—" : `${formatPrice(managerIncome)} $`}
        </span>
        <span className="absolute right-[14px] top-[54px] text-[13px] text-[#1a1a1a] font-medium">
          {isLoading ? "—" : `${formatPrice(managerBalance)} $`}
        </span>
      </button>

      {/* Hisobchi kassasi */}
      <button
        onClick={goGeneral}
        className="bg-white h-[90px] rounded-[8px] relative hover:shadow-sm transition text-left cursor-pointer w-full"
      >
        <span className="absolute left-[14px] top-[11px] text-[13px] text-[#333]">Hisobchi kassasi</span>
        <div className="absolute left-[14px] top-[40px] right-[14px] h-[4px] bg-[#f3f3f3] rounded-full overflow-hidden">
          <div className="h-full bg-[#2fe8ff]" style={{ width: `${accountantPct}%` }} />
        </div>
        <span className="absolute left-[14px] top-[54px] text-[13px] text-[#1a1a1a] font-medium">
          {isLoading ? "—" : `${formatPrice(accountantIncome)} $`}
        </span>
        <span className="absolute right-[14px] top-[54px] text-[13px] text-[#1a1a1a]">
          {isLoading ? "—" : `${formatPrice(accountantBalance)} $`}
        </span>
      </button>
    </div>
  );
}
