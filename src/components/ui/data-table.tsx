"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TableLoading from "./table-loading";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  className?: string;
  borderClass?: string;
  link?: string;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  isRowClickble?: boolean | undefined;
  fetchNextPage?: () => void;
  onSelectionChange?: (selectedRows: TData[]) => void;
  onRowClick?: (row: TData) => void;
  hasHeader?: boolean;
  isNumberble?: boolean
  ischeckble?: boolean;
  classNameBody?: string;
  classNameTable?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  className,
  borderClass,
  link,
  isRowClickble,
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage,
  onSelectionChange,
  onRowClick,
  ischeckble = true,
  isNumberble,
  hasHeader = true,
  classNameBody,
  classNameTable,
}: DataTableProps<TData, TValue>) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [, setId] = useQueryState("id");
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkboxColumn: ColumnDef<TData, any> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
  const numberboxColumn: ColumnDef<TData, any> = {
    id: "select",
    header: "№",
    cell: ({ row }) => (
      <p>{Number(row.id) + 1}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const allColumns = ischeckble ? [checkboxColumn, ...columns] : isNumberble ? [numberboxColumn, ...columns] : columns;

  useEffect(() => {
    if (!fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = Object.keys(rowSelection).map(
        (index) => data[parseInt(index)]
      );
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, data, onSelectionChange]);

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = Object.keys(rowSelection).map(
        (index) => data[parseInt(index)]
      );
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, data, onSelectionChange]);
  const navigate = useNavigate();

  return (
    <div className={`bg-card w-full   max-w-[calc(100vw-104px)] ${className}`}>
      {isLoading && data.length === 0 ? (
        <TableLoading limit={15} table={table} />
      ) : (
        <>
          <Table className={classNameTable + "h-full"}>
            {hasHeader ? (
              <TableHeader className={`border-border  border sticky top-0 ${borderClass}`}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="!flex !justify-center  "
                        >
                          {header.isPlaceholder
                            ? null
                            : typeof flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            ) == "string"
                              ? t(
                                String(
                                  flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )
                                )
                              )
                              : null}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
            ) : (
              ""
            )}
            <TableBody className={classNameBody}>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="px-5 cursor-pointer relative "
                    onClick={() => {
                      const id = (row.original as { id: string })?.id
                      if (onRowClick) {
                        onRowClick(row.original as TData);
                      }
                      if (isRowClickble && id) {
                        navigate(
                          link
                            ? link +
                            `?id=${id}`
                            : id + "/info"
                        );
                      } else if (isRowClickble !== false && id) {
                        setId(id);
                      }
                    }}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[calc(100vh-200px)] w-full  text-center"
                  >
                    <img className="mx-auto w-[70px] opacity-8" src="/images/icons/svg_408684.svg" alt="" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Loader for infinite scroll */}
          {fetchNextPage && (
            <div
              ref={loadMoreRef}
              className="flex justify-center items-center "
            >
              {isFetchingNextPage ? (
                <TableLoading headerPreview={false} limit={2} table={table} />
              ) : hasNextPage ? (
                <div className="h-8" />
              ) : (
                data.length > 0 && (
                  <div className="text-sm text-muted-foreground"></div>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
