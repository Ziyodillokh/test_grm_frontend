import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { getMonth } from "date-fns";
import { useQueryState } from "nuqs";
import { useDataCashflowTypes } from "./queries";
import { useEffect } from "react";

export default function Filters() {
  const [typeKassamanager] = useQueryState("typeKassamanager");
  const [,setTypeOther] = useQueryState("typeOther");
  const [managerId] = useQueryState("managerId");
  // /cashflow-types/by/managers/{id}

  const { data: types } = useDataCashflowTypes({
    queries: {
      limit: 20,
      page: 1,
      type:
        typeKassamanager == "clear"
          ? undefined
          : typeKassamanager == "Приход"
            ? "income"
            : "out",
    },
    id: managerId || undefined,

    enabled: true,
  });

  const filialOption =
    types?.map((e) => ({
      label: e?.title,
      value: e?.id,
    })) || [];

    useEffect(()=>{
      setTypeOther("clear")
    },[typeKassamanager])

  return (
    <div className="flex gap-1 px-5 my-4">
      <FilterSelect
        placeholder="все"
        defaultValue="clear"
        className="w-full bg-[#333333] text-white placeholder:text-white "
        options={[
          { value: "clear", label: "все" },
          { value: "Приход", label: "Приход" },
          { value: "Расход", label: "Rasxod" },
        ]}
        name="typeKassamanager"
      />
      <FilterSelect
        placeholder="все"
        className=" p-2 border-border border w-full  placeholder:text-white "
        defaultValue="clear"
        options={[   { value: "clear", label: "все" },...filialOption]}
        name="typeCashflow"
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
