import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { DollarSign, Calendar, FileOutput } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { Button } from "@/components/ui/button";
import { useYear } from "@/store/year-store";
import { useKentDetail } from "./queries";
import { KentDetailColumns } from "./columns";
import formatPrice from "@/utils/formatPrice";

export default function KentDetailPage() {
  const { debtId } = useParams();
  const { year } = useYear();
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(String(new Date().getMonth() + 1))
  );
  const [typeFilter] = useQueryState("type");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useKentDetail({
      debtId: debtId || "",
      queries: {
        year,
        month: Number(month),
        type: typeFilter === "clear" ? undefined : typeFilter || undefined,
      },
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;
  const debt = data?.pages?.[0]?.debt;

  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    window.open(
      `${baseUrl}/debt/report/excel?year=${year}&month=${month}&debtId=${debtId}`,
      "_blank"
    );
  };

  const cards = [
    { title: "Olingan", price: formatPrice(debt?.owed || 0) },
    { title: "Qaytarilgan", price: formatPrice(debt?.given || 0) },
    { title: "Qolgan", price: formatPrice(debt?.totalDebt || 0) },
  ];

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-5 h-[64px] flex items-center gap-2 border-b border-border bg-sidebar">
        <p className="text-[20px] mr-auto font-medium">
          {debt?.fullName || ""}
        </p>

        <FilterSelect
          placeholder="Oy"
          className="border-border max-w-[160px] w-full border-l"
          options={MonthsArray}
          name="month"
          icons={<Calendar size={18} />}
          defaultValue={String(new Date().getMonth() + 1)}
        />

        <FilterSelect
          className="border-border max-w-[150px] w-full border-l"
          options={[
            { label: "Hammasi", value: "clear" },
            { label: "Olingan", value: "Приход" },
            { label: "Qaytarilgan", value: "Расход" },
          ]}
          defaultValue="clear"
          placeholder="Turi"
          name="type"
        />

        <Button
          onClick={handleExport}
          variant="secondary"
          className="h-full border-l border-border rounded-none px-4"
        >
          <FileOutput size={18} />
          Export
        </Button>
      </div>

      {/* Card sort */}
      <div className="flex bg-sidebar border-b border-border">
        <div className="p-5 pl-7 w-full border-border border-r max-w-[350px]">
          <div className="flex items-center">
            <DollarSign size={48} />
            <div>
              <p className="text-[12px]">Jami qarz</p>
              <p className="text-[22px] font-bold text-foreground">
                {formatPrice(debt?.totalDebt || 0)} $
              </p>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-3">
          {cards.map((e) => (
            <div
              key={e.title}
              className="bg-sidebar h-[78px] border-border border-r border-b flex justify-between items-center px-4 py-5"
            >
              <div>
                <p className="text-[12px] mb-0.5">{e.title}</p>
                <p className="text-[15px] font-medium">{e.price} $</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Period totals */}
      {totals && (
        <div className="bg-[#EEEEEE] flex">
          <p className="p-[20px] border-border border-r text-[14px] w-full">
            Davriy balans
          </p>
          <p className="p-[20px] border-border border-r text-[14px] w-full text-[#89A143]">
            Olingan: {formatPrice(totals.total_income || 0)} $
          </p>
          <p className="p-[20px] border-border border-r text-[14px] w-full text-[#E38157]">
            Qaytarilgan: {formatPrice(totals.total_expense || 0)} $
          </p>
          <p className="p-[20px] text-[14px] w-full font-bold">
            Qolgan: {formatPrice(totals.balance || 0)} $
          </p>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={KentDetailColumns}
        data={flatData}
        isLoading={isLoading}
        isRowClickble={false}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
