import { ColumnDef } from "@tanstack/react-table";

import { TData } from "./type";
import TebleAvatar from "@/components/teble-avatar";

export const SellerReportsColumns: ColumnDef<TData>[] = [
  {
    header: "Фото",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <TebleAvatar
          url={item?.avatar?.path}
          status="none"
          name={item?.firstName}
        />
      );
    },
  },
  {
    header: "Фамилия имя",
    cell: ({ row }) => {
      const item = row.original;
      return <p>{item?.firstName + " " + item?.lastName}</p>;
    },
  },

  {
    header: "Время работы",
    cell: () => {
      return <p>{0}</p>;
    },
  },
  {
    header: "Количество ",
    cell: ({ row }) => {
      const item = row.original;
      return <p>{item?.count}</p>;
    },
  },
  {
    header: "Объём ",
    cell: ({ row }) => {
      const item = row.original;
      return <p>{item?.kv} m²</p>;
    },
  },
  {
    header: "продаж",
    cell: ({ row }) => {
      const item = row.original;
      return <p className="text-[#89A143]">
        {new Intl.NumberFormat("ru-RU")
          .format(Number(item?.earn || 0))
          .replace(/,/g, " ")}{" "}
        $
      </p>
    },
  },

  {
    header: "Скидка",
    cell: ({ row }) => {
      const item = row.original;
      return <p className="text-[#89A143]">
        {new Intl.NumberFormat("ru-RU")
          .format(Number(item?.discount || 0))
          .replace(/,/g, " ")}{" "}
        $
      </p>
    },
  },

  {
    header: "Планка",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p>
          {new Intl.NumberFormat("ru-RU")
            .format(Number(item?.plan_price || 0))
            .replace(/,/g, " ")}{" "}
          $
        </p>
      );
    },
  },

];
