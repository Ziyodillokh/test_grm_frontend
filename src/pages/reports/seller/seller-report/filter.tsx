import { getMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { useMeStore } from "@/store/me-store";
import useDataFetch from "@/pages/filial/table/queries";
import ReportToolbar from "@/components/report-toolbar";

export default function Filter() {
  const { meUser } = useMeStore();

  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });
  const filialOptions =
    data?.pages?.[0]?.items?.map((e: any) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

  return (
    <ReportToolbar
      filterContent={
        <>
          {meUser?.position?.role != 4 && (
            <div>
              <p className="text-[13px] text-muted-foreground mb-1">Filial</p>
              <FilterSelect
                placeholder="Barcha filiallar"
                defaultValue="clear"
                className="w-full"
                options={[{ value: "clear", label: "Barcha filiallar" }, ...filialOptions]}
                name="filial"
              />
            </div>
          )}
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">Oy</p>
            <FilterSelect
              placeholder="Oy tanlang"
              className="w-full"
              options={MonthsArray}
              name="month"
              defaultValue={String(getMonth(new Date()) + 1)}
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
