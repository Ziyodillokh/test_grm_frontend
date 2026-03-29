import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import TableAction from "@/components/table-action";
import { UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { FilialReportData } from "../type";
import { useMeStore } from "@/store/me-store";
import { useState } from "react";

export const Columns: ColumnDef<FilialReportData>[] = [
  {
    header: "Дата переучёта",
    cell: ({ row }) => {
      return (
        <>
          <p >{format(row.original?.dateOne, "MM-dd-yyyy")} ~ {(row.original.status == "Accepted" || row.original.status == "Open") ? <p className="text-[#89A143]">Продолжается</p> : format(row.original?.dateTwo, "MM-dd-yyyy")}</p>
        </>
      );
    },
  },
  {
    header: "Штук",
    cell: ({ row }) => {
      return <p>{row.original?.count}шт</p>;
    },
  },
  {
    header: "Обьём",
    cell: ({ row }) => {
      return <p>{row.original?.volume}м²</p>;
    },
  },
  {
    header: "Стоимость",
    cell: ({ row }) => {
      return <p>{row.original?.cost}$</p>;
    },
  },

  {
    header: "Статус пратии",
    cell: ({ row }) => {

      const StatusText = {
        open: "Отправить на подтверждение",
        accepted: "В ожидании...",
        closed: "Принято",
      };

      const StatusMManaerText = {
        open: "Принимается",
        accepted: "Принять переучёт",
        closed: "Принято",
      };
      const { meUser } = useMeStore()
      const [status, setStatus] = useState<string>(row.original.status)
      if (status == "Accepted" && meUser?.position?.role != 4) {
        const navigate = useNavigate();
        const { id } = useParams();
        return (
          <p
            onClick={(e) => {
              e.stopPropagation()
              UpdatePatchData("product/close-report", id || "", {})
                .then(() => {
                  navigate(`/filial/${id}/info`);
                  toast.success("Переучёт Принять");
                  setStatus("closed")
                })
                .catch(() => toast.error("что-то пошло не так"));
            }}
            className="px-4 py-3 rounded-[1000px] inline-block text-[#F0F0E5] bg-[#89A143]"
          >
            Принять

          </p>
        );
      } else {
        return (
          <p className="px-4 py-3 rounded-[1000px] inline-block  border-border border">
            {status ? meUser?.position?.role == 4 ? StatusText[status?.toLowerCase() as unknown as keyof typeof StatusText] : StatusMManaerText[status?.toLowerCase() as unknown as keyof typeof StatusMManaerText] : ""}
          </p>
        );
      }
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      if (row.original.status == "Accepted") {
        const queryClient = useQueryClient();
        return (
          <TableAction
            id=""
            url=""
            ShowPreview={false}
            ShowDelete={false}
            ShowUpdate={false}
          >
            <DropdownMenuItem
              onClick={() => {
                UpdatePatchData("product/reject-report", row.original?.id, {})
                  .then(() => {
                    toast.success("Переучёт Отменин");
                    queryClient.invalidateQueries({
                      queryKey: [apiRoutes.filialReport],
                    });
                  })
                  .catch(() => toast.error("что-то пошло не так"));
              }}
            >
              Отменить
            </DropdownMenuItem>
          </TableAction>
        );
      }
    },
  },
];
