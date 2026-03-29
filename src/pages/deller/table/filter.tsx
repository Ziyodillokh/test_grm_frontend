import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";

import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";
import { Years } from "@/consts";
import ShadcnSelect from "@/components/Select";

export default function Filters() {
  const [, setId] = useQueryState("id");
  const { meUser } = useMeStore();
  const { year, setYear } = useYear();
  return (
    <div className=" px-[20px] h-[64px]   flex gap-2 mb-2  ">
      <SearchInput className=" w-full max-w-[400px]" />

      {/* <Button className="h-full  border-y-0 w-[140px] " variant={"outline"}>
        <FileOutput /> Экспорт
      </Button> */}

      <ShadcnSelect
        className={` border-none mr-auto bg-card rounded-xl px-4  w-[170px]  px-2 h-[62px]  `}
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
      {meUser?.position?.role == 6 ? (
        <Button
          onClick={() => setId("new")}
          className="h-full  w-[200px] "
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
