import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, MoreHorizontal } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DeleteData } from "@/service/apiHelpers";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function TableAction({
  url,
  ShowPreview,
  ShowUpdate = true,
  ShowDelete = true,
  costomDelete,
  refetchUrl,
  children,
  id,
}: {
  url?: string;
  ShowPreview?: boolean;
  ShowUpdate?: boolean;
  ShowDelete?: boolean;
  id?: string;
  refetchUrl?: string;
  children?: React.ReactNode;
  costomDelete?:()=>void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, setId] = useQueryState("id");
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { mutate,isPending } = useMutation({
    mutationFn: async () => {
      if(costomDelete){
        return costomDelete();
      }else{
        if(url && id){
          return await DeleteData(url, id);
        }
      }
    },
    onSuccess: () => {
      toast.success(t("deleteToast"));
      queryClient.invalidateQueries({ queryKey: [refetchUrl || url] });
      setOpen(false);
    },
  });

  return (
    <div className="text-end" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-end" asChild>
          <Button variant="ghost" className="h-8 text-end w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {ShowUpdate ? (
            <DropdownMenuItem onClick={() => setId(id||'')}>
              {t("update")}
            </DropdownMenuItem>
          ) : (
            ""
          )}
          {ShowPreview ? (
            <DropdownMenuItem onClick={() => navigate(`${id}/info`)}>
              {t("singlePage")}
            </DropdownMenuItem>
          ) : (
            ""
          )}
          {ShowDelete ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger onClick={() => setOpen(true)} className="w-full">
                <p
                  className={"px-[6px] text-start text-sm rounded-md  py-[4px]"}
                >
                  {t("delete")}
                </p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    {t("deleteConfir")}
                  </DialogTitle>
                </DialogHeader>

                <DialogFooter className="sm:justify-start  w-full flex gap-2">
                  <DialogClose asChild>
                    <Button type="button" className="w-1/2" variant="secondary">
                      {t("close")}
                    </Button>
                  </DialogClose>
                  <Button
                    variant={"destructive"}
                    disabled={isPending}
                    onClick={() => mutate()}
                    className="w-1/2"
                  >
                    {isPending ? <Loader className="animate-spin"/> :""}
                    {t("yes")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            ""
          )}
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
