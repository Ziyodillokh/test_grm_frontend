import FilterSelect from "@/components/filters-ui/filter-select";
import useDataFetch from "@/pages/filial/table/queries";
import { useMeStore } from "@/store/me-store";
import { getMonth } from "date-fns";
import { Store } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

const monthsArray = [
  { label: "Январь", value: "1" },
  { label: "Февраль", value: "2" },
  { label: "Март", value: "3" },
  { label: "Апрель", value: "4" },
  { label: "Май", value: "5" },
  { label: "Июнь", value: "6" },
  { label: "Июль", value: "7" },
  { label: "Август", value: "8" },
  { label: "Сентябрь", value: "9" },
  { label: "Октябрь", value: "10" },
  { label: "Ноябрь", value: "11" },
  { label: "Декабрь", value: "12" },
];
export default function LeftConent() {
  const { meUser } = useMeStore();
  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault(getMonth(new Date()) + 1 + "")
  );
  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

  return (
    <div className="h-full flex flex-col    min-w-[220px]">
      <div className="p-1.5 h-[55px] ">
      
          <FilterSelect
            placeholder="все"
            disabled={meUser?.position?.role == 4}
            className="w-[200px] rounded-lg px-2 h-[44px] bg-popover"
            options={[{ value: "clear", label: "все" },{value:"#dealers",label:"Dealer"}, ...filialOption]}
            name="filial"
            defaultValue={meUser?.filial?.id}
            icons={
              <>
                <Store />
              </>
            }
          />
      
      </div>
      <div className="p-1.5 w-full border-border  border-t">
        {monthsArray?.map((item) => (
          <p
            onClick={() => setMonth(item?.value)}
            className={`${item?.value == month ? "bg-input" : ""} w-full text-[#272727] cursor-pointer rounded-md text-[16px] font-medium px-[26px] py-[12px] `}
          >
            {item?.label}
          </p>
        ))}
      </div>
      <p className="border-t mt-auto px-[31px] text-[#272727] py-[18px] border-border">
        Годовой отчет
      </p>
    </div>
  );
}
