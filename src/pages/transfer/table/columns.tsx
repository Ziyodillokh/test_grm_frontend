import { ColumnDef } from "@tanstack/react-table";

import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

import { TransferData } from "../type";
import { Input } from "@/components/ui/input";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { parseAsString, useQueryState } from "nuqs";

import ActionButton from "@/components/actionButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateData, UpdatePatchData } from "@/service/apiHelpers";
import { toast } from "sonner";
import { useMeStore } from "@/store/me-store";
import ActionBadge from "@/components/actionBadge";
import { TData } from "@/pages/deller/type";
import { Loader, RefreshCcw } from "lucide-react";
import TebleAvatar from "@/components/teble-avatar";
import { Button } from "@/components/ui/button";
// import { useTranslation } from "react-i18next";
// flatDataFilial
export const paymentColumns = (flatDataFilial: TData[]): ColumnDef<TransferData>[] => {
  return [
    {
      accessorKey: "id",
      header: "№",
      size: 50,
      cell: ({ row }) => {
        const group = row?.original?.group
        const [type] = useQueryState("type", parseAsString.withDefault("In"));
        const [filial] = useQueryState(
          "filial",
          parseAsString.withDefault(
            flatDataFilial?.filter((i) => i.type === "filial")?.[0]?.id || ""
          )
        );
        const [filialTo] = useQueryState(
          "filialTo",
          parseAsString.withDefault(
            flatDataFilial?.filter((i) => i.type === "filial")?.[1]?.id || ""
          )
        );
        const { meUser } = useMeStore();
        const queryClient = useQueryClient();
        const { mutate, isPending } = useMutation({
          mutationFn: () =>
            UpdateData(apiRoutes.transferAccept, "", {
              from: meUser?.position.role === 9 ? filial : type == "In" ? filial : meUser?.filial?.id,
              to: meUser?.position.role === 9 ? filialTo : type == "In" ? meUser?.filial?.id : filial,
              include: [`${group}=group`], exclude: [],
            }),
          onSuccess: () => {
            toast.success("Accepted");
            queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
            queryClient.invalidateQueries({ queryKey: [apiRoutes.transfers] });

          },
        });

        if (row.original?.type === "header") {
          return <div className="absolute top-7 bg-background left-0 px-2 gap-2 py-2 w-full  flex items-center ">
            <TebleAvatar size={38} url={row?.original?.transferer?.avatar?.path} name={row?.original?.transferer?.firstName} status="none" />
            <RefreshCcw size={14} />
            <TebleAvatar size={38} url={row?.original?.courier?.avatar?.path} name={row.original?.courier?.firstName} status="none" />
            {/* <p>{ group?.split('-')?.[0]}</p> */}
            <p className="ml-8 ">{group?.split('-')?.[1]} шт</p>
            <p >{Number(group?.split('-')?.[2] || 0)?.toFixed(2)} м²</p>
            <p className="ml-auto opacity-40">{group?.split('-')?.[3]} </p>
            {type == "In" && <Button onClick={() => mutate()} disabled={isPending} variant={"outline"} className="border ml-2 rounded-lg py-[6px] px-[12px] h-[26px] text-[12px] border-[#89A143] text-[#89A143]  ">Принять все </Button>}
          </div>;
        }
        return <p>{row?.original?.number}</p>;
      }
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
      header: "Обьём",
      id: "product.bar_code.shape.title",
      accessorKey: "product.bar_code.shape.title",
      cell: ({ row }) => {
        if (row.original?.type === "header") {
          return null
        }
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
      header: "count",
      cell: ({ row }) => {
        if (row.original?.type === "header") {
          return null
        }
        return <p >{row.original.count} x</p>;
      },
    },

    {
      header: "Статус",
      cell: ({ row }) => {
        if (row.original?.type === "header") {
          return <div className="h-14"></div>
        }
        const [type] = useQueryState("type", parseAsString.withDefault("In"));
        const [filial] = useQueryState(
          "filial",
          parseAsString.withDefault(
            flatDataFilial?.filter((i) => i.type === "filial")?.[0]?.id || ""
          )
        );
        const [filialTo] = useQueryState(
          "filialTo",
          parseAsString.withDefault(
            flatDataFilial?.filter((i) => i.type === "filial")?.[1]?.id || ""
          )
        );
        const { meUser } = useMeStore();
        const queryClient = useQueryClient();
        const status = row?.original?.progres;

        const { mutate, isPending } = useMutation({
          mutationFn: () =>
            UpdateData(apiRoutes.transferAccept, "", {
              from: meUser?.position.role === 9 ? filial : type == "In" ? filial : meUser?.filial?.id,
              to: meUser?.position.role === 9 ? filialTo : type == "In" ? meUser?.filial?.id : filial,
              include: [row?.original?.id], exclude: [],
            }),
          onSuccess: () => {
            toast.success("Accepted");
            queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
            queryClient.invalidateQueries({ queryKey: [apiRoutes.transfers] });

          },
        });

        const isRejected = status === "Rejected";
        const isAccepted = status === "Accepted";
        const isRole9 = meUser?.position?.role === 9;
        const isAcceptedFinalIn = (type == "In" && status == "Accepted_F");
        // const isProcessingOut =  (type == "Out" && status == "Processing");
        if (isRejected) {
          return <ActionBadge status="rejected" />;
        }

        if (isRole9) {
          const role9Status = isAccepted ? "accepted" : "inProgress";
          return <ActionBadge status={role9Status} />;
        }

        if (isAccepted && type != "Out") {
          return <ActionBadge status="accepted" />;
        }

        if (isAcceptedFinalIn) {
          return <ActionButton onClick={() => mutate()} isLoading={isPending} status={"accept"} btnText={"Принять"} />;
        }

        return <ActionBadge status="inProgress" />;


      },
    },
    {
      id: "actions",
      enableHiding: true,
      header: () => <div className="text-right">{"actions"}</div>,
      size: 50,
      cell: ({ row }) => {
        if (row.original?.type === "header") {
          return null
        }
        const queryClient = useQueryClient();
        const { mutate, isPending } = useMutation({
          mutationFn: () =>
            UpdatePatchData(apiRoutes.transferReject, row?.original?.id, {}),
          onSuccess: () => {
            toast.success("canceled");
            queryClient.invalidateQueries({ queryKey: [apiRoutes.transfers] });
          },
        });
        return (
          <TableAction
            url={apiRoutes.transfers}
            id={row.original?.id}
            ShowDelete={false}
            ShowUpdate={false}

          >
            <DropdownMenuItem disabled={isPending} onClick={() => mutate()}>
              {isPending ? <Loader /> : ""}Отменить
            </DropdownMenuItem>
          </TableAction>
        );
      },
    },
  ];
}

export const collactionColumns: ColumnDef<TransferData>[] = [
  {
    accessorKey: "id",
    header: "№",
    size: 50,
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },

  {
    header: "Коллекция",
    cell: () => {
      return <p>Doku</p>;
    },
  },
  {
    header: "Обём",
    cell: () => {
      return <p>230 м²</p>;
    },
  },
  {
    header: "Cумма",
    cell: () => {
      return <p>980 $</p>;
    },
  },
  {
    header: "Цена",
    cell: () => {
      const [type] = useQueryState("type");
      return type == "New" ? (
        <Input className="w-[60px] py-0" placeholder="0$" />
      ) : (
        <p className="w-[60px] py-2">980 $</p>
      );
    },
  },
  {
    header: "Кол-во",
    cell: () => {
      return <p>6 шт</p>;
    },
  },
  {
    header: "Статус",
    cell: () => {
      return <p>~</p>;
    },
  },

  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return (
        <TableAction
          url={apiRoutes.transfers}
          ShowDelete={false}
          ShowUpdate={false}
          id={row.original?.id}
        >
          <DropdownMenuItem>Отменить</DropdownMenuItem>
        </TableAction>
      );
    },
  },
];
