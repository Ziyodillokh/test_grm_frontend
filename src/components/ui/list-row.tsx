import { cn } from "@/lib/utils";

interface ListRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  gridTemplate?: string;
  gridGap?: string;
  minHeight?: number;
}

export function ListRow({
  children,
  onClick,
  className,
  gridTemplate,
  gridGap = "8px",
  minHeight = 74,
}: ListRowProps) {
  return (
    <div
      className={cn(
        "items-center bg-white rounded-sm shrink-0 transition-colors",
        onClick && "cursor-pointer hover:bg-gray-50",
        gridTemplate ? "px-[12px]" : "px-[24px]",
        className
      )}
      style={{
        minHeight,
        ...(gridTemplate
          ? {
              display: "grid",
              gridTemplateColumns: gridTemplate,
              gap: gridGap,
            }
          : {}),
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
