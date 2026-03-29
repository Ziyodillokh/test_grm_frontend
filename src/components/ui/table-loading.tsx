import { flexRender, Table as ITable } from "@tanstack/react-table";

import { Skeleton } from "./skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface TableLoadingProps<TData> {
  table: ITable<TData>;
  limit: number;
  headerPreview?:boolean;
}

export default function TableLoading<TData>({
  table,
  limit,
  headerPreview=true,
}: TableLoadingProps<TData>) {
  return (
    <Table >
      {headerPreview &&<TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>}
      <TableBody>
        {Array.from({ length: limit }).map((_, i) => (
          <TableRow key={i}>
            {table.getAllColumns().map((cell) => (
              <TableCell key={cell.id}>
                <Skeleton className="h-8 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
