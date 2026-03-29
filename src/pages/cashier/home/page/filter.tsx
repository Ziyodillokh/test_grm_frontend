
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import FilterSelect from "@/components/filters-ui/filter-select";
import useData from "@/pages/employees/table/queries";
import { useMeStore } from "@/store/me-store";
const Sort = [
  {
    label: "Все",
    value: "all",
  },
  {
    label: "В ожидание подтверждения",
    value: "progress",
  },
  {
    label: "Подтверждённые",
    value: "accepted",
  },
  {
    label: "Отменённые",
    value: "rejected",
  },
  {
    label: "Возвращённые",
    value: "canceled",
  },
];
export default function Filters() {
  const { meUser } = useMeStore();
  const { data } = useData({
    queries: {
      limit: 100,
      page: 1,
      filial: meUser?.filial.id,
    },
  });

  return (
    <div className="w-full flex gap-3  h-[50px] ">
       <FilterSelect
        options={Sort}
        className="max-w-[426px] bg-primary text-[#E6E6D9] rounded-xl px-2  w-full text-[20px]"
        classNameValue="bg-red-200"
        placeholder="Все операции"
        classNameContainer="bg-primary rounded-[12px] text-[#E6E6D9]"
        classNameItem=" bg-primery rounded-[9px] hover:bg-[#5D5D53CC] p-4 text-[20px]"
        defaultValue="all"
        name="sort"
        icons
      />
      <FilterSelect
        options={[
          { label: "Все", value: "all" },
          ...(data?.pages[0].items.map((l) => ({
            label: l.firstName + " " + l.lastName,
            value: l.id,
          })) || []),
        ]}
        className=" w-[220px]  rounded-xl px-2 bg-card"
        placeholder="Выберите продавца"
        name="sellerId"
      />
      <DateRangePicker toPlaceholder="до" fromPlaceholder="от" />
     
    </div>
  );
}
