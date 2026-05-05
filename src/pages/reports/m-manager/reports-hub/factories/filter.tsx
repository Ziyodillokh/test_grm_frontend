import { parseAsString, useQueryState } from "nuqs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import FilterSelect from "@/components/filters-ui/filter-select";
import ShadcnSelect from "@/components/Select";
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
        <ShadcnSelect
          value={undefined}
          onChange={(id) => id && enableFactory(id)}
          options={factoryOptions}
          placeholder={isPending ? "Qo'shilmoqda..." : "Zavod qo'shish"}
          disabled={isPending}
          className="bg-white border h-[42px] w-[220px] rounded-sm"
        />
      }
    />
  );
}
