import { FileOutput } from "lucide-react";
import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";
import { FactoryReportTotals } from "./type";
import formatPrice from "@/utils/formatPrice";

export default function FactoryFilter({
  totals,
  showExport,
  onExport,
}: {
  totals?: FactoryReportTotals;
  showExport?: boolean;
  onExport?: () => void;
}) {
  return (
    <div className="bg-sidebar border-border border-b h-[64px] flex">
      <SearchInput className="border-border border-r" />

      <div className="text-nowrap p-5 flex gap-4 items-center h-full mr-auto">
        {totals && (
          <>
            <p className="text-[13px] text-[#FF6600]">
              Olingan: {formatPrice(totals.total_owed || 0)} $
            </p>
            <p className="text-[13px] text-[#89A143]">
              To'langan: {formatPrice(totals.total_given || 0)} $
            </p>
            <p className="text-[13px] font-bold">
              Qolgan: {formatPrice(totals.total_debt || 0)} $
            </p>
          </>
        )}
      </div>

      {showExport && (
        <Button
          onClick={onExport}
          variant="secondary"
          className="h-full border-l border-border rounded-none px-4"
        >
          <FileOutput size={18} />
          Export
        </Button>
      )}
    </div>
  );
}
