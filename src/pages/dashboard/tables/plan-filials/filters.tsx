import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray, Years } from "@/consts";

export default function Filters() {

  return (
    <div className="flex gap-1 px-5 my-4">
      <FilterSelect
        options={[
          { label: "All", value: "all" },
          ...MonthsArray
        ]}
        name="monthPlanFilials"
        defaultValue={"all"}
        className="border-border border w-full bg-black text-white  placeholder:text-white "
      />
      <FilterSelect
        options={Years.map((e) => ({ label: e.toString(), value: e.toString() }))}
        name="Years"
        defaultValue={"2026"}
        className=" p-2 border-border border w-full  placeholder:text-white "
      />
    </div>
  );
}
