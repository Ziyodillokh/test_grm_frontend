import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import ReportToolbar from "@/components/report-toolbar";
import { FactoryReportTotals } from "./type";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

export default function FactoryFilter({
  totals,
}: {
  totals?: FactoryReportTotals;
}) {
  const [yearFilter] = useQueryState("year", parseAsString.withDefault(String(new Date().getFullYear())));

  return (
    <ReportToolbar
      totalsItems={[
        { label: "Umumiy:", value: totals?.total_owed || 0, color: "#FF6600" },
        { value: totals?.total_given || 0, color: "#47B13C" },
        { value: totals?.total_debt || 0, color: "#1a1a1a" },
      ]}
      filterContent={
        <>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">Yil</p>
            <FilterSelect
              placeholder="Yil tanlang"
              className="w-full"
              options={yearsArray}
              name="year"
              defaultValue={yearFilter}
            />
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">Oy</p>
            <FilterSelect
              placeholder="Oy tanlang"
              className="w-full"
              options={MonthsArray}
              name="month"
              defaultValue={String(new Date().getMonth() + 1)}
            />
          </div>
          <Button variant="outline" className="w-full mt-2">
            Tozalash
          </Button>
        </>
      }
    />
  );
}
