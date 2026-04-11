import { useState } from "react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useYear } from "@/store/year-store";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";
import { useCustomsReport } from "./queries";
import { CustomsColumns } from "./columns";
import CustomsFilter from "./filter";

export default function CustomsReportPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { year } = useYear();
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(String(new Date().getMonth() + 1))
  );
  const [search] = useQueryState("search");
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(20));

  const [newTitle, setNewTitle] = useState("");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCustomsReport({
      queries: {
        year,
        month: Number(month),
        search: search || undefined,
        limit,
      },
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;

  const { mutate: createCustoms, isPending: isCreating } = useMutation({
    mutationFn: (title: string) =>
      api.post(apiRoutes.customs, { title }),
    onSuccess: () => {
      toast.success("Bojxona kompaniya qo'shildi");
      setNewTitle("");
      queryClient.invalidateQueries({
        queryKey: [apiRoutes.customsReport],
      });
    },
    onError: () => {
      toast.error("Xatolik yuz berdi");
    },
  });

  const handleCreate = () => {
    const title = newTitle.trim();
    if (!title) {
      toast.error("Nomini kiriting");
      return;
    }
    createCustoms(title);
  };

  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    window.open(
      `${baseUrl}/bojxona/report/excel?year=${year}&month=${month}`,
      "_blank"
    );
  };

  return (
    <div>
      <CustomsFilter
        totals={totals}
        showExport={true}
        onExport={handleExport}
      />

      {/* Add customs input */}
      <div className="flex items-center gap-2 p-3 bg-sidebar border-b border-border">
        <Input
          placeholder="Bojxona kompaniya nomi..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="max-w-[300px] h-9"
        />
        <Button
          onClick={handleCreate}
          disabled={isCreating || !newTitle.trim()}
          size="sm"
          className="h-9"
        >
          {isCreating ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Qo'shish
        </Button>
      </div>

      <DataTable
        columns={CustomsColumns}
        data={flatData}
        isLoading={isLoading}
        isRowClickble={true}
        onRowClick={(row) =>
          navigate(`/m-manager/reports-hub/bojxona/${row.id}`)
        }
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
