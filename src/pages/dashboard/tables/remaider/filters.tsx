import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { usefilialWarehouseFetch } from "@/pages/warehouse/remaider/queries";
import { getMonth } from "date-fns";

export default function Filters() {
  
  const { data } = usefilialWarehouseFetch({
    queries: { limit: 50 },
  });
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

  return (
    <div className="flex gap-1 px-5 my-4">
      <FilterSelect
        placeholder="все"
        defaultValue="clear"
        className="w-full bg-[#333333] text-white placeholder:text-white "
        options={[{ value: "clear", label:  "Все филиал" }, ...filialOption]}
        name="filialRemaider"
      />
      <FilterSelect
        placeholder="все"
        className=" p-2 border-border border w-full  placeholder:text-white "
        defaultValue="none"
        options={[
          {
            label: "Отчет об остатке",
            value: "none",
          },
          {
            label: "Отчет о продажах",
            value: "other",
          },
        ]}
        name="typeRemaiderOther"
      />
      <FilterSelect
        options={MonthsArray}
        name="monthRemaider"
        defaultValue={getMonth(new Date()) + 1 + ""}
        className=" p-2 border-border border w-full  placeholder:text-white "
      />
    </div>
  );
}
