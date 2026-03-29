import { ColumnDef } from "@tanstack/react-table";

import { ProductData } from "../type";

export const Columns: ColumnDef<ProductData>[] = [
  {
    header: "№",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    header: "Баркод",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.code}</p>;
    },
  },
  {
    header: "collection",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.collection?.title}</p>;
    },
  },

  {
    header: "model",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.model?.title}</p>;
    },
  },
  {
    header: "size",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.size?.title}</p>;
    },
  },
  {
    header: "count",
    cell: ({ row }) => {
      return <p>{row.original?.count}</p>;
    },
  },
  {
    header: "Обём",
    cell: ({ row }) => {
      return (
        <p>
          {(Number(row.original?.bar_code?.size?.x) *
            Number(row.original?.bar_code?.size?.y)).toFixed(2)}
          м²
        </p>
      );
    },
  },
  {
    header: "color",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.color?.title}</p>;
    },
  },
  {
    header: "style",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.style?.title}</p>;
    },
  },
  {
    header: "shape",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.shape?.title}</p>;
    },
  },
  {
    header: "country",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.country?.title}</p>;
    },
  },

  {
    header: "Партия",
    cell: ({ row }) => {
      return (
        <p>
          {row.original?.partiya
            ? row.original?.partiya?.title
            : row.original?.partiya_title}
        </p>
      );
    },
  },
];
