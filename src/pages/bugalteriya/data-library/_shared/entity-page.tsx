import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { Loader, MoreHorizontal, Plus, X } from "lucide-react";
import { toast } from "sonner";

import ReportToolbar from "@/components/report-toolbar";
import { OutlineButton } from "@/components/ui/outline-button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ListRow } from "@/components/ui/list-row";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterComboboxDemoInput from "@/components/filters-ui/filterCombobox";
import { TSelectOption } from "@/types";
import { getAllData, AddData, UpdatePatchData, DeleteData } from "@/service/apiHelpers";

export interface EntityItem {
  id: string;
  title: string;
  qrBaseCount: number;
  // Optional FK extra labels (server can include for display)
  parentTitle?: string;
}

interface EntityResponse {
  items: EntityItem[];
  meta: { currentPage: number; totalPages: number };
}

export interface ParentField {
  /** Form input name */
  name: string;
  label: string;
  placeholder: string;
  /** Combobox fetch URL */
  fetchUrl: string;
  /** Combobox label key path. Default 'title' */
  labelField?: string;
}

export interface DataLibraryEntityPageProps {
  /** Header titlelar. Misol: { single: "Davlat", plural: "Davlatlar" } */
  labels: { single: string; plural: string };
  /** API path. Misol: "/country" */
  apiPath: string;
  /** with-counts pathi. Default: `${apiPath}/with-counts` */
  countsPath?: string;
  /** Foreign key field — agar entityda parent bo'lsa (factory→country, collection→factory, model→collection) */
  parentField?: ParentField;
  /** Server payload'da parent id qaysi field'ga jo'natiladi. Default — parentField.name */
  parentPayloadKey?: string;
}

export default function DataLibraryEntityPage({
  labels,
  apiPath,
  countsPath,
  parentField,
  parentPayloadKey,
}: DataLibraryEntityPageProps) {
  const path = countsPath || `${apiPath}/with-counts`;
  const queryKey = [path];
  const queryClient = useQueryClient();

  const [search] = useQueryState("search", parseAsString);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [parentDraft, setParentDraft] = useState<TSelectOption | null>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [path, search],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<EntityResponse, any>(path, {
        page: pageParam,
        limit: 50,
        search: search || undefined,
      }),
    getNextPageParam: (lastPage) => {
      if ((lastPage.meta?.currentPage || 0) < (lastPage.meta?.totalPages || 0)) {
        return (lastPage.meta?.currentPage || 0) + 1;
      }
      return null;
    },
    initialPageParam: 1,
  });

  const flat: EntityItem[] = data?.pages?.flatMap((p) => p?.items || []) || [];

  const openAdd = () => {
    setEditingId(null);
    setTitleDraft("");
    setParentDraft(null);
    setPopoverOpen(true);
  };

  const openEdit = (item: EntityItem) => {
    setEditingId(item.id);
    setTitleDraft(item.title);
    // Parent prefill — server bilan kelishilgan tarzda. Hozircha label-only.
    setParentDraft(item.parentTitle ? { value: undefined as any, label: item.parentTitle } : null);
    setPopoverOpen(true);
  };

  const closePopover = () => {
    setPopoverOpen(false);
    setEditingId(null);
    setTitleDraft("");
    setParentDraft(null);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const title = titleDraft.trim();
      if (!title) throw new Error(`${labels.single} nomi bo'sh bo'lmasligi kerak`);
      const payload: any = { title };
      if (parentField) {
        const key = parentPayloadKey || parentField.name;
        if (parentDraft?.value) payload[key] = parentDraft.value;
      }
      if (editingId) return UpdatePatchData(apiPath, editingId, payload);
      return AddData(apiPath, payload);
    },
    onSuccess: () => {
      toast.success(editingId ? "Yangilandi" : "Yaratildi");
      queryClient.invalidateQueries({ queryKey });
      closePopover();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => DeleteData(apiPath, id),
    onSuccess: () => {
      toast.success("O'chirildi");
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0">
        <ReportToolbar
          inlineControls={
            <Popover
              open={popoverOpen}
              onOpenChange={(o) => (o ? openAdd() : closePopover())}
            >
              <PopoverTrigger asChild>
                <OutlineButton icon={<Plus className="w-[16px] h-[16px]" />}>
                  Qo'shish
                </OutlineButton>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={8}
                onPointerDownOutside={(e) => e.preventDefault()}
                onFocusOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="w-[360px] p-0 bg-[#f5f7f9] border border-[#e7ebf0] rounded-[6px] shadow-[0px_12px_24px_0px_rgba(12,36,58,0.08)] z-[40] overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px] py-[10px] pl-[12px]">
                    <Plus className="w-[20px] h-[20px] text-[#1a1a1a]" strokeWidth={1.6} />
                    <span className="text-[15px] font-medium text-[#1a1a1a] leading-none">
                      {editingId ? "Tahrirlash" : "Qo'shish"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={closePopover}
                    className="py-[10px] px-[12px] flex items-center justify-center"
                    aria-label="Yopish"
                  >
                    <X className="w-[20px] h-[20px] text-[#1a1a1a]" strokeWidth={1.4} />
                  </button>
                </div>
                <div className="h-[1px] bg-[#e7ebf0]" />
                <div className="pt-[20px] px-[40px] pb-[20px] flex flex-col gap-[16px]">
                  <div className="flex flex-col gap-[6px]">
                    <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Nomi</p>
                    <input
                      autoFocus
                      value={titleDraft}
                      onChange={(e) => setTitleDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && titleDraft.trim()) saveMutation.mutate();
                      }}
                      placeholder={`${labels.single} nomi`}
                      className="h-[44px] px-[12px] rounded-[6px] bg-white border border-[#e7ebf0] text-[14px] outline-none focus:border-[#0078d4]"
                    />
                  </div>
                  {parentField && (
                    <div className="flex flex-col gap-[6px]">
                      <p className="text-[13px] text-[#1a1a1a] pl-[10px]">{parentField.label}</p>
                      <FilterComboboxDemoInput
                        className="w-full h-[44px] bg-white border border-[#e7ebf0] rounded-[6px]"
                        placeholder={parentField.placeholder}
                        fetchUrl={parentField.fetchUrl}
                        name={parentField.name}
                        setValue={setParentDraft}
                        value={parentDraft}
                        fieldNames={{ label: parentField.labelField || "title", value: "id" }}
                      />
                    </div>
                  )}
                  <PrimaryButton
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending || !titleDraft.trim()}
                    className="self-start"
                  >
                    {saveMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
                  </PrimaryButton>
                </div>
              </PopoverContent>
            </Popover>
          }
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollCastom pb-[20px]">
        {isLoading && flat.length === 0 ? (
          <div className="flex items-center justify-center py-[40px]">
            <Loader className="w-[24px] h-[24px] animate-spin text-[#A3A3A3]" />
          </div>
        ) : flat.length === 0 ? (
          <div className="flex items-center justify-center py-[40px] bg-white rounded-[6px]">
            <span className="text-[13px] text-[#A3A3A3]">Ma'lumot topilmadi</span>
          </div>
        ) : (
          <div className="flex flex-col gap-[4px]">
            {flat.map((item) => (
              <ListRow
                key={item.id}
                minHeight={60}
                className="flex items-center gap-[40px] !px-[20px]"
                onClick={() => openEdit(item)}
              >
                <p className="text-[15px] font-normal text-[#1a1a1a] truncate min-w-[160px]">
                  {item.title}
                </p>
                {item.parentTitle && (
                  <p className="text-[13px] text-[#1a1a1a] opacity-60 truncate">{item.parentTitle}</p>
                )}
                <p className="text-[13px] text-[#a3a3a3] truncate">
                  {item.qrBaseCount} ta barcode'da ishlatilgan
                </p>
                <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center text-[#1a1a1a] hover:bg-[#f5f7f9] transition-colors"
                        aria-label="Aksiya"
                      >
                        <MoreHorizontal className="w-[20px] h-[20px]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[160px]">
                      <DropdownMenuItem onClick={() => openEdit(item)}>
                        Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-[#e5484d] focus:text-[#e5484d]"
                        disabled={item.qrBaseCount > 0}
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        O'chirish
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </ListRow>
            ))}
            <div ref={sentinelRef} className="h-[1px]" />
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-[12px]">
                <Loader className="w-[18px] h-[18px] animate-spin text-[#A3A3A3]" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
