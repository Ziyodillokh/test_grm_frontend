import * as React from "react";
import { Button } from "@/components/ui/button"; // shadcn button
import { cn } from "@/lib/utils"; // your usual shadcn cn helper

type Mode = "light" | "dark";

export function ThemeSwitcherDock({
  className,
  defaultMode = "light",
  onChange,
}: {
  className?: string;
  defaultMode?: Mode;
  onChange?: (mode: Mode) => void;
}) {
  const [mode, setMode] = React.useState<Mode>(defaultMode);

  const items: Array<{ key: Mode; label: string; icon: React.ReactNode }> = [
    {
      key: "light",
      label: "Light",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ),
    },
    {
      key: "dark",
      label: "Dark",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
  ];

  const activeIndex = items.findIndex((i) => i.key === mode);

  function setActive(next: Mode) {
    setMode(next);
    onChange?.(next);
  }

  return (
      <div
        className={cn(
          "relative flex flex-col items-center gap-2 mt-2 p-2",
          "rounded-2xl  bg-card backdrop-blur shadow-lg",
          className
        )}
      >
        <div
          className={cn(
            "absolute left-2 right-2 h-12 rounded-xl bg-[#F5F5F5]",
            "transition-transform duration-300 ease-out"
          )}
          style={{
            transform: `translateY(${activeIndex * 56}px)`,
          }}
        />

        {items.map((item) => {
          const selected = item.key === mode;
          return (
            <Button
              key={item.key}
              size="icon"
              onClick={() => setActive(item.key)}
              className={cn(
                "relative z-10 h-12 w-12 rounded-xl bg-white hover:bg-white border-0  border-none",
                "transition-all duration-200",
                selected
                  ? "text-foreground bg-[#F5F5F5]"
                  : "text-muted-foreground hover:text-foreground " 
              )}
            >
              <span
                className={cn(
                  "grid place-items-center transition-transform duration-200",
                  selected ? "scale-105" : "scale-100"
                )}
              >
                {item.icon}
              </span>

              {selected && (
                <span className="absolute inset-0 rounded-xl ring-1 ring-foreground/10" />
              )}
            </Button>
          );
        })}
      </div>
  );
}
