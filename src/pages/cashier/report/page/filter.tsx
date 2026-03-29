import { FileOutput, Loader } from "lucide-react";

import FilterSelect from "@/components/filters-ui/filter-select";
import { Button } from "@/components/ui/button";
import qs from "qs";
import { parseAsString, useQueryState } from "nuqs";
import { apiRoutes } from "@/service/apiRoutes";
import { useMutation } from "@tanstack/react-query";
const Sort = [
  {
    label: "Открытый",
    value: "open",
  },
  {
    label: "В ожидание подтверждения",
    value: "closed_by_c",
  },
  {
    label: "Подтверждённые",
    value: "accepted",
  },
  {
    label: "Отменённые",
    value: "rejected",
  },
];

const SortSingle = [
  {
    label: "Все",
    value: "Все",
  },
  {
    label: "Расход",
    value: "Расход",
  },
  {
    label: "Приход",
    value: "Приход",
  },
];
export default function Filters({
  kassaId,
}: {
  countLength: number;
  kassaId: string | undefined;
}) {
  const [id] = useQueryState("id");
  const [sort] = useQueryState("sort", parseAsString.withDefault("open"));

  const { mutate: exelMudate, isPending: exelPending } = useMutation({
    mutationFn: async () => {
      const query = {
        // reportId: myCashFlow && !FManagerCashFlow ? id : undefined,
        kassaId: sort == "open" ? kassaId : id || undefined,
      };
      const params = query
        ? `?${qs.stringify(query, { arrayFormat: "repeat" })}`
        : "";

      window.location.href =
        import.meta.env.VITE_BASE_URL + apiRoutes.excelCashflowsExcel + params;
    },
  });
  return (
    <div className="w-full mb-2 sticky top-0 flex gap-3  h-[50px] ">
      {id ? (
        <FilterSelect
          options={SortSingle}
          className="max-w-[426px] rounded-xl bg-primary text-[#E6E6D9]  w-full text-[20px]"
          classNameValue="bg-red-200"
          placeholder="Все операции"
          classNameContainer="bg-primary text-[#E6E6D9]"
          classNameItem="bg-primary p-4 text-[20px]"
          defaultValue="Все"
          name="sortSingle"
        />
      ) : (
        <FilterSelect
          options={Sort}
          className="max-w-[426px] rounded-xl bg-primary text-[#E6E6D9]  w-full text-[20px]"
          classNameValue="bg-red-200"
          placeholder="Все операции"
          classNameContainer="bg-primary text-[#E6E6D9]"
          classNameItem="bg-bg-primary p-4 text-[20px]"
          defaultValue="open"
          name="sort"
        />
      )}

      {/* <Button
        className="h-full border-l-1 text-primary justify-center gap-1 w-[60px] border-y-0 border-r-0"
        size={"icon"}
        variant={"outline"}
      >
        <SquarePen />
      </Button> */}
      {/* <Button
        className="h-full  border-l-1 text-primary justify-center gap-1 px-4 border-y-0 "
        variant={"outline"}
      >
        <Tornado />
        Фильтр
      </Button> */}

      {sort === "open" || Boolean(id) ? (
        <Button
          onClick={() => exelMudate()}
          disabled={exelPending}
          className="h-full ml-auto  bg-card hover:bg-card rounded-xl  text-primary justify-center gap-1 px-4 border-0"
          variant={"outline"}
        >
          {exelPending ? <Loader className="animate-spin" /> : <FileOutput />}
          Экспорт
        </Button>
      ) : (
        ""
      )}
    </div>
  );
}
