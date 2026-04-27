import { useNavigate } from "react-router-dom";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

interface ReportCardProps {
  title: string;
  positive: string;
  negative: string;
  variant?: "default" | "primary" | "danger";
  navigateTo: string;
  isLoading?: boolean;
  /** Faqat "danger" variantda — qaytarilgan qarz progressi (0-100) */
  progressPercent?: number;
}

export default function ReportCard({
  title,
  positive,
  negative,
  variant = "default",
  navigateTo,
  isLoading = false,
  progressPercent = 0,
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
        {/* Stack: Moliya → 12px → Savdo → 5px → Foyda */}
        <div className="absolute left-[30px] top-[30px] flex flex-col items-start pointer-events-none">
          <p className="text-[13px] font-normal text-white">{title}</p>
          <p className="mt-[12px] text-[17px] font-normal text-white whitespace-nowrap">
            {isLoading ? "—" : positive}
          </p>
          <p className="mt-[5px] text-[13px] text-[#2fe8ff] whitespace-nowrap">
            {isLoading ? "" : negative}
          </p>
        </div>

        {/* Mini chart — pastki o'ng burchakka taqalgan, yumshoq tl radius */}
        <div className="absolute right-0 bottom-0 w-[150px] h-[70px] rounded-tl-[14px] overflow-hidden opacity-70 pointer-events-none">
          <svg
            width="150"
            height="70"
            viewBox="0 0 150 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0 52 C 18 42, 28 50, 40 38 S 65 24, 80 32 S 108 16, 125 24 S 144 8, 150 10 L 150 70 L 0 70 Z"
              fill="rgba(255,255,255,0.18)"
            />
            <path
              d="M0 52 C 18 42, 28 50, 40 38 S 65 24, 80 32 S 108 16, 125 24 S 144 8, 150 10"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </button>
    );
  }

  if (variant === "danger") {
    const pct = Math.max(0, Math.min(100, Number(progressPercent) || 0));
    return (
      <button
        onClick={handleClick}
        className="relative w-full h-[160px] rounded-[8px] bg-[#ff6527] text-white overflow-hidden text-left hover:brightness-110 transition cursor-pointer"
      >
        {/* Vertikal progress: track (so'lg'in oq) + fill (yorqin oq) — pastki chizig'i Qoldiq qarz matni bilan tekislangan */}
        <div className="absolute right-[30px] bottom-[24px] w-[8px] h-[80px] bg-white/20 overflow-hidden flex flex-col justify-end">
          <div
            className="w-full bg-white"
            style={{ height: `${pct}%` }}
          />
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
