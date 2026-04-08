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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
    (ct) => ct.slug !== "Balance"
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
      const blob = await response.blob();
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
          <div className="flex items-center gap-1 bg-card rounded-lg px-3 h-10">
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
            className="rounded-lg"
            onClick={() => setShowSearch(true)}
          >
            <Search className="w-5 h-5" />
          </Button>
        )}

        {/* Filter */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-lg ${hasActiveFilter ? "text-[#89A143]" : ""}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[340px] p-4">
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              {/* Seller */}
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Sotuvchi</p>
                <FilterSelect
                  name="sellerId"
                  placeholder="Sotuvchi tanlang"
                  className="w-full"
                  options={[
                    { label: "Barchasi", value: "clear" },
                    ...sellers.map((s: any) => ({
                      label: `${s.firstName} ${s.lastName}`,
                      value: s.id,
                    })),
                  ]}
                />
              </div>

              {/* Cashflow type */}
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Turi</p>
                <FilterSelect
                  name="cashflowTypeId"
                  placeholder="Turni tanlang"
                  className="w-full"
                  options={[
                    { label: "Barchasi", value: "clear" },
                    ...cashflowTypes.map((ct) => ({
                      label: ct.title,
                      value: ct.id,
                    })),
                  ]}
                />
              </div>

              {/* Date range */}
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Sana oralig'i</p>
                <DateRangePicker
                  fromPlaceholder="Dan"
                  toPlaceholder="Gacha"
                  className="max-w-full"
                />
              </div>

              {/* Clear */}
              {hasActiveFilter && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full mt-2"
                >
                  Tozalash
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Excel */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg"
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
            className="bg-[#48B533] hover:bg-[#3da02b] text-white rounded-lg px-5 py-2.5 text-[14px] font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />
            Kirim qo'shish
          </Button>
          <Button
            onClick={onAddExpense}
            className="bg-[#E38157] hover:bg-[#d0724a] text-white rounded-lg px-5 py-2.5 text-[14px] font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />
            Chiqim qo'shish
          </Button>
        </div>
      )}
    </div>
  );
}
