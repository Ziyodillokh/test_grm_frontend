import { TData } from "@/pages/deller/type";
import { ColumnDef } from "@tanstack/react-table";

export const Columns: ColumnDef<TData>[] = [
 
  {
    header: "Название",
    accessorKey: "title",
    id: "title",
  },
  {
    header: "Задолжность",
    cell: ({row}) => {
      return <p className=" py-4">{row?.original?.owed.toFixed(2) } $</p>;
    },
  },
  {
    header: "Дано",
    cell: ({row}) => {
      return <p className="text-[#89A143]">{row?.original?.given.toFixed(2)} $</p>;
    },
  },
  {
    header: "Остаток долга",
    cell: ({row}) => {
      return <p className="text-[#FF6600]">{(row?.original?.owed - row?.original?.given).toFixed(2)} $</p>;
    },
  },

];
