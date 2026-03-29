import { FileOutput, Store } from "lucide-react";

import FilterSelect from "@/components/filters-ui/filter-select";
import useDataFetch from "@/pages/filial/table/queries";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Filters() {
  const { id } = useParams();
  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

  return (
    <div className="bg-sidebar border-border border-b  px-[20px] h-[64px] items-center  flex   ">
      {id ? (
        <p className="text-[#272727] text-[20px] mr-auto">Касса магазина</p>
      ) : (
        <>
          <FilterSelect
            placeholder="все"
            className="w-[200px] h-[65px] border-border mr-auto border-r"
            options={[{ value: "clear", label: "все" }, ...filialOption]}
            name="filial"
            icons={
              <>
                <Store />
              </>
            }
          />
          {/* <FilterSelect
            className="w-[200px]  h-[65px] ml-2  border-border border-r"
            placeholder="Тип операции"
            options={[
              { value: "clear", label: "Все" },
              { value: "income", label: "Приход" }, // Приход cashflow
              { value: "expense", label: "Расход" }, // Расход cashflow
              { value: "sale", label: "Продажа" }, // Приход order
              { value: "return", label: "Возврат" }, // Расход order
              { value: "collection", label: "Инкассация" }, // cashflowSlug => Инкассация
            ]}
            name="tip"
          /> */}
          
          <DateRangePicker fromPlaceholder={`от`} toPlaceholder={`до`} />
        </>
      )}
     {id ? <Button
        className="h-full  border-y-0 w-[140px]  ml-auto"
        variant={"outline"}
      >
        <FileOutput /> Экспорт
      </Button>:""}
      {/* <Button
        className="h-full border-l-0 bg-primary hover:bg-[#525248] hover:text-accent text-accent border-y-0 w-[165px]  "
        variant={"outline"}
      >
        <X /> Закрыть кассу
      </Button> */}
    </div>
  );
}
