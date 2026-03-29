import FilterSelect from "@/components/filters-ui/filter-select";

export default function Filters() {
  // const { data } = useData({
  //   queries: {
  //     limit: 100,
  //     page: 1,
  //     filial: meUser?.filial.id,
  //   },
  // });
  return (
    <div className=" px-[20px] h-[64px]   flex  gap-2 mb-2  ">
      <FilterSelect
        options={[]}
        // options={[
        //   { label: "Все", value: "all" },
        //   ...(data?.pages[0].items.map((l) => ({
        //     label: l.firstName + " " + l.lastName,
        //     value: l.id,
        //   })) || []),
        // ]}
        className=" w-[200px]   "
        placeholder="Страна "
        name="country"
      />
      <FilterSelect
        options={[]}
        // options={[
        //   { label: "Все", value: "all" },
        //   ...(data?.pages[0].items.map((l) => ({
        //     label: l.firstName + " " + l.lastName,
        //     value: l.id,
        //   })) || []),
        // ]}
        className=" w-[200px]   "
        placeholder="Поставщик "
        name="country"
      />
      <FilterSelect
        options={[]}
        // options={[
        //   { label: "Все", value: "all" },
        //   ...(data?.pages[0].items.map((l) => ({
        //     label: l.firstName + " " + l.lastName,
        //     value: l.id,
        //   })) || []),
        // ]}
        className=" w-[200px]   "
        placeholder="Партия "
        name="country"
      />
    </div>
  );
}
