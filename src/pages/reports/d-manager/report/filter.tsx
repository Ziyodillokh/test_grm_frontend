import FilterSelect from "@/components/filters-ui/filter-select";
import useDataFetch from "@/pages/filial/table/queries";
import { useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import ReportToolbar from "@/components/report-toolbar";

export default function Filters() {
  const { id } = useParams();
  const [filial, setFilial] = useQueryState("filial", parseAsString);

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

  const hasActiveFilter = !!filial && filial !== "clear";
  const clearFilters = () => {
    setFilial(null);
  };

  return (
    <ReportToolbar
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      filterCols={1}
      filterContent={
        <div className="flex flex-col gap-[6px]">
          <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Filial</p>
          <FilterSelect
            variant="filter"
            placeholder="Hammasi"
            options={[{ value: "clear", label: "Hammasi" }, ...filialOption]}
            name="filial"
          />
        </div>
      }
    />
  );
}
