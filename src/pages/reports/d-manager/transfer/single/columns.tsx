import TebleAvatar from "@/components/teble-avatar";
import { TransferCollectionDealerData, TransferDealerData } from "../type";
import { Loader, RefreshCcw } from "lucide-react";
import { apiRoutes } from "@/service/apiRoutes";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TableAction from "@/components/table-action";
import { AddData, DeleteData, getAllData } from "@/service/apiHelpers";
import { ColumnDef } from "@tanstack/react-table";
import ActionBadge from "@/components/actionBadge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import debounce from "@/utils/debounce";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Helper: get status from either 'progres' or 'progress' field and map to ActionBadge values
const statusMap: Record<string, string> = {
  Processing: "inprogress",
  Accepted: "accepted",
  Rejected: "rejected",
  Returned: "rejected",
};
const getStatus = (row: any) => {
  const raw = row?.progres || row?.progress || "";
  return statusMap[raw] || raw.toLowerCase();
};
const getRawStatus = (row: any) => row?.progres || row?.progress || "";

export const ListColumns: ColumnDef<TransferDealerData>[] = [
  {
    accessorKey: "id",
    header: "№",
    size: 50,
    cell: ({ row }) => {
      const group = row?.original?.group;
      if (row.original?.type === "header") {
        return (
          <div className="absolute top-7 bg-sidebar left-0 px-2 gap-2 py-2 w-full  flex items-center ">
            <TebleAvatar
              size={38}
              url={row?.original?.transferer?.avatar?.path}
              name={row?.original?.transferer?.firstName || ""}
              status="none"
            />
            <RefreshCcw size={14} />
            <TebleAvatar
              size={38}
              url={row?.original?.courier?.avatar?.path}
              name={row?.original?.courier?.firstName || ""}
              status="none"
            />
            <p className="ml-8 ">{(row?.original as any)?.activeCount ?? (group?.split("-")?.[1] || "0")} шт</p>
            <p>{Number((row?.original as any)?.activeKv ?? (group?.split("-")?.[2] || 0))?.toFixed(2)} м²</p>
            <p className="ml-auto">{group?.split("-")?.[3] || ""} </p>
          </div>
        );
      }
      return <p>{row?.original?.number}</p>;
    },
  },
  {
    header: "collection",
    id: "product.bar_code.collection.title",
    accessorKey: "product.bar_code.collection.title",
  },
  {
    header: "model",
    id: "product.bar_code.model.title",
    accessorKey: "product.bar_code.model.title",
  },
  {
    header: "size",
    id: "product.bar_code.size.title",
    accessorKey: "product.bar_code.size.title",
  },
  {
    header: "Обьём м²",
    id: "лм",
    cell: ({ row }) => {
      const sizeX = Number(row.original?.product?.bar_code?.size?.x || 0);
      const isMetric = row.original?.product?.bar_code?.isMetric;
      const count = Number(row.original?.count || 0);
      const productY = Number(row.original?.product?.y || 0);
      const kv = isMetric ? sizeX * (count / 100) : sizeX * count * productY;
      return <p>{kv.toFixed(2)} м²</p>;
    },
  },

  {
    header: "shape",
    id: "product.bar_code.shape.title",
    accessorKey: "product.bar_code.shape.title",
  },
  {
    header: "style",
    id: "product.bar_code.style.title",
    accessorKey: "product.bar_code.style.title",
  },
  {
    header: "color",
    id: "product.bar_code.color.title",
    accessorKey: "product.bar_code.color.title",
  },
  {
    header: "country",
    id: "product.bar_code.country.title",
    accessorKey: "product.bar_code.country.title",
  },
  {
    header: "Статус",
    cell: ({ row }) => {
      const status = getStatus(row?.original);

      if (row.original?.type === "header") {
        return <div className="h-14"></div>;
      }
      return (
        <ActionBadge status={status} />
      );
    },
  },
  {
    header: "count",
    cell: ({ row }) => {
      if (row.original?.type === "header") {
        return null;
      }
      return <p>{row.original?.count || 0} x</p>;
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      if (row.original?.type === "header") {
        return null;
      }
      const { package_id } = useParams();
      const queryClient = useQueryClient();
      const rawStatus = getRawStatus(row?.original);
      const transferId = row?.original?.id;

      const [returnOpen, setReturnOpen] = useState(false);
      const [selectedFilialId, setSelectedFilialId] = useState<string>("");

      // Fetch filials (warehouse + filial) for return target selection
      const { data: filialsData } = useQuery({
        queryKey: [apiRoutes.filialWarehouse],
        queryFn: () =>
          getAllData<any, any>(apiRoutes.filialWarehouse, { limit: 100, page: 1 }),
        enabled: returnOpen,
      });
      const filials = filialsData?.items || filialsData || [];

      // Cancel — Processing (paket tasdiqlanishidan oldin)
      const { mutate: cancelMutate, isPending: cancelPending } = useMutation({
        mutationFn: () =>
          DeleteData(
            `package-transfer/${package_id}/transfer`,
            transferId
          ),
        onSuccess: () => {
          toast.success("Отменено");
          queryClient.invalidateQueries({
            queryKey: [apiRoutes.transferDealer],
          });
        },
      });

      // Return — for Accepted (after package accepted)
      const { mutate: returnMutate, isPending: returnPending } = useMutation({
        mutationFn: (targetFilialId: string) =>
          AddData(
            `package-transfer/${package_id}/transfer/${transferId}/return`,
            { targetFilialId }
          ),
        onSuccess: () => {
          toast.success("Возврат выполнен");
          setReturnOpen(false);
          setSelectedFilialId("");
          queryClient.invalidateQueries({
            queryKey: [apiRoutes.transferDealer],
          });
        },
      });

      const canCancel = rawStatus === "Processing";
      const canReturn = rawStatus === "Accepted";

      return (
        <>
          <TableAction
            url={apiRoutes.transfers}
            id={row.original?.id}
            ShowDelete={false}
            ShowUpdate={false}
          >
            {canCancel && (
              <DropdownMenuItem disabled={cancelPending} onClick={() => cancelMutate()}>
                {cancelPending ? <Loader className="mr-1 h-4 w-4 animate-spin" /> : null}Отменить
              </DropdownMenuItem>
            )}
            {canReturn && (
              <DropdownMenuItem onClick={() => setReturnOpen(true)}>
                Возврат
              </DropdownMenuItem>
            )}
          </TableAction>

          <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Филиал танланг</DialogTitle>
              </DialogHeader>
              <div className="max-h-[300px] overflow-y-auto flex flex-col gap-1 p-4">
                {filials.map((f: any) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFilialId(f.id)}
                    className={`flex items-center gap-2 rounded-sm border px-3 py-2 text-sm text-left transition-colors ${
                      selectedFilialId === f.id
                        ? "border-primary bg-primary/10 font-medium"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {f.title || f.name}
                  </button>
                ))}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setReturnOpen(false)}
                >
                  Бекор
                </Button>
                <Button
                  disabled={!selectedFilialId || returnPending}
                  onClick={() => returnMutate(selectedFilialId)}
                >
                  {returnPending ? <Loader className="mr-1 h-4 w-4 animate-spin" /> : null}
                  Қайтариш
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
export const collactionColumns: ColumnDef<TransferCollectionDealerData>[] = [
  {
    accessorKey: "id",
    header: "№",
    size: 50,
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    header: "Название",
    id: "title",
    accessorKey: "title",
  },

  {
    header: "count",
    id: "total_count",
    accessorKey: "total_count",
    cell: ({ row }) => {
      return <p>{row.original?.total_count || 0}  шт</p>;
    },
  },

  {
    header: "Обёm",
    id: "total_kv",
    cell: ({ row }) => {
      return <p>{Number(row.original?.total_kv || 0).toFixed(2)} м²</p>;
    },
  },
  {
    header: "Сумма",
    cell: ({ row }) => {
      const [localPrice] = useQueryState(
        "localPrice",
        parseAsInteger.withDefault(Number((row?.original as any)?.dealerPriceMeter) || 0)
      );
      const [changeId] = useQueryState(
        "changeId",
        parseAsString
      );
      const price = changeId == row?.original?.id ? localPrice : Number((row?.original as any)?.dealerPriceMeter || 0);
      const kv = Number(row.original?.total_kv || 0);
      return (
        <>
          <p>{(price * kv).toFixed(1)}$</p>
        </>
      );
    },
  },

  {
    header: "Касса цена",
    id: "priceMeter",
    cell: ({ row }) => {
      return <p>{Number((row.original as any)?.priceMeter || 0).toFixed(0)} $</p>;
    },
  },

  {
    header: "Цена за м²",
    cell: ({ row }) => {
      const { package_id } = useParams();
      const queryClient = useQueryClient();
      const [, setLocalPrice] = useQueryState(
        "localPrice",
        parseAsInteger.withDefault(Number((row?.original as any)?.dealerPriceMeter) || 0)
      );
      const [, setChangeId] = useQueryState(
        "changeId",
        parseAsString
      );

      const { mutate } = useMutation({
        mutationFn: ({ price }: { price: number }) =>
          AddData(apiRoutes.transferGivePrice,  {
              collection: row?.original?.id,
              price,
              package_id,
            },
          ),
        onSuccess: () => {
          toast.success("changed");
          queryClient.invalidateQueries({ queryKey: [apiRoutes.transferDealer] });
        },
      });
      return (
        <Input
          defaultValue={Number((row?.original as any)?.dealerPriceMeter) || undefined}
          className="w-[120px]"
          onChange={debounce((e) => {
            mutate({
              price: Number(e?.target.value),
            });
            setLocalPrice(Number(e?.target.value))
            setChangeId(row?.original?.id)
          }, 900)}
          placeholder="0"
          type="number"
        />
      );
    },
  },


];
