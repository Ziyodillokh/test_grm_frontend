import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import TableAction from "@/components/table-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { minio_img_url } from "@/constants";
import { apiRoutes } from "@/service/apiRoutes";

import { TData } from "../type";

export const FilialColumns: ColumnDef<TData>[] = [
  {
    header: "Фото",
    cell: ({ row }) => {
      return (
        <Avatar className="w-[40px] h-[40px]">
          <AvatarImage src={minio_img_url + row.original?.user?.avatar?.path} />
          <AvatarFallback className="bg-primary text-white w-[40px] flex items-center justify-center h-[40px]">
            {row.original?.user?.firstName?.[0]}
            {row.original?.user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    header: "Фамилия имя",
    cell: ({ row }) => {
      return (
        <p>
          {row.original?.user?.firstName} {row.original?.user?.lastName}
        </p>
      );
    },
  },

  {
    header: "Флиал",
    cell: ({ row }) => {
      return <p>{row.original?.user?.filial?.title}</p>;
    },
  },
  {
    header: "Должность",
    cell: ({ row }) => {
      return (
        <p className="border-border border px-4 py-2 rounded-[60px] inline-block">
          {row.original?.user?.position?.title}
        </p>
      );
    },
  },
  {
    header: "Дата",
    cell: ({ row }) => {
      const timeEnter = format(row?.original?.enter, "dd-MMMM");

      return <p className="">{timeEnter}</p>;
    },
  },
  {
    header: "Приход",
    cell: ({ row }) => {
      const timeEnter = format(row?.original?.enter, "HH:mm");

      const expected = new Date(`1970-01-01T${row.original?.user?.from}`);
      const arrival = new Date(`1970-01-01T${timeEnter}:00`);
      const isExpected = arrival <= expected;

      return (
        <div className="flex items-center gap-1">
          <p className={`${isExpected ? "text-[#89A143]" : "text-[#E38157]"} `}>
            {timeEnter}
          </p>
        </div>
      );
    },
  },
  {
    header: "Уход",

    cell: ({ row }) => {
      const timeEnter = format(row?.original?.leave, "HH:mm");

      const expected = new Date(`1970-01-01T${row.original?.user?.to}`);
      const arrival = new Date(`1970-01-01T${timeEnter}:00`);
      const isExpected = arrival >= expected;
      return (
        <div className="flex items-center gap-1">
          <p className={`${isExpected ? "text-[#89A143]" : "text-[#E38157]"} `}>
            {row?.original?.leave ? timeEnter : "~"}
          </p>
        </div>
      );
    },
  },
  {
    header: "Часы на работе",
    cell: ({ row }) => {
      return <p>{row?.original?.totalTime} ч </p>;
    },
  },

  {
    header: "Зарплата",
    cell: ({ row }) => {
      const currency = Number(localStorage.getItem("currencyNow"));
      const dailyHours =
        Number(row.original?.user?.to?.slice(0, 2)) -
        Number(row.original.user?.from.slice(0, 2));

      return (
        <p>
          {(
            (row?.original?.totalTime *
              (row?.original?.user?.salary / 26 / dailyHours)) /
            currency
          ).toFixed(2)}{" "}
          $
        </p>
      );
    },
  },

  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return <TableAction url={apiRoutes.filial} id={row.original?.id} />;
    },
  },
];
