import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { getMonth } from "date-fns";
import useDataFetch from "@/pages/filial/table/queries";
import { useEffect } from "react";
import { useQueryState } from "nuqs";

export default function Filters() {

  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });
  const [filial] = useQueryState("filial");
  const [,setTypeSaledebt] = useQueryState("typeSaleDebt");
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

    useEffect(()=>{
      if(filial== "#dealers"){
        setTypeSaledebt("debt")
      }
    },[filial])

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
            value: "debt",
            label: "Продажи в долг",
          },
          {
            value: "canceled",
            label: "Вазврат",
          },

        ]}
        disabled={filial== "#dealers"}
        name="typeSaleDebt"
        defaultValue={'debt'}
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
