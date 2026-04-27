interface Tab<V extends string> {
  value: V;
  label: string;
}

interface TabsPillProps<V extends string> {
  tabs: Tab<V>[];
  value: V;
  onChange: (value: V) => void;
  className?: string;
}

/**
 * Pill-style segmented tabs.
 *
 * Spec:
 * - Container: h-42, bg #E7EBF0, padding 3px har tomondan
 * - Active tab: bg-white, text 13px medium ko'k (#0078d4), text doim o'rtada
 * - Inactive tab: container bg'ini meros qiladi (transparent)
 * - Tab min-width: 100px, max-width: text + 20px L/R padding
 *
 * Misol:
 *   <TabsPill
 *     tabs={[{ value: "in", label: "Kiruvchi" }, { value: "out", label: "Chiquvchi" }]}
 *     value={tab}
 *     onChange={setTab}
 *   />
 */
export function TabsPill<V extends string>({
  tabs,
  value,
  onChange,
  className,
}: TabsPillProps<V>) {
  return (
    <div
      className={`h-[40px] p-[3px] bg-[#E7EBF0] rounded-[6px] inline-flex items-center gap-[2px] ${className || ""}`}
    >
      {tabs.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`h-full min-w-[100px] px-[20px] flex items-center justify-center text-[13px] font-medium rounded-[4px] transition-colors whitespace-nowrap ${
              active ? "bg-white text-[#0078d4]" : "bg-transparent text-[#1a1a1a] hover:text-[#0078d4]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
