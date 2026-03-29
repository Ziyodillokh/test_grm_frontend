import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAllData } from "@/service/apiHelpers";
import { TResponse, TSelectOption } from "@/types";
import debounce from "@/utils/debounce";

import { ComboboxDemo } from "../forms/Combobox";
import { get } from "@/utils/get";
import { parseAsString, useQueryState } from "nuqs";

interface Props<TQuery> {
  label?: string;
  name: string;
  placeholder?: string;
  fetchUrl?: string;
  className?: string;
  disabled?: boolean;
  queries?: TQuery;
  option?: TOption[];
  defaultValue?: string;
  value?: TSelectOption | null;
  setValue?: (value: TSelectOption) => void;
  onLocalChange?: (value: TSelectOption) => void;
  fieldNames?: {
    value: string;
    label: string;
  };
}

export type TOption = {
  label: string;
  value: string;
};

export default function FilterComboboxDemoInput<IData, TQuery>({
  value,
  name,
  setValue,
  fetchUrl,
  label,
  placeholder,
  disabled,
  queries,
  className,
  option,
  defaultValue,
  fieldNames,
}: Props<TQuery>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState();

  const [, setQValue] = useQueryState(
    name,
    parseAsString.withDefault(defaultValue || "")
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [fetchUrl, search, queries],
      enabled: open && Boolean(fetchUrl),
      queryFn: ({ pageParam = 1 }) =>
        getAllData<TResponse<IData>, TQuery>(fetchUrl || "", {
          search:search,
          limit:10,
          page:pageParam,
          ...queries,
        } as TQuery),
      select: (res) => ({
        data: res.pages.flatMap((page) =>
          page.items.map((item) => ({
            value: fieldNames?.value
              ? (item as Record<string, string>)[fieldNames.value]
              : String(item),
            label: fieldNames?.label
              ? get(item as Record<string, string>, fieldNames.label)
              : String(item),
          }))
        ),
        meta: res.pages[res.pages.length - 1].meta,
      }),
      getNextPageParam: (lastPage) => {
        if (lastPage.meta?.currentPage <= lastPage.meta?.totalPages) {
          return lastPage?.meta?.currentPage + 1;
        } else {
          return null;
        }
      },
      initialPageParam: 1,
    })

  const memoizedData = useMemo(() => {
    if (option) return option;
    if (!data?.data) return value ? [value] : [];
    const containsValue = data.data.some(
      (item) => item?.value === value?.value
    );
    return containsValue
      ? data.data
      : value
        ? [value, ...data.data]
        : data.data;
  }, [data, fieldNames, value, option]);

  return (
    <>
      {label && (
        <p className="font-medium text-[#344054] dark:text-white">{t(label)}</p>
      )}
      <ComboboxDemo
        onOpenChange={(isopen) => {
          setOpen(isopen);
          setSearch(undefined);
        }}
        onFilter={debounce((e) => setSearch(e.target.value), 500)}
        disabled={disabled}
        value={value?.value}
        className={className && className +"w-full bg-card hover:bg-card border-none rounded-xl"}
        isLoading={isLoading}
        options={memoizedData}
        placeholder={placeholder ? t(placeholder) : ""}
        onChange={(event) => {
         if(setValue)  setValue(event);
          setQValue(event?.value || "")
        }}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
}
