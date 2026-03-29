import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { getMonth } from "date-fns";
import useDataFetch from "@/pages/filial/table/queries";

export default function Filters() {

  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
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
        className="w-full h-[65px] bg-[#333333] text-white"
        options={[
          { value: "clear", label: "Все филиал" },
          { value: "#dealers", label: "Dealer" },
          ...filialOption,
        ]}
        name="filial"
      />
       <FilterSelect
        options={[
          {
            value: "country",
            label: "Страна",
          },
          {
            value: "factory",
            label: "Поставшик",
          },
          {
            value: "collection",
            label: "Коллекция",
          }
        ]}
        name="typeProfit"
        defaultValue={'country'}
        className=" p-2 border-border border w-full  placeholder:text-white "
      />
      <FilterSelect
        options={MonthsArray}
        name="month"
        defaultValue={getMonth(new Date()) + 1 + ""}
        className=" p-2 border-border border w-full  placeholder:text-white "
      />
    </div>
  );
}
