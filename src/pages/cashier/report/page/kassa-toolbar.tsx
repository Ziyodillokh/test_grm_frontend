import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  FileSpreadsheet,
  Loader,
  Plus,
  X,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useMutation, useQuery } from "@tanstack/react-query";
import qs from "qs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { apiRoutes } from "@/service/apiRoutes";
import { getAllData } from "@/service/apiHelpers";
import { useMeStore } from "@/store/me-store";
import useData from "@/pages/employees/table/queries";
import debounce from "@/utils/debounce";
import type { CashflowType } from "@/components/adding-parish-flow";

interface KassaToolbarProps {
  kassaId: string;
  showAddButtons?: boolean;
  onAddIncome?: () => void;
  onAddExpense?: () => void;
}

export default function KassaToolbar({
  kassaId,
  showAddButtons,
  onAddIncome,
  onAddExpense,
}: KassaToolbarProps) {
  const { meUser } = useMeStore();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [sellerId, setSellerId] = useQueryState("sellerId", parseAsString);
  const [cashflowTypeId, setCashflowTypeId] = useQueryState("cashflowTypeId", parseAsString);
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);
  const [filterOpen, setFilterOpen] = useState(false);

  const hasActiveFilter = !!sellerId || !!cashflowTypeId || !!startDate || !!endDate;

  // Sellers
  const { data: sellersData } = useData({
    queries: {
      limit: 100,
      page: 1,
      filial: meUser?.filial?.id,
    },
  });

  const sellers = sellersData?.pages?.[0]?.items || [];

  // Cashflow types
  const { data: cashflowTypesData } = useQuery({
    queryKey: ["/cashflow-types/for/branch-manager", "toolbar"],
    queryFn: () => getAllData("/cashflow-types/for/branch-manager"),
  });

  const cashflowTypes = (cashflowTypesData as unknown as CashflowType[])?.filter(
    (ct) => ct.slug !== "balance"
  ) || [];

  // Excel export
  const { mutate: exportExcel, isPending: excelPending } = useMutation({
    mutationFn: async () => {
      const query: Record<string, string | undefined> = { kassaId: kassaId || undefined };
      if (search) query.search = search;
      if (sellerId) query.sellerId = sellerId;
      if (cashflowTypeId) query.cashflowTypeId = cashflowTypeId;
      if (startDate) query.fromDate = startDate;
      if (endDate) query.toDate = endDate;
      const params = `?${qs.stringify(query, { arrayFormat: "repeat" })}`;
      const url = import.meta.env.VITE_BASE_URL + apiRoutes.excelCashflowsExcel + params;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Export xatolik: ${response.status}`);
      }
      const blob = await response.blob();
      if (blob.type && blob.type.includes('text/html')) {
        throw new Error('Server xato javob qaytardi');
      }
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "cashflows.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    },
  });

  const clearFilters = () => {
    setSellerId(null);
    setCashflowTypeId(null);
    setStartDate(null);
    setEndDate(null);
    setFilterOpen(false);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-1">
        {/* Search */}
        {showSearch ? (
          <div className="flex items-center gap-1 bg-card rounded-sm px-3 h-10">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              autoFocus
              defaultValue={search || ""}
              onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value || null);
              }, 500)}
              className="bg-transparent border-none h-8 w-[200px] p-0 text-[14px]"
              placeholder="Qidirish..."
            />
            <X
              className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSearch(null);
                setShowSearch(false);
              }}
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-sm"
            onClick={() => setShowSearch(true)}
          >
            <Search className="w-5 h-5" />
          </Button>
        )}

        {/* Filter — popup */}
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-sm"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {hasActiveFilter && (
                <span className="absolute top-[6px] right-[6px] w-[6px] h-[6px] rounded-full bg-[#0078D4]" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[330px] p-[12px] bg-[#f5f7f9] border border-[#e7ebf0] rounded-[12px] shadow-[0px_12px_24px_0px_rgba(12,36,58,0.08)] z-[40]"
          >
            <p className="text-[15px] font-medium text-[#1a1a1a] px-[4px] mb-[10px]">
              Filter
            </p>
            <div className="flex flex-col gap-[10px]">
              {/* Seller */}
              <div>
                <p className="text-[12px] text-[#A3A3A3] mb-[4px] px-[4px]">Sotuvchi</p>
                <div className="bg-white rounded-[8px]">
                  <FilterSelect
                    name="sellerId"
                    placeholder="Sotuvchi tanlang"
                    className="w-full"
                    classNameContainer="z-[60]"
                    options={[
                      { label: "Barchasi", value: "clear" },
                      ...sellers.map((s: any) => ({
                        label: `${s.firstName} ${s.lastName}`,
                        value: s.id,
                      })),
                    ]}
                  />
                </div>
              </div>

              {/* Cashflow type */}
              <div>
                <p className="text-[12px] text-[#A3A3A3] mb-[4px] px-[4px]">Turi</p>
                <div className="bg-white rounded-[8px]">
                  <FilterSelect
                    name="cashflowTypeId"
                    placeholder="Turni tanlang"
                    className="w-full"
                    classNameContainer="z-[60]"
                    options={[
                      { label: "Barchasi", value: "clear" },
                      ...cashflowTypes.map((ct) => ({
                        label: ct.title,
                        value: ct.id,
                      })),
                    ]}
                  />
                </div>
              </div>

              {/* Date range */}
              <div>
                <p className="text-[12px] text-[#A3A3A3] mb-[4px] px-[4px]">Sana oralig'i</p>
                <div className="bg-white rounded-[8px]">
                  <DateRangePicker
                    fromPlaceholder="Dan"
                    toPlaceholder="Gacha"
                    className="max-w-full"
                  />
                </div>
              </div>

              {/* Clear */}
              {hasActiveFilter && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full mt-[4px] h-[38px] rounded-[8px]"
                >
                  Tozalash
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Excel */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-sm"
          onClick={() => exportExcel()}
          disabled={excelPending}
        >
          {excelPending ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Add buttons */}
      {showAddButtons && (
        <div className="flex items-center gap-2">
          <Button
            onClick={onAddIncome}
            className="bg-[#48B533] hover:bg-[#3da02b] text-white rounded-sm px-5 py-2.5 text-[14px] font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />
            Kirim qo'shish
          </Button>
          <Button
            onClick={onAddExpense}
            className="bg-[#E38157] hover:bg-[#d0724a] text-white rounded-sm px-5 py-2.5 text-[14px] font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />
            Chiqim qo'shish
          </Button>
        </div>
      )}
    </div>
  );
}
