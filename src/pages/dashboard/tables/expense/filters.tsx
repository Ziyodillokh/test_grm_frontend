import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { getMonth } from "date-fns";
import { useQueryState } from "nuqs";
import { useDataCashflowTypes } from "./queries";
import useDataFetch from "@/pages/filial/table/queries";
import { useEffect } from "react";

export default function Filters() {
  const [typeKassamanager] = useQueryState("typeKassamanager");
  const [, setTypeOther] = useQueryState("typeOther");

  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];
    
  const { data: types } = useDataCashflowTypes({
    queries: {
      limit: 50,
      page: 1,
      type: "out",
    },
    enabled: true,
  });

  const typesOption =
    types?.map((e) => ({
      label: e?.title,
      value: e?.id,
    })) || [];

  useEffect(() => {
    setTypeOther("clear");
  }, [typeKassamanager]);

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
        placeholder="все"
        className=" p-2 border-border border w-full  placeholder:text-white "
        defaultValue="clear"
        options={[{ value: "clear", label: "все" }, ...typesOption]}
        name="typeExpense"
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
