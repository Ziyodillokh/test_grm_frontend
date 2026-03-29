import FilterSelect from "@/components/filters-ui/filter-select";
import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";
import { usefilialWarehouseFetch } from "@/pages/reports/m-manager/remaider/queries";
import { useMeStore } from "@/store/me-store";
import { Archive, FileOutput, Plus, Store, Trash2 } from "lucide-react";
import { useQueryState } from "nuqs";

export default function Filters() {
  const [, setId] = useQueryState("id");

  const { data } = usefilialWarehouseFetch({
    queries: { limit: 50 },
  });
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];
  const { meUser } = useMeStore();

  return (
    <div className="  px-[20px] h-[64px]   flex  gap-2 mb-2  ">
      <SearchInput className="w-full  max-w-[300px] mr-auto" />
      {meUser?.position.role == 11 ? (
        <FilterSelect
          icons={<Store />}
          className="w-full max-w-[170px] pl-4"
          placeholder="Филиалы"
          name="filial"
          options={[{ label: "Все", value: "all" }, ...filialOption]}
        />
      ) : (
        ""
      )}
      <Button className="h-full   w-[64px]" variant={"secondary"}>
        <Trash2 />
      </Button>
      <Button className="h-full  w-[64px]  " variant={"secondary"}>
        <Archive />
      </Button>
      <Button className="h-full   w-[140px] " variant={"secondary"}>
        <FileOutput /> Экспорт
      </Button>
      {(meUser?.position.role == 11 || meUser?.position.role == 4) ? (
        <Button
          onClick={() => setId("new")}
          className="h-full   "
          variant={"secondary"}
        >
          <Plus size={24} /> Добавить
        </Button>
      ) : (
        ""
      )}
    </div>
  );
}
