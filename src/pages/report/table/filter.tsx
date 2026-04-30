import { useMeStore } from "@/store/me-store";
import FilterSelect from "@/components/filters-ui/filter-select";
import useDataFetch from "@/pages/filial/table/queries";
import { parseAsString, useQueryState } from "nuqs";
import ReportToolbar from "@/components/report-toolbar";

export default function Filters() {
  const { meUser } = useMeStore();
  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });
  const [id] = useQueryState("id");
  const [filial, setFilial] = useQueryState("filial", parseAsString);
  const [tip, setTip] = useQueryState("tip", parseAsString);
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

  const hasActiveFilter = !!filial || !!tip;
  const clearFilters = () => {
    setFilial(null);
    setTip(null);
  };

  return (
    <ReportToolbar
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      filterContent={
        <>
          {(meUser?.position?.role == 10 || (meUser?.position?.role == 9 && !id)) && (
            <>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Filial</p>
                <FilterSelect
                  variant="filter"
                  placeholder="Hammasi"
                  options={[{ value: "clear", label: "Hammasi" }, ...filialOption]}
                  name="filial"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Turi</p>
                <FilterSelect
                  variant="filter"
                  placeholder="Hammasi"
                  options={[
                    { value: "clear", label: "Hammasi" },
                    { value: "income", label: "Kirim" },
                    { value: "expense", label: "Chiqim" },
                    { value: "sale", label: "Sotuv" },
                    { value: "return", label: "Qaytarish" },
                    { value: "collection", label: "Inkassa" },
                  ]}
                  name="tip"
                />
              </div>
            </>
          )}
        </>
      }
    />
  );
}
