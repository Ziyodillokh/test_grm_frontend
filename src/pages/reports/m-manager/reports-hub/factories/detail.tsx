import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { DollarSign, Calendar, FileOutput } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { Button } from "@/components/ui/button";
import { useYear } from "@/store/year-store";
import { useFactoryDetail } from "./queries";
import { FactoryDetailColumns } from "./columns";
import formatPrice from "@/utils/formatPrice";

export default function FactoryDetailPage() {
  const { factoryId } = useParams();
  const { year } = useYear();
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(String(new Date().getMonth() + 1))
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFactoryDetail({
      factoryId: factoryId || "",
      queries: {
        year,
        month: Number(month),
      },
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;
  const factory = data?.pages?.[0]?.factory;

  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    window.open(
      `${baseUrl}/factory/report/excel?year=${year}&month=${month}&factoryId=${factoryId}`,
      "_blank"
    );
  };

  const cards = [
    { title: "Olingan", price: formatPrice(factory?.owed || 0) },
    { title: "To'langan", price: formatPrice(factory?.given || 0) },
    { title: "Qolgan", price: formatPrice(factory?.totalDebt || 0) },
  ];

  return (
    <div>
      {/* Header */}
      <div className="px-5 h-[64px] flex items-center gap-2 border-b border-border bg-sidebar">
        <p className="text-[20px] mr-auto font-medium">
          {factory?.title || ""}
        </p>

        <FilterSelect
          placeholder="Oy"
          className="border-border max-w-[160px] w-full border-l"
          options={MonthsArray}
          name="month"
          icons={<Calendar size={18} />}
          defaultValue={String(new Date().getMonth() + 1)}
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
                {formatPrice(factory?.totalDebt || 0)} $
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
          <p className="p-[20px] border-border border-r text-[14px] w-full text-[#FF6600]">
            Olingan: {formatPrice(totals.period_owed || 0)} $
          </p>
          <p className="p-[20px] border-border border-r text-[14px] w-full text-[#89A143]">
            To'langan: {formatPrice(totals.period_given || 0)} $
          </p>
          <p className="p-[20px] text-[14px] w-full font-bold">
            Qolgan: {formatPrice(totals.period_balance || 0)} $
          </p>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={FactoryDetailColumns}
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
