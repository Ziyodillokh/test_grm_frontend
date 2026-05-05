import { parseAsString, useQueryState } from "nuqs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, Plus, Loader } from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MonthsArray } from "@/consts";
import ReportToolbar from "@/components/report-toolbar";
import { PatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { FactoryReportTotals } from "./type";
import { useFactoryNotReportEnabled } from "./queries";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

export default function FactoryFilter({
  totals,
}: {
  totals?: FactoryReportTotals;
}) {
  const currentYear = String(new Date().getFullYear());
  const currentMonth = String(new Date().getMonth() + 1);
  const [yearFilter, setYearFilter] = useQueryState("year", parseAsString.withDefault(currentYear));
  const [month, setMonth] = useQueryState("month", parseAsString.withDefault(currentMonth));

  const hasActiveFilter = yearFilter !== currentYear || month !== currentMonth;
  const clearFilters = () => {
    setYearFilter(null);
    setMonth(null);
  };

  const queryClient = useQueryClient();
  const { data: notEnabled } = useFactoryNotReportEnabled();
  const factoryOptions = (notEnabled || []).map((f) => ({ label: f.title, value: f.id }));

  const { mutate: enableFactory, isPending } = useMutation({
    mutationFn: (factoryId: string) => PatchData(`/factory/${factoryId}/toggle-report`, {}),
    onSuccess: () => {
      toast.success("Zavod hisobotga qo'shildi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.factoryNotReportEnabled] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.factoryDebtReport] });
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  return (
    <ReportToolbar
      totalsItems={[
        { label: "Umumiy:", value: totals?.total_owed || 0, color: "#FF6600" },
        { value: totals?.total_given || 0, color: "#47B13C" },
        { value: totals?.total_debt || 0, color: "#1a1a1a" },
      ]}
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      filterContent={
        <>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Yil</p>
            <FilterSelect
              variant="filter"
              placeholder="Yil tanlang"
              options={yearsArray}
              name="year"
              defaultValue={yearFilter}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Oy</p>
            <FilterSelect
              variant="filter"
              placeholder="Oy tanlang"
              options={MonthsArray}
              name="month"
              defaultValue={currentMonth}
            />
          </div>
        </>
      }
      actions={
        <Select onValueChange={(id) => id && enableFactory(id)} disabled={isPending}>
          <SelectPrimitive.Trigger
            className="h-[42px] w-[180px] rounded-sm border border-[#1a1a1a]/15 bg-transparent px-[12px] flex items-center justify-between gap-[8px] text-[13px] text-[#1a1a1a] hover:bg-white/40 disabled:opacity-50 outline-none"
          >
            <span className="flex items-center gap-[8px]">
              {isPending ? (
                <Loader className="w-[16px] h-[16px] animate-spin" />
              ) : (
                <Plus className="w-[16px] h-[16px]" />
              )}
              <span>{isPending ? "Qo'shilmoqda..." : "Zavod qo'shish"}</span>
            </span>
            <ChevronDown className="w-[16px] h-[16px] text-[#1a1a1a]/60" />
          </SelectPrimitive.Trigger>
          <SelectContent>
            {factoryOptions.length === 0 ? (
              <div className="px-3 py-2 text-[13px] text-[#a3a3a3]">Bo'sh</div>
            ) : (
              factoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      }
    />
  );
}
