import FilterSelect from "@/components/filters-ui/filter-select";
import { getMonth } from "date-fns";
import { Store } from "lucide-react";
import useDataFetch from "@/pages/filial/table/queries";
import { useMeStore } from "@/store/me-store";

import { MonthsArray } from "@/consts";

export default function Filters() {
  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];
  const { meUser } = useMeStore()
  return (
    <div className="  px-[20px] h-[64px] items-center  flex gap-2 mb-2  ">
      <p className="text-[#272727] text-[20px] mr-auto">Отчёт по сотрудикам </p>
      {meUser?.position?.role != 4 && <FilterSelect
        placeholder="все"
        defaultValue="clear"
        className="w-[200px] h-[62px]  pl-4  "
        options={[{ value: "clear", label: "Все филиалы" }, ...filialOption]}
        name="filial"
        icons={
          <>
            <Store />
          </>
        }
      />}
      <FilterSelect
        options={MonthsArray}
        defaultValue={getMonth(new Date()) + 1 + ""}
        name="month"
        className="w-[160px] px-2 h-[62px]  "
      />

    </div>
  );
}
