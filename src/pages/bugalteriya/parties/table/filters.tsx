import { Plus } from "lucide-react";
import { useState } from "react";
import { useQueryState } from "nuqs";

import { useMeStore } from "@/store/me-store";
import ReportToolbar from "@/components/report-toolbar";
import { OutlineButton } from "@/components/ui/outline-button";
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
      inlineControls={
        canAdd ? (
          <OutlineButton
            icon={<Plus className="w-[16px] h-[16px]" />}
            onClick={() => setId("new")}
          >
            Yangi Partiya
          </OutlineButton>
        ) : undefined
      }
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
              className="w-full h-[44px] bg-white hover:bg-white border-0 border-b border-[#e7ebf0] rounded-[4px]"
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
              className="w-full h-[44px] bg-white hover:bg-white border-0 border-b border-[#e7ebf0] rounded-[4px]"
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
              className="w-full h-[44px] bg-white hover:bg-white border-0 border-b border-[#e7ebf0] rounded-[4px]"
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
    />
  );
}
