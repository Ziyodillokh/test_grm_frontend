// import {  useQueryState } from "nuqs";

import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import FilterSelect from "@/components/filters-ui/filter-select";
import SearchInput from "@/components/filters-ui/search-input";
import { BrCodeIcons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useMeStore } from "@/store/me-store";
import { parseAsString, useQueryState } from "nuqs";

export default function Filters() {
  // const [type] = useQueryState("type");
  const { meUser } = useMeStore();
  const [type] = useQueryState(
    "type",
    parseAsString.withDefault("In")
  )
  // const [filial] = useQueryState("filial");
  // const [filialTo] = useQueryState("filialTo");

  // const linkFrom =
  //   meUser?.position.role === 9 ? filial || "" : meUser?.filial?.id || "";
  // const linkTo = meUser?.position.role === 9 ? filialTo : filial;
  // const link = "/transfers/" + linkFrom + "/to/" + linkTo;

  return (
    <div className="h-[64px] flex justify-between border-b border-border w-full bg-sidebar pr-10">
      {meUser?.position.role !== 6 && (
        <Button
          className="h-full border-r-1  rounded-none justify-center font-[16px] gap-1  border-y-0  border-l-0"
          variant={"outline"}
        >
          <BrCodeIcons />
          Баркод
        </Button>
      )}
      <SearchInput className="w-full max-w-[300px] mr-auto" />
      <div className="border-x border-border flex items-center w-full max-w-[160px]">
        <FilterSelect
          name="progress"
          className="w-full max-w-[160px] "
          defaultValue="all"
          options={[
            { label: "Все", value: "all" },
            { label: type == "In" ? "Новый" : "В ожидании", value: type == "In" ? "New" : "InProgres" },
            { label: "Принятые", value: "Accepted" },
            { label: "Отменённые", value: "Rejected" },
          ]}

        />
      </div>
      <DateRangePicker
        fromPlaceholder="от: 12.02.2025"
        toPlaceholder="до: 12.02.2025"
      />

      {/* {meUser?.position.role !== 9 &&
        (type !== "Out" && (meUser?.position.role !== 6 || type != "New") ? (
          <Button
            className="h-full border-x-1 border-y-0 w-[100px] "
            variant={"outline"}
            // onClick={() => navigate("create")}
          >
            Принять
          </Button>
        ) : (
          ""
          // meUser?.position.role !== 6 && (
          //   <Button
          //     onClick={() => navigate(link)}
          //     className="h-full border-x-1 border-y-0  "
          //   >
          //     Добавить трансфер
          //   </Button>
          // )
        ))} */}
    </div>
  );
}
