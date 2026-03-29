import { CommandLoading } from "cmdk";
import { Check, ChevronsUpDown, Loader, Loader2Icon, Search } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TSelectOption } from "@/types";

import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

type ComboboxDemoProps = {
  value?: string;
  onChange: (e: TSelectOption) => void;
  isMulti?: boolean;
  defaultValue?: TSelectOption;
  className?: string;
  classNameValue?: string;
  classNameValueSpan?: string;
  classNameContainer?: string;
  classNameItem?: string;
  options: TSelectOption[];
  isLoading?: boolean;
  disabled?: boolean;
  onFilter?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onOpenChange?: (isopen: boolean) => void;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
};

export function ComboboxDemo(props: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  const {
    value,
    options,
    onChange,
    isLoading,
    onOpenChange,
    placeholder,
    className,
    onFilter,
    disabled,
    isFetchingNextPage = false,
    hasNextPage = false,
    fetchNextPage,
  } = props;

  React.useEffect(() => {
    if (onOpenChange) onOpenChange(open);
  }, [open]);

  React.useEffect(() => {
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

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={`w-full ${className && className}`} asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={`w-full justify-between  rounded-none h-10 bg-input border-border border ${className && className}`}
          aria-expanded={open}
        >
          <span
            className={twMerge(
              value ? "" : "text-muted-foreground font-[300px]"
            )}
          >
            {value
              ? options.find((framework) => framework?.value === value)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 z-[60]"
        align="start"
        onWheel={(e) => e.stopPropagation()}
      >
        <Command className="w-full">
          <div className="w-full flex items-center relative">
            <Search className="absolute top-2 w-4 opacity-60 left-2 " />
            <Input
              onChangeCapture={onFilter}
              placeholder={t("search")}
              className="h-9  rounded-none shadow-none border-t-none border-x-none focus-visible:ring-1 outline-none  pl-7 w-full "
            />
            {isLoading ? (
              <Loader2Icon className="absolute top-2 w-4 opacity-60 right-2 animate-spin" />
            ) : (
              ""
            )}
          </div>
          <CommandList className="w-full bg-sidebar max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <CommandLoading>
                <Skeleton className="h-7 m-2 " />
                <Skeleton className="h-7 m-2 " />
                <Skeleton className="h-7 m-2 " />
                <Skeleton className="h-7 m-2 " />
              </CommandLoading>
            ) : (
              <>
                <CommandEmpty>{t("noRamework")}</CommandEmpty>
                <CommandGroup>
                  {options?.map((framework, index) => (
                    <CommandItem
                      key={index}
                      value={framework?.value}
                      onSelect={() => {
                        onChange(framework);
                        setOpen(false);
                      }}
                    >
                      <span>{framework?.label}</span>
                      <Check
                        className={cn(
                          "ml-auto",
                          value === framework?.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
            {hasNextPage && (
              <div
                className="text-center w-full  h-10 flex items-center justify-center"
                ref={loadMoreRef}
              >
                <Loader className="animate-spin" />
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
