import { parseAsString, useQueryState } from "nuqs";

import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { OutlineButton } from "@/components/ui/outline-button";
import { useMeStore } from "@/store/me-store";
import { usefilialWarehouseFetch } from "@/pages/reports/m-manager/remaider/queries";
import { Plus } from "lucide-react";

export default function UserFilter() {
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;
  const isManager = role >= 9;

  const [filial, setFilial] = useQueryState("filial", parseAsString);
  const [, setId] = useQueryState("id", parseAsString);

  const { data: filialData } = usefilialWarehouseFetch({
    queries: { limit: 50 },
    options: { enabled: isManager } as any,
  });
  const filialOptions =
    filialData?.pages?.[0]?.items?.map((e: any) => ({
      label: e?.name || e?.title,
      value: e?.id,
    })) || [];

  const hasActiveFilter = !!filial && filial !== "all";
  const clearFilters = () => setFilial(null);

  return (
    <ReportToolbar
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      filterCols={1}
      filterContent={
        isManager ? (
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Filial</p>
            <FilterSelect
              variant="filter"
              placeholder="Barcha filiallar"
              classNameContainer="z-[60]"
              options={[{ value: "all", label: "Barchasi" }, ...filialOptions]}
              name="filial"
            />
          </div>
        ) : undefined
      }
      actions={
        role === 11 ? (
          <OutlineButton
            icon={<Plus className="w-[16px] h-[16px]" />}
            onClick={() => setId("new")}
          >
            Qo'shish
          </OutlineButton>
        ) : undefined
      }
    />
  );
}
