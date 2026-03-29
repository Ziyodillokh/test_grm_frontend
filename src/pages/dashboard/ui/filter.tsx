import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import FilterSelect from "@/components/filters-ui/filter-select";
import ShadcnSelect from "@/components/Select";
import { MonthsArray, Years } from "@/consts";
import useDataFetch from "@/pages/filial/table/queries";
import { useYear } from "@/store/year-store";
import { getMonth } from "date-fns";
import { useQueryState } from "nuqs";

export default function Filter() {
  const { year, setYear } = useYear();
  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

  const [month] = useQueryState("month");

  return (
    <>
      <div className="flex gap-1 w-full mt-16">
        <FilterSelect
          placeholder="все"
          defaultValue="clear"
          className="w-[170px] h-[65px] bg-[#333333] text-white"
          options={[
            { value: "clear", label: "все" },
            { value: "#dealers", label: "Dealer" },
            ...filialOption,
          ]}
          name="filial"
        />
         <DateRangePicker
          defaultMonth={month as unknown as Date}
          className="w-full "
          toPlaceholder="до"
          fromPlaceholder="от"
        />

        <FilterSelect
          options={MonthsArray}
          defaultValue={getMonth(new Date()) + 1 + ""}
          name="month"
          className="w-[170px]  px-2 h-[62px]  "
        />
        <ShadcnSelect
          className={` border-none bg-card rounded-xl px-4  w-[170px]  px-2 h-[62px]  `}
          value={String(year)}
          defaultValue={String(year)}
          options={Years?.map((e) => ({
            label: `${e}-yil`,
            value: String(e),
          }))}
          onChange={(e) => {
            setYear(Number(e));
          }}
        />
        
       
      </div>
    </>
  );
}
