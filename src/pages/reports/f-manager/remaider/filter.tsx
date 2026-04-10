import { Store } from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import { parseAsString, useQueryState } from "nuqs";
import { useMeStore } from "@/store/me-store";
import { useFilialList } from "./queries";

export default function Filters({
  totalCount,
  totalKv,
  totalSum,
  totalProfit,
}: {
  totalCount: number;
  totalKv: number;
  totalSum: number;
  totalProfit: number;
}) {
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;
  const isManager = role >= 9; // M_MANAGER=9, BOSS=12

  const [date, setDate] = useQueryState("date", parseAsString.withDefault(""));

  const { data: filialData } = useFilialList({ enabled: isManager });
  const filialOptions =
    filialData?.pages?.[0]?.items?.map((e: any) => ({
      label: e?.name || e?.title,
      value: e?.id,
    })) || [];

  return (
    <div className="h-[64px] items-center flex gap-2 mb-2">
      <div className="text-nowrap p-5 flex gap-4 items-center h-full mr-auto bg-card rounded-xl">
        <p className="text-[14px] text-foreground">{totalCount} шт</p>
        <p className="text-[14px] text-foreground">{totalKv?.toFixed(2)} м²</p>
        <p className="text-[14px] text-foreground">{totalSum?.toFixed(2)} $</p>
        <p className="text-[14px] text-foreground font-semibold">
          {totalProfit?.toFixed(2)} $ foyda
        </p>
      </div>

      {isManager && (
        <FilterSelect
          placeholder="Barcha filiallar"
          className="w-[200px] pl-2 h-[62px]"
          options={[{ value: "clear", label: "Barchasi" }, ...filialOptions]}
          name="filialId"
          icons={<Store />}
        />
      )}

      <input
        type="date"
        value={date || ""}
        onChange={(e) => setDate(e.target.value || null)}
        className="h-[62px] px-3 rounded-xl bg-card border border-border text-foreground text-[14px]"
      />
    </div>
  );
}
