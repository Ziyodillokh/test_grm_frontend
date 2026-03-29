import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Loader2,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  RefreshCcw,
} from "lucide-react";

import TableAction from "@/components/table-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRoutes } from "@/service/apiRoutes";

import { TData } from "../type";
import { Button } from "@/components/ui/button";
import { KassaItem } from "@/pages/cashier/report/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PatchData } from "@/service/apiHelpers";
import { toast } from "sonner";
import { minio_img_url } from "@/constants";

export const Columns: ColumnDef<TData>[] = [
  {
    header: "Дата",
    accessorKey: "date",

    cell: ({ row }) => {
      return <p>{format(row.original.date, "d-MMMM")} </p>;
    },
  },
  {
    header: "Наличие",
    accessorKey: "price",

    cell: ({ row }) => {
      return <p className="text-[#89A143] text-nowrap ">{row.original.price} $</p>;
    },
  },
  {
    header: "Онлайн",
    accessorKey: "price",

    cell: ({ row }) => {
      return <p className="text-[#58A0C6]">{row.original.price} $</p>;
    },
  },
  {
    header: "Тип",
    cell: ({ row }) => {
      return (
        <div className="flex">
          <p
            className={`${row.original.type === "Приход" ? "border-[#89A143] text-[#89A143]" : "border-[#E38157] text-[#E38157]"} rounded-4xl px-[14px]  min-w-[100px] text-center py-3 border `}
          >
            {row.original?.cashflow_type?.title}
          </p>
        </div>
      );
    },
  },
  {
    header: "collection",
    accessorKey: "collection.title",
    cell: ({ row }) => {
      return (
        <p>
          {row.original?.comment ? (
            <div className="flex gap-1 items-center text-[#5D5D5380]">
              <MessageSquareText size={16} />
              {row.original?.comment}
            </div>
          ) : (
            row.original?.collection?.title
          )}
        </p>
      );
    },
  },
  {
    header: "model",
    accessorKey: "model.title",
  },
  {
    header: "size",
    accessorKey: "size.title",
  },
  {
    header: "Филиал",
    accessorKey: "filial.title",
  },
  {
    header: "Продавец",
    accessorKey: "sller.title",
  },
  {
    header: "Кассир",
    accessorKey: "casher.title",
  },
  {
    header: "Время",
    accessorKey: "date",

    cell: ({ row }) => {
      return <p>{format(row.original.date, "HH:mm")} </p>;
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return <TableAction url={apiRoutes.qrBase} id={row.original?.id} />;
    },
  },
];
export const ColumnsFManager: ColumnDef<TData>[] = [
  {
    header: "Дата",
    accessorKey: "date",

    cell: ({ row }) => {
      return <p>{format(row.original.date, "d-MMMM")} </p>;
    },
  },
  {
    header: "Сумма",
    accessorKey: "price",

    cell: ({ row }) => {
      return <p className="text-[#89A143]">{row.original.price} $</p>;
    },
  },
  {
    header: "Терминал",
    accessorKey: "price",

    cell: ({ row }) => {
      return <p className="text-[#58A0C6]">{row.original.price} $</p>;
    },
  },
  {
    header: "Скидка",
    accessorKey: "price",

    cell: () => {
      return <p className="text-[#E38157]">0 $</p>;
    },
  },

  {
    header: "Навар",
    accessorKey: "collection.title",
  },
  {
    header: "Объём",
    accessorKey: "model.title",
  },
  {
    header: "Приход",
    accessorKey: "size.title",
  },
  {
    header: "Расход",
    accessorKey: "filial.title",
  },
  {
    header: "Инкассация",
    accessorKey: "sller.title",
  },
  {
    header: "Кассир",
    accessorKey: "casher.title",
  },
  {
    header: "Статус",
    accessorKey: "date",

    cell: ({ row }) => {
      return (
        <div className="flex">
          <p
            className={`${row.original.type === "Приход" ? "border-[#89A143] text-[#89A143]" : "border-[#E38157] text-[#E38157]"} min-w-[120px] rounded-4xl px-[14px]  w-[100px] text-center py-3 border `}
          >
            {row.original.tip === "order" ? "В процессе" : "Принято"}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return <TableAction url={apiRoutes.qrBase} id={row.original?.id} />;
    },
  },
];
export const ColumnsDManagerMonthly: ColumnDef<TData>[] = [
  {
    header: "Дата",
    accessorKey: "date",

    cell: ({ row }) => {
      return (
        <p className="min-w-[120px]">{format(row.original.date, "MMMM")} </p>
      );
    },
  },
  {
    header: "Отправлено",
    accessorKey: "price",
    cell: () => {
      return <p>432 м² </p>;
    },
  },
  {
    header: "Получено",
    accessorKey: "price",
    cell: () => {
      return <p>432 м² </p>;
    },
  },
  {
    header: "Итого",
    cell: () => {
      return <p>0 $</p>;
    },
  },

  {
    header: "Получено",
    accessorKey: "size.title",
    cell: () => {
      return <p>50 450 $ </p>;
    },
  },
  {
    header: "Навар",
    accessorKey: "filial.title",
    cell: () => {
      return <p>67 890 $ </p>;
    },
  },
  {
    header: "Расход",
    accessorKey: "sller.title",
    cell: ({ row }) => {
      return <p className="text-[#E38157]">{row.original.price} $</p>;
    },
  },
  {
    header: "Менеджера",
    accessorKey: "casher.title",
    cell: () => {
      return (
        <div className="flex gap-1 justify-start">
          <Avatar className="w-10 h-10">
            <AvatarImage src={undefined} />
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
          <Avatar className="w-10 h-10">
            <AvatarImage src={"/images/image.png"} />
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    header: "Статус",
    accessorKey: "date",
    size: 40,
    cell: ({ row }) => {
      return (
        <div className="flex ">
          <p
            className={`${row.original.type === "Приход" ? "border-[#89A143] text-[#89A143]" : "border-[#E38157] text-[#E38157]"}  rounded-4xl px-[14px]   text-center py-3 border `}
          >
            {row.original.tip === "order" ? "В процессе" : "Принято"}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return <TableAction url={apiRoutes.qrBase} id={row.original?.id} />;
    },
  },
];
export const ColumnsDManager: ColumnDef<TData>[] = [
  {
    header: "Дата",
    accessorKey: "date",

    cell: ({ row }) => {
      return (
        <div
          className={`${row?.original?.type === "Приход" ? (row?.original?.cashflow_type?.title === "Трансфер" ? "bg-[#94C3DC]" : "bg-[#89A143]") : " bg-[#E38157]"} w-12 h-12 flex justify-center items-center`}
        >
          {row.original?.cashflow_type?.title === "Трансфер" ? (
            <RefreshCcw color="white" width={24} height={24} />
          ) : (
            <Plus color="white" width={24} height={24} />
          )}
        </div>
      );
    },
  },
  {
    header: "Сумма",
    accessorKey: "price",
    cell: ({ row }) => {
      return (
        <p
          className={`${row.original?.type === "Приход" ? (row.original?.cashflow_type?.title === "Трансфер" ? " text-[#94C3DC]" : " text-[#89A143]") : " text-[#E38157]"}`}
        >
          {row.original?.type === "Приход" ? "+" : "-"}
          {row.original.price} $
        </p>
      );
    },
  },
  {
    header: "Тип",
    accessorKey: "price",

    cell: ({ row }) => {
      return (
        <div className="flex">
          <p
            className={`${row.original?.type === "Приход" ? (row.original?.cashflow_type?.title === "Трансфер" ? "border-[#94C3DC] text-[#94C3DC]" : "border-[#89A143] text-[#89A143]") : "border-[#E38157] text-[#E38157]"} rounded-4xl px-[14px]  min-w-[100px] text-center py-3 border `}
          >
            {row.original?.tip === "order"
              ? "Приход"
              : row.original?.cashflow_type?.title}
          </p>
        </div>
      );
    },
  },
  {
    header: "Время",
    accessorKey: "date",

    cell: ({ row }) => {
      return <p>{format(row.original.date, "HH:mm")} </p>;
    },
  },

  {
    header: "Обём",
    accessorKey: "size.title",
    cell: () => {
      return <p>~</p>;
    },
  },

  {
    header: "Комментарии",
    accessorKey: "sller.title",
    cell: ({ row }) => {
      return (
        <p>
          {row.original?.comment ? (
            <div className="flex gap-1 items-center text-[#5D5D5380]">
              <MessageSquareText size={16} />
              {row.original?.comment}
            </div>
          ) : (
            row.original?.collection?.title
          )}
        </p>
      );
    },
  },
  {
    header: "Дилер",
    accessorKey: "filial.title",
    cell: () => {
      return (
        <p className="bg-[#58A0C6] inline-block rounded-[5px] text-[#F0F0E5] font-medium text-center px-4  py-1">
          Asl Gilam
        </p>
      );
    },
  },
  {
    header: "Менеджера",
    accessorKey: "casher.title",
    cell: () => {
      return (
        <div className="flex gap-1 justify-start">
          <Avatar className="w-12 h-12">
            <AvatarImage src={undefined} />
            <AvatarFallback>DD</AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    header: "Статус",
    accessorKey: "date",

    cell: ({ row }) => {
      return (
        <div className="flex">
          <p
            className={`${row.original.tip === "Приход" ? "border-[#E38157] text-[#E38157]" : "border-border text-primary"} min-w-[120px] rounded-4xl px-[14px]  w-[100px] text-center py-2 border `}
          >
            {row.original.tip === "order" ? "Принято" : "Не принято"}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return <TableAction url={apiRoutes.qrBase} id={row.original?.id} />;
    },
  },
];

export const KassaColumns: ColumnDef<KassaItem>[] = [
  {
    id: "startDate",
    header: "Дата",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className={`${item?.endDate ? "" : "text-[#89A143]"}`}>
          {" "}
          {item?.status == "Мои приходы и расходы" ? item?.status : item?.endDate
            ? format(new Date(item?.endDate), "dd MMMM yyyy")
            : "Продалажется"}
        </p>
      );
    },
  },
  {
    header: "Наличие",
    id: "totalSum",
    cell: ({ row }) => {
      const item = row.original;
      return <p className="text-[#89A143] text-nowrap "> {item?.totalSum && (item?.totalSum - (item?.plasticSum || 0)).toFixed(2) + ' $'} </p>;
    },
  },

  {
    header: "Терминал",
    id: "plasticSum",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.plasticSum && item?.plasticSum + " $"} </p>;
    },
  },

  {
    header: "Скидка",
    id: "discount",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.discount && item?.discount + "$"} </p>;
    },
  },

  {
    header: "Навар",
    id: "additionalProfitTotalSum",
    cell: ({ row }) => {
      const item = row.original;
      return <p>  {item?.additionalProfitTotalSum && item?.additionalProfitTotalSum + " $"} </p>;
    },
  },

  {
    header: "Объём",
    id: "totalSize",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.totalSize && item?.totalSize + " м²"} </p>;
    },
  },
  {
    header: "Приход",
    id: "income",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.income} $</p>;
    },
  },
  {
    header: "Расход",
    id: "expense",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.expense} $</p>;
    },
  },
  {
    header: "Инкассация",
    id: "cash_collection",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.cash_collection && item?.cash_collection + " $"} </p>;
    },
  },
  {
    header: "Кассир",
    id: "closer",
    cell: ({ row }) => {
      const item = row.original;
      return item?.status != "open" && item?.status != "Мои приходы и расходы" ? <div className="flex items-center">
        {<img className="w-[40px] rounded-full object-cover border-background border h-[40px]" src={minio_img_url + item?.closer?.avatar?.path} />}
        {item?.status != "closed_by_c" ? <img className="w-[40px]  object-cover border-background border-[2px]  -translate-x-2 rounded-full h-[40px]" src={minio_img_url + item?.closer_m?.avatar?.path} /> : ""}
      </div> : "";
    },
  },
  {
    header: "Статус",
    id: "status",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const item = row.original;
      const { mutate, isPending } = useMutation({
        mutationFn: () => PatchData(apiRoutes.kassaClose, {
          ids: [row.original?.id]
        }),
        onSuccess: () => {
          toast.success("close");
          queryClient.invalidateQueries({ queryKey: [apiRoutes.kassa] });
        },

      });
      return (
        <div onClick={(e) => e.stopPropagation()}>
          {item?.status == "closed_by_c" ? (
            <Button disabled={isPending} onClick={() => mutate()} className="rounded-[63px] bg-[#E38157]">{isPending ? <Loader2 /> : ""}  Принят </Button>
          ) : item?.status == "accepted" ? (
            <Button disabled variant={"outline"} className="rounded-[63px] "> Принято </Button>
          ) : item?.status == "rejected" ? (
            <Button disabled variant={"outline"} className="rounded-[63px] text-[#E38157] border-[#E38157]"> Отменено </Button>
          ) : item?.status != "Мои приходы и расходы" ? <Button variant={"outline"} className="rounded-[63px] text-[#89A143] border-[#89A143]"> В процессе </Button> : ""}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "actions",
    cell: () => (
      <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];
