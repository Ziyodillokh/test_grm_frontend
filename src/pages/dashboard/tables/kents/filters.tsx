import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import useDeblsData from "@/pages/debt/table/queries";
import { getMonth } from "date-fns";

export default function Filters() {
  
  const { data } =
  useDeblsData({
    queries: { limit: 50 },
  });
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.fullName,
      value: e?.id,
    })) || [];

  return (
    <div className="flex gap-1 px-5 my-4">
      <FilterSelect
        placeholder="все"
        defaultValue="clear"
        className="w-full bg-[#333333] text-white placeholder:text-white "
        options={[{ value: "clear", label: "все" }, ...filialOption]}
        name="debls"
      />
      <FilterSelect
        placeholder="все"
        className=" p-2 border-border border w-full  placeholder:text-white "
        defaultValue="clear"
        options={[
          { value: "clear", label: "все" },
          { value: "Приход", label: "Приход" },
          { value: "Расход", label: "Rasxod" },
        ]}
        name="typeKents"
      />
      <FilterSelect
        options={MonthsArray}
        name="monthKents"
        defaultValue={getMonth(new Date()) + 1 + ""}
        className=" p-2 border-border border w-full  placeholder:text-white "
      />
    </div>
  );
}
