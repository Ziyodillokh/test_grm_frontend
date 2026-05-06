import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { ShareReportTotals } from "./type";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

export default function ShareFilter({
  totals,
  onExport,
  excelPending,
}: {
  totals?: ShareReportTotals;
  onExport?: () => void;
  excelPending?: boolean;
}) {
  const queryClient = useQueryClient();
  const currentYear = String(new Date().getFullYear());
  const currentMonth = String(new Date().getMonth() + 1);
  const [yearFilter, setYearFilter] = useQueryState("year", parseAsString.withDefault(currentYear));
  const [month, setMonth] = useQueryState("month", parseAsString.withDefault(currentMonth));
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isProfitDebt, setIsProfitDebt] = useState(true);

  const hasActiveFilter = yearFilter !== currentYear || month !== currentMonth;
  const clearFilters = () => {
    setYearFilter(null);
    setMonth(null);
  };

  const { mutate: createShare, isPending } = useMutation({
    mutationFn: () => AddData(apiRoutes.share, { fullName, phone, isProfitDebt }),
    onSuccess: () => {
      toast.success("Sherik qo'shildi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.shareReport] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.share] });
      setFullName("");
      setPhone("");
      setIsProfitDebt(true);
      setOpen(false);
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  return (
    <ReportToolbar
      totalsItems={[
        { label: "Umumiy:", value: totals?.total_capital || 0, color: "#47B13C" },
        { value: totals?.total_given_capital || 0, color: "#EF5C12" },
        { value: totals?.total_given_profit || 0, color: "#FF6600" },
        { value: totals?.total_debt || 0, color: "#1a1a1a" },
      ]}
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      onExport={onExport}
      excelPending={excelPending}
      filterContent={
        <>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Yil</p>
            <FilterSelect
              variant="filter"
              placeholder="Yil tanlang"
              options={yearsArray}
              name="year"
              defaultValue={yearFilter}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Oy</p>
            <FilterSelect
              variant="filter"
              placeholder="Oy tanlang"
              options={MonthsArray}
              name="month"
              defaultValue={currentMonth}
            />
          </div>
        </>
      }
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="group h-[42px] w-fit rounded-[6px] border border-[#e7ebf0] bg-transparent px-[16px] flex items-center gap-[8px] text-[15px] font-normal text-[#1a1a1a] outline-none">
              <Plus className="w-[16px] h-[16px]" />
              <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                Sherik qo'shish
              </span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi sherik</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-2">
              <Input placeholder="Ismi" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <label className="flex items-start gap-2 select-none cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-[3px] w-4 h-4 cursor-pointer"
                  checked={isProfitDebt}
                  onChange={(e) => setIsProfitDebt(e.target.checked)}
                />
                <span className="text-[13px] text-[#1a1a1a] leading-tight">
                  Foyda chiqim qoldiqdan ayriladi
                  <br />
                  <span className="text-[12px] text-[#a3a3a3]">
                    (belgilanmasa — qoldiq foyda to'lov bilan o'zgarmaydi)
                  </span>
                </span>
              </label>
              <Button
                onClick={() => createShare()}
                disabled={isPending || !fullName.trim()}
                className="bg-[#47B13C] hover:bg-[#3da032] text-white"
              >
                {isPending ? "Qo'shilmoqda..." : "Qo'shish"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    />
  );
}
