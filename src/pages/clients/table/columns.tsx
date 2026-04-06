import { ColumnDef } from "@tanstack/react-table";
import { TData } from "../type";

export const ClientsColumns: ColumnDef<TData>[] = [
  {
    id: "id",
    header: "№",
    cell: ({ row }) => <>{row.index + 1}</>,
  },
  {
    header: "Ism Familiya",
    cell: ({ row }) => {
      const item = row.original as any;
      // User entity: firstName + lastName | Client entity: fullName
      const name = item?.firstName
        ? `${item.firstName || ""} ${item.lastName || ""}`.trim()
        : item?.fullName || "—";
      return <p className="font-medium">{name}</p>;
    },
  },
  {
    header: "Telefon",
    cell: ({ row }) => {
      return <p className="text-[#58A0C6]">{row.original?.phone || "—"}</p>;
    },
  },
  {
    header: "Ro'yxatdan o'tgan",
    cell: ({ row }) => {
      const item = row.original as any;
      const date = item?.createdAt || item?.dateOne;
      if (!date) return <p>—</p>;
      return <p className="text-muted-foreground text-sm">{new Date(date).toLocaleDateString("uz-UZ")}</p>;
    },
  },
  {
    header: "Holati",
    cell: ({ row }) => {
      const item = row.original as any;
      return (
        <span className={`px-2 py-1 rounded text-xs ${item?.isActive !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {item?.isActive !== false ? "Faol" : "Nofaol"}
        </span>
      );
    },
  },
];
