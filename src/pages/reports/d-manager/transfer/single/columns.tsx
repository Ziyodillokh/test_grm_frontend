import TebleAvatar from "@/components/teble-avatar";
import { TransferCollectionDealerData, TransferDealerData } from "../type";
import { Loader, RefreshCcw } from "lucide-react";
import { apiRoutes } from "@/service/apiRoutes";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TableAction from "@/components/table-action";
import { AddData, UpdatePatchData } from "@/service/apiHelpers";
import { ColumnDef } from "@tanstack/react-table";
import ActionBadge from "@/components/actionBadge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import debounce from "@/utils/debounce";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

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
              name={row?.original?.transferer?.firstName}
              status="none"
            />
            <RefreshCcw size={14} />
            <TebleAvatar
              size={38}
              url={row?.original?.courier?.avatar?.path}
              name={row.original?.courier?.firstName}
              status="none"
            />
            <p className="ml-8 ">{group?.split("-")?.[1]} шт</p>
            <p>{Number(group?.split("-")?.[2] || 0)?.toFixed(2)} м²</p>
            <p className="ml-auto">{group?.split("-")?.[3]} </p>
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
      return (
        <p>
          {`${(row.original?.product?.bar_code?.size?.x * (row.original.product?.bar_code?.isMetric ? +row.original.count / 100 : +row.original.count * +row.original?.product?.y)).toFixed(2)}`}
          м²
        </p>
      );
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
      const status = row?.original?.progres;

      if (row.original?.type === "header") {
        return <div className="h-14"></div>;
      }
      return (
        <ActionBadge status={status == "Accepted_F" ? "pending" : status} />
      );
    },
  },
  {
    header: "count",
    cell: ({ row }) => {
      if (row.original?.type === "header") {
        return null;
      }
      return <p>{row.original.count} x</p>;
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
      const queryClient = useQueryClient();
      const { mutate, isPending } = useMutation({
        mutationFn: () =>
          UpdatePatchData(
            apiRoutes.transferRejectDealer,
            row?.original?.id,
            {}
          ),
        onSuccess: () => {
          toast.success("canceled");
          queryClient.invalidateQueries({
            queryKey: [apiRoutes.transferDealer],
          });
        },
      });
      return (
        <TableAction
          url={apiRoutes.transfers}
          id={row.original?.id}
          ShowDelete={false}
          ShowUpdate={false}
        >
          {row?.original?.progres == "Accepted_F" && (
            <DropdownMenuItem disabled={isPending} onClick={() => mutate()}>
              {isPending ? <Loader /> : ""}Отменить
            </DropdownMenuItem>
          )}
        </TableAction>
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
      return <p>{row.index}</p>;
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
      return <p>{row.original?.total_count}  шт</p>;
    },
  },

  {
    header: "Обёm",
    id: "total_kv",
    cell: ({ row }) => {
      return <p>{Number(row.original?.total_kv).toFixed(2)} м²</p>;
    },
  },
  {
    header: "Сумма",
    cell: ({ row }) => {
      const [localPrice] = useQueryState(
        "localPrice",
        parseAsInteger.withDefault(+row?.original?.comingPrice || 0)
      );
      const [changeId] = useQueryState(
        "changeId",
        parseAsString
      );
      return (
        <>
          <p>{(Number(changeId == row?.original?.id ?localPrice :row?.original?.comingPrice) * Number(row.original?.total_kv)).toFixed(1)}$</p>
        </>
      );
    },
  },

  {
    header: "Нavar",
    id: "total_profit_sum",
    cell: ({ row }) => {
      return <p>{Number(row.original?.total_profit_sum).toFixed(2)} $</p>;
    },
  },
  
  {
    header: "Цена за м²",
    cell: ({ row }) => {
      const { package_id } = useParams();
      const queryClient = useQueryClient();
      const [, setLocalPrice] = useQueryState(
        "localPrice",
        parseAsInteger.withDefault(+row?.original?.comingPrice || 0)
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
          defaultValue={+row?.original?.comingPrice || undefined}
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
