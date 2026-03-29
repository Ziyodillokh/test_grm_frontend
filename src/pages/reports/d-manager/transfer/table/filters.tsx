// import {  useQueryState } from "nuqs";

import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import SearchInput from "@/components/filters-ui/search-input";

export default function Filters() {

 

  return (
    <div className="h-[64px] flex justify-between gap-2 mb-2  w-full pr-10">
        <SearchInput  className="w-[350px]"/>
        <DateRangePicker
          fromPlaceholder="от: 12.02.2025"
          toPlaceholder="до: 12.02.2025"
        />
    </div>
  );
}
