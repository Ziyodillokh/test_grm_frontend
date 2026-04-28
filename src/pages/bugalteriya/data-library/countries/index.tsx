import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { Loader, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

import ReportToolbar from "@/components/report-toolbar";
import { OutlineButton } from "@/components/ui/outline-button";
import { ListRow } from "@/components/ui/list-row";
import { RightSheet } from "@/components/ui/right-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllData, AddData, UpdatePatchData, DeleteData } from "@/service/apiHelpers";

interface CountryItem {
  id: string;
  title: string;
  qrBaseCount: number;
}

interface CountriesResponse {
  items: CountryItem[];
  meta: { currentPage: number; totalPages: number };
}

export default function CountriesPage() {
  const [search] = useQueryState("search", parseAsString);
  const [editId, setEditId] = useQueryState("editId", parseAsString);
  const [addOpen, setAddOpen] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const queryClient = useQueryClient();

  // Country list
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["/country/with-counts", search],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<CountriesResponse, any>("/country/with-counts", {
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

  const flat: CountryItem[] = data?.pages?.flatMap((p) => p?.items || []) || [];

  // Open edit sheet — load current title
  const editing = editId ? flat.find((c) => c.id === editId) : null;
  const isOpen = addOpen || !!editId;

  useEffect(() => {
    if (addOpen) setTitleDraft("");
    else if (editing) setTitleDraft(editing.title);
  }, [addOpen, editing?.id]);

  const closeSheet = () => {
    setAddOpen(false);
    setEditId(null);
    setTitleDraft("");
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const title = titleDraft.trim();
      if (!title) throw new Error("Davlat nomi bo'sh bo'lmasligi kerak");
      if (editId) {
        return UpdatePatchData("/country", editId, { title });
      }
      return AddData("/country", { title });
    },
    onSuccess: () => {
      toast.success(editId ? "Yangilandi" : "Yaratildi");
      queryClient.invalidateQueries({ queryKey: ["/country/with-counts"] });
      closeSheet();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => DeleteData("/country", id),
    onSuccess: () => {
      toast.success("O'chirildi");
      queryClient.invalidateQueries({ queryKey: ["/country/with-counts"] });
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
            <OutlineButton
              icon={<Plus className="w-[16px] h-[16px]" />}
              onClick={() => setAddOpen(true)}
            >
              Qo'shish
            </OutlineButton>
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
            {flat.map((c) => (
              <ListRow
                key={c.id}
                minHeight={60}
                className="flex items-center gap-[16px]"
                onClick={() => setEditId(c.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-normal text-[#1a1a1a] truncate">
                    {c.title}
                  </p>
                  <p className="text-[13px] text-[#a3a3a3] mt-[2px]">
                    {c.qrBaseCount} ta barcode'da ishlatilgan
                  </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
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
                      <DropdownMenuItem onClick={() => setEditId(c.id)}>
                        Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-[#e5484d] focus:text-[#e5484d]"
                        disabled={c.qrBaseCount > 0}
                        onClick={() => deleteMutation.mutate(c.id)}
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

      <RightSheet
        open={isOpen}
        onClose={closeSheet}
        title={editId ? "Davlatni tahrirlash" : "Davlat qo'shish"}
      >
        <div className="p-[20px] flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] text-[#1a1a1a]">Nomi</label>
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              placeholder="Davlat nomi"
              className="h-[44px] px-[12px] rounded-[6px] bg-white border border-[#e7ebf0] text-[14px] outline-none focus:border-[#0078d4]"
            />
          </div>
          <div className="flex justify-end gap-[8px]">
            <OutlineButton onClick={closeSheet}>Bekor qilish</OutlineButton>
            <button
              type="button"
              disabled={saveMutation.isPending || !titleDraft.trim()}
              onClick={() => saveMutation.mutate()}
              className="h-[42px] px-[16px] rounded-sm bg-[#0078d4] text-white text-[15px] font-medium hover:bg-[#0066b3] transition-colors disabled:opacity-50"
            >
              {saveMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      </RightSheet>
    </div>
  );
}
