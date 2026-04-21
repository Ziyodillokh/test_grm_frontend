import FilterSelect from "@/components/filters-ui/filter-select";
import { Button } from "@/components/ui/button";
import { parseAsString, useQueryState } from "nuqs";
import { apiRoutes } from "@/service/apiRoutes";
import { useMutation } from "@tanstack/react-query";
import qs from "qs";
import ReportToolbar from "@/components/report-toolbar";

const CashflowStatus = [
  { label: "Barchasi", value: "all" },
  { label: "Kutilmoqda", value: "pending" },
  { label: "Tasdiqlangan", value: "accepted" },
  { label: "Rad etilgan", value: "rejected" },
];

const SortSingle = [
  { label: "Hammasi", value: "Все" },
  { label: "Chiqim", value: "Расход" },
  { label: "Kirim", value: "Приход" },
];

export default function Filters({
  kassaId,
}: {
  kassaId: string | undefined;
}) {
  const [id] = useQueryState("id");
  const [sort] = useQueryState("sort", parseAsString.withDefault("all"));

  const { mutate: exelMudate, isPending: exelPending } = useMutation({
    mutationFn: async () => {
      const query = {
        kassaId: kassaId || id || undefined,
      };
      const params = query
        ? `?${qs.stringify(query, { arrayFormat: "repeat" })}`
        : "";

      window.location.href =
        import.meta.env.VITE_BASE_URL + apiRoutes.excelCashflowsExcel + params;
    },
  });

  return (
    <ReportToolbar
      onExport={() => exelMudate()}
      excelPending={exelPending}
      filterContent={
        <>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">Holat</p>
            <FilterSelect
              options={CashflowStatus}
              className="w-full"
              placeholder="Barchasi"
              defaultValue="all"
              name="sort"
            />
          </div>
          {(sort === "all" || Boolean(id)) && (
            <div>
              <p className="text-[13px] text-muted-foreground mb-1">Turi</p>
              <FilterSelect
                options={SortSingle}
                className="w-full"
                placeholder="Hammasi"
                defaultValue="Все"
                name="sortSingle"
              />
            </div>
          )}
          <Button variant="outline" className="w-full mt-2">
            Tozalash
          </Button>
        </>
      }
    />
  );
}
