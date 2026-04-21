import FilterSelect from "@/components/filters-ui/filter-select";
import useDataFetch from "@/pages/filial/table/queries";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReportToolbar from "@/components/report-toolbar";

export default function Filters() {
  const { id } = useParams();
  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

  if (id) {
    return (
      <ReportToolbar
        beforeIcons={
          <div className="flex items-center bg-white rounded-sm px-[12px] h-[42px]">
            <span className="text-[14px] font-medium text-[#1a1a1a]">Kassa</span>
          </div>
        }
      />
    );
  }

  return (
    <ReportToolbar
      filterContent={
        <>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">Filial</p>
            <FilterSelect
              placeholder="Hammasi"
              className="w-full"
              options={[{ value: "clear", label: "Hammasi" }, ...filialOption]}
              name="filial"
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
