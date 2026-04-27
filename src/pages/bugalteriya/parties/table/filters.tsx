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

  const [countryQ, setCountryQ] = useQueryState("country");
  const [factoryQ, setFactoryQ] = useQueryState("factory");
  const [partiyaQ, setPartiyaQ] = useQueryState("partiya-number");
  const [startDateQ, setStartDateQ] = useQueryState("startDate");
  const [endDateQ, setEndDateQ] = useQueryState("endDate");

  const role = meUser?.position?.role;
  const canAdd = role === 9 || role === 5;

  const hasActiveFilter = !!(countryQ || factoryQ || partiyaQ || startDateQ || endDateQ);

  const handleClear = () => {
    setCountry(null);
    setFactory(null);
    setpartiyaNumber(null);
    setCountryQ(null);
    setFactoryQ(null);
    setPartiyaQ(null);
    setStartDateQ(null);
    setEndDateQ(null);
  };

  return (
    <ReportToolbar
      hasActiveFilter={hasActiveFilter}
      onClearFilters={handleClear}
      filterContent={
        <>
          {/* Davr — col-span-2: label tepada, 2 ta date input pastida side-by-side */}
          <div className="flex flex-col gap-[6px] col-span-2">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Davr</p>
            <DateRangePicker variant="filter" fromPlaceholder="...dan" toPlaceholder="...gacha" />
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Davlat</p>
            <FilterComboboxDemoInput
              className="w-[240px] h-[44px] bg-white border-0 border-b border-[#e7ebf0] rounded-none"
              placeholder="Davlat"
              fetchUrl="/country"
              name="country"
              setValue={setCountry}
              value={country}
              fieldNames={{ label: "title", value: "id" }}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Taminotchi</p>
            <FilterComboboxDemoInput
              className="w-[240px] h-[44px] bg-white border-0 border-b border-[#e7ebf0] rounded-none"
              placeholder="Taminotchi"
              fetchUrl="/factory"
              name="factory"
              setValue={setFactory}
              value={factory}
              fieldNames={{ label: "title", value: "id" }}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Partiya</p>
            <FilterComboboxDemoInput
              className="w-[240px] h-[44px] bg-white border-0 border-b border-[#e7ebf0] rounded-none"
              placeholder="Partiya"
              name="partiya-number"
              fetchUrl="/partiya-number"
              setValue={setpartiyaNumber}
              value={partiyaNumber}
              fieldNames={{ label: "title", value: "id" }}
            />
          </div>
        </>
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
