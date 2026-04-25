import { useNavigate } from "react-router-dom";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

interface ReportCardProps {
  title: string;
  positive: string;
  negative: string;
  variant?: "default" | "primary" | "danger";
  navigateTo: string;
  isLoading?: boolean;
}

export default function ReportCard({
  title,
  positive,
  negative,
  variant = "default",
  navigateTo,
  isLoading = false,
}: ReportCardProps) {
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);

  const handleClick = () => {
    if (!navigateTo) return;
    push(title, navigateTo);
    navigate(navigateTo);
  };

  if (variant === "primary") {
    return (
      <button
        onClick={handleClick}
        className="relative w-full h-[160px] rounded-[8px] bg-[#0078d4] text-white overflow-hidden text-left hover:brightness-110 transition cursor-pointer"
      >
        {/* Mini chart background */}
        <svg
          className="absolute right-0 bottom-0 opacity-50"
          width="182"
          height="86"
          viewBox="0 0 182 86"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M0 70 L22 50 L48 60 L74 30 L100 45 L130 18 L160 32 L182 14 L182 86 L0 86 Z"
            fill="rgba(255,255,255,0.15)"
          />
          <path
            d="M0 70 L22 50 L48 60 L74 30 L100 45 L130 18 L160 32 L182 14"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <p className="absolute left-[30px] top-[30px] text-[13px] font-normal">
          {title}
        </p>
        <p className="absolute left-[30px] top-[91px] text-[17px] text-white font-normal">
          {isLoading ? "—" : positive}
        </p>
        <p className="absolute left-[30px] top-[114px] text-[11px] text-[#2fe8ff]">
          {isLoading ? "" : negative}
        </p>
      </button>
    );
  }

  if (variant === "danger") {
    return (
      <button
        onClick={handleClick}
        className="relative w-full h-[160px] rounded-[8px] bg-[#ff6527] text-white overflow-hidden text-left hover:brightness-110 transition cursor-pointer"
      >
        {/* Two white indicator bars */}
        <div className="absolute right-[30px] top-[30px] flex gap-[4px] items-end">
          <div className="w-[8px] h-[80px] bg-white opacity-20" />
          <div className="w-[8px] h-[41px] bg-white" />
        </div>

        <p className="absolute left-[30px] top-[30px] text-[13px] font-normal">
          {title}
        </p>
        <div className="absolute left-[30px] bottom-[24px] flex flex-col gap-[4px]">
          <p className="text-[13px] font-normal">{isLoading ? "—" : positive}</p>
          <p className="text-[17px] font-normal">{isLoading ? "" : negative}</p>
        </div>
      </button>
    );
  }

  // default — white
  return (
    <button
      onClick={handleClick}
      className="relative w-full h-[160px] rounded-[8px] bg-white text-black overflow-hidden text-left hover:shadow-md transition cursor-pointer"
    >
      <p className="absolute left-[30px] top-[30px] text-[13px] font-normal">
        {title}
      </p>
      <div className="absolute left-[30px] bottom-[24px] flex flex-col gap-[4px]">
        <p className="text-[13px] font-normal">{isLoading ? "—" : positive}</p>
        <p className="text-[17px] font-normal">{isLoading ? "" : negative}</p>
      </div>
    </button>
  );
}
