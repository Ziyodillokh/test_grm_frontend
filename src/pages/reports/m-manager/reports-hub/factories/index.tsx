import { useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ShadcnSelect from "@/components/Select";
import { useYear } from "@/store/year-store";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";
import { useFactoryReport, useFactoryNotReportEnabled } from "./queries";
import { FactoryColumns } from "./columns";
import FactoryFilter from "./filter";
import { FactoryReportItem } from "./type";

export default function FactoryReportPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { year } = useYear();
  const [search] = useQueryState("search");
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(20));
  const [addFactoryId, setAddFactoryId] = useState<string | undefined>();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFactoryReport({
      queries: {
        year,
        search: search || undefined,
        limit,
      },
    });

  const { data: notEnabledFactories } = useFactoryNotReportEnabled();

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;

  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    window.open(
      `${baseUrl}/factory/report/excel?year=${year}`,
      "_blank"
    );
  };

  const handleToggleReport = async (factoryId: string) => {
    await api.patch(`/factory/${factoryId}/toggle-report`);
    queryClient.invalidateQueries({ queryKey: [apiRoutes.factoryDebtReport] });
    queryClient.invalidateQueries({
      queryKey: [apiRoutes.factoryNotReportEnabled],
    });
  };

  const handleAddFactory = async (factoryId: string | undefined) => {
    if (!factoryId) return;
    setAddFactoryId(undefined);
    await handleToggleReport(factoryId);
  };

  const columnsWithActions = [
    ...FactoryColumns,
    {
      id: "actions",
      cell: ({ row }: { row: { original: FactoryReportItem } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleToggleReport(row.original.id);
              }}
              className="text-red-600"
            >
              Olib tashlash
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const factoryOptions =
    (notEnabledFactories as any[])?.map((f: any) => ({
      value: f.id,
      label: f.title,
    })) || [];

  return (
    <div>
      <div className="bg-sidebar border-border border-b h-[64px] flex items-center px-4 gap-3">
        <div className="w-[280px]">
          <ShadcnSelect
            value={addFactoryId}
            options={factoryOptions}
            placeholder="Zavod qo'shish..."
            onChange={handleAddFactory}
          />
        </div>
      </div>

      <FactoryFilter
        totals={totals}
        showExport={true}
        onExport={handleExport}
      />

      <DataTable
        columns={columnsWithActions}
        data={flatData}
        isLoading={isLoading}
        isRowClickble={false}
        onRowClick={(row) =>
          navigate(`/m-manager/reports-hub/factories/${row.id}`)
        }
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
