import { ListRow } from "@/components/ui/list-row";
import { Loader, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { minio_img_url } from "@/constants";
import { useMeStore } from "@/store/me-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";
import { toast } from "sonner";

import UserFilter from "./filter";
import useData from "./queries";
import ActionPage from "../form";

export default function Page() {
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;
  const isManager = role >= 9;

  const [search] = useQueryState("search", parseAsString);
  const [filial] = useQueryState("filial", parseAsString);
  const [, setId] = useQueryState("id", parseAsString);
  const queryClient = useQueryClient();

  const gridTemplate = isManager
    ? "40px minmax(100px,1fr) minmax(80px,120px) minmax(80px,120px) minmax(80px,120px) minmax(70px,100px) minmax(100px,140px)"
    : "40px minmax(100px,1fr) minmax(80px,120px) minmax(80px,120px) minmax(70px,100px) minmax(100px,140px)";

  const columnLabels = isManager
    ? ["", "Ism", "Lavozim", "Filial", "Login", "Maosh", "Telefon"]
    : ["", "Ism", "Lavozim", "Login", "Maosh", "Telefon"];

  const resolvedFilial = isManager
    ? filial === "all" ? undefined : (filial || undefined)
    : meUser?.filial?.id || undefined;

  const { data, isLoading } = useData({
    queries: {
      limit: 100,
      page: 1,
      search: search || undefined,
      filial: resolvedFilial,
    },
  });

  const items = (data?.pages?.flatMap((page) => page?.items || []) || [])
    .filter((item: any) => item.filial && item.filial.type !== "dealer" && item.position?.title?.toLowerCase() !== "diller");

  const { mutate: deleteUser } = useMutation({
    mutationFn: (id: string) => api.delete(`${apiRoutes.user}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [apiRoutes.user] }),
  });

  return (
    <div className="flex flex-col h-full">
      <UserFilter />

      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className="text-[13px] text-[#A3A3A3]">{label}</span>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          items.map((item: any, i: number) => (
            <ListRow
              key={item.id || i}
              gridTemplate={gridTemplate}
              className="pl-[12px] pr-[36px] relative"
              minHeight={60}
            >
              {/* Avatar */}
              <Avatar className="w-[36px] h-[36px]">
                <AvatarImage src={minio_img_url + item.avatar?.path} />
                <AvatarFallback className="bg-[#0078D4] text-white text-[12px]">
                  {item.firstName?.[0]}{item.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              {/* Ism */}
              <span className="text-[13px] font-medium text-[#1a1a1a]">
                {item.lastName} {item.firstName}
              </span>

              {/* Lavozim */}
              <span className="text-[11px] text-[#0078D4] bg-[#F0F7FF] px-[8px] py-[2px] rounded-[20px] self-center w-fit">
                {item.position?.title}
              </span>

              {/* Filial — faqat M-manager */}
              {isManager && (
                <span className="text-[13px] text-[#1a1a1a]">{item.filial?.name || item.filial?.title}</span>
              )}

              {/* Login — bosilganda nusxalanadi */}
              <span
                className="text-[13px] text-[#1a1a1a] cursor-pointer hover:text-[#0078D4] transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(item.login);
                  toast.success("Nusxalandi");
                }}
              >
                {item.login}
              </span>

              {/* Maosh */}
              <span className="text-[13px] text-[#1a1a1a]">
                {Number(item.salary || 0).toLocaleString()} $
              </span>

              {/* Telefon */}
              <span className="text-[13px] text-[#1a1a1a]">{item.phone}</span>

              {/* Actions — chekka o'ng */}
              <div className="absolute right-[4px] top-1/2 -translate-y-1/2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-[32px] w-[32px] rounded-[6px] flex items-center justify-center hover:bg-[#F5F5F5]">
                      <MoreVertical className="w-[16px] h-[16px] text-[#a3a3a3]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setId(item.id)}>
                      <Pencil className="w-[14px] h-[14px] mr-2" />
                      Tahrir
                    </DropdownMenuItem>
                    {role >= 9 && (
                      <DropdownMenuItem
                        className="text-[#EF4444] focus:text-[#EF4444]"
                        onClick={() => deleteUser(item.id)}
                      >
                        <Trash2 className="w-[14px] h-[14px] mr-2" />
                        O'chirish
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </ListRow>
          ))
        )}
      </div>

      <ActionPage />
    </div>
  );
}
