import { parseAsInteger, useQueryState } from "nuqs";
import { CellContext } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";

import CreateStatementModal from "../form/CreateStatementModal";
import { StatementColumns } from "./columns";
import Filters from "./filters";
import useStatementsData from "./queries";
import { useDeleteStatement } from "./mutations";
import { ActionCell } from "./ActionCell";
import { Statement } from "../type";
import { useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";

export default function Page() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [status] = useQueryState("status");
  const [startDate] = useQueryState("startDate");
  const [endDate] = useQueryState("endDate");
  const [search] = useQueryState("search");
  const [id, setId] = useQueryState("id");
  const [deleteId, setDeleteId] = useQueryState("deleteId");
  const queryClient = useQueryClient();
  const deleteStatement = useDeleteStatement();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useStatementsData({
      queries: {
        limit,
        page,
        status: status || undefined,
        startDate: startDate || undefined,   
        endDate: endDate || undefined,
        search: search || undefined,
      },
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  const handleDelete = async () => {
    if (deleteId) {
      await deleteStatement.mutateAsync(deleteId);
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.payrolls] });
    }
  };

  const handleEditClick = (id: string) => {
    setId(id);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  return (
    <>
      <Filters />

      <DataTable
        className="m-4"
        isLoading={isLoading}
        columns={StatementColumns.map(col => 
          col.id === 'actions' 
            ? { ...col, cell: (props: CellContext<Statement, unknown>) => <ActionCell {...props} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} /> }
            : col
        )}
        data={flatData ?? []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        isRowClickble
      />

      <CreateStatementModal isOpen={Boolean(id) } onClose={() => setId(null)} />


      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-[596px] p-0 bg-card">
          <DialogHeader>
            <DialogTitle>Удалить ведомость</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить эту ведомость? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleteStatement.isPending}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteStatement.isPending}
            >
              {deleteStatement.isPending ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
