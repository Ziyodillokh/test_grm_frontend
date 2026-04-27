import { Plus } from "lucide-react";
import { useState } from "react";
import { useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { useMeStore } from "@/store/me-store";
import ReportToolbar from "@/components/report-toolbar";
import FilterComboboxDemoInput from "@/components/filters-ui/filterCombobox";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { TSelectOption } from "@/types";

export default function Filters() {
  const [, setId] = useQueryState("id");
  const { meUser } = useMeStore();
  const [country, setCountry] = useState<TSelectOption | null>(null);
  const [factory, setFactory] = useState<TSelectOption | null>(null);
  const [partiyaNumber, setpartiyaNumber] = useState<TSelectOption | null>(null);

  const role = meUser?.position?.role;
  const canAdd = role === 9 || role === 5 || role === 12;

  return (
    <ReportToolbar
      filterContent={
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">Sana oralig'i</p>
            <DateRangePicker fromPlaceholder="от" toPlaceholder="до" className="max-w-full" />
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">Страна</p>
            <FilterComboboxDemoInput
              className="w-full h-[42px]"
              placeholder="Страна"
              fetchUrl="/country"
              name="country"
              setValue={setCountry}
              value={country}
              fieldNames={{ label: "title", value: "id" }}
            />
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">Поставщик</p>
            <FilterComboboxDemoInput
              className="w-full h-[42px]"
              placeholder="Поставщик"
              fetchUrl="/factory"
              name="factory"
              setValue={setFactory}
              value={factory}
              fieldNames={{ label: "title", value: "id" }}
            />
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">Партия</p>
            <FilterComboboxDemoInput
              className="w-full h-[42px]"
              placeholder="Партия"
              name="partiya-number"
              fetchUrl="/partiya-number"
              setValue={setpartiyaNumber}
              value={partiyaNumber}
              fieldNames={{ label: "title", value: "id" }}
            />
          </div>
        </div>
      }
      actions={
        canAdd ? (
          <Button
            onClick={() => setId("new")}
            className="h-[42px] rounded-sm bg-[#1A1A1A] hover:bg-[#333] text-white px-5 text-[14px]"
          >
            <Plus size={16} className="mr-1" /> Partiya qo'shish
          </Button>
        ) : null
      }
    />
  );
}
