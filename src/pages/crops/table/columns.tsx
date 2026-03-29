import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import TableAction from "@/components/table-action";
import TableImage from "@/components/table-image";
import TablePopaver from "@/components/table-popaver";
import { Badge } from "@/components/ui/badge";
import { apiRoutes } from "@/service/apiRoutes";

import { CropData } from "../type";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";

export const paymentColumns: ColumnDef<CropData>[] = [
  {
    accessorKey: "id",
    header: () => {
      return (
        <FilterSelect
            placeholder={"colaction"}
            name="select"
            className="bg-foreground "
          />
      )
    },
  },
  {
    id: "main_image",
    header: "image",
    cell: ({ row }) => {
      return (
        <>
          <TableImage url={row.original?.main_image?.aws_path || null} />
        </>
      );
    },
    size: 100,
  },
  {
    accessorKey: "name",
    header: "name",
  },
  
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: "planting_time_start",
    header: "plantingTimeStart",
  },
  {
    accessorKey: "is_common",
    header: "isCommon",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { t } = useTranslation();
      return (
        <>
          <Badge
            variant={row.original?.is_common ? "default" : "destructive"}
            className="px-2 py-1"
          >
            {row.original?.is_common ? t("common") : t("unCommon")}
          </Badge>
        </>
      );
    },
  },
  {
    id: "description",
    header: "description",
    size: 50,
    cell: ({ row }) => {
      return (
        <TablePopaver text={"description"} disc={row.original.description} />
      );
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return (
        <TableAction url={apiRoutes.crops} ShowPreview id={row.original?.id} />
      );
    },
  },
];
