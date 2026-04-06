import { ColumnDef } from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";


import { ProductCharacteristic } from "../type";

export const ProductCharacteristicColumns: ColumnDef<ProductCharacteristic>[] = [
  {
    id: "collection",
    header: "Коллекция",
    accessorKey: "title",
    cell: ({ row }) => (
      <p className="font-medium text-[14px] min-w-[120px]">{row.original.title}</p>
    ),
  },
  {
    id: "description",
    header: "Описание",
    accessorKey: "description",
    cell: ({ row }) => {
      const [editId] = useQueryState("editId");
      const [editDesc, setEditDesc] = useQueryState("editDesc");
      return (
        <Textarea
          disabled={editId !== row.original.id}
          value={editId === row.original.id ? (editDesc ?? row.original.description ?? "") : (row.original.description ?? "")}
          onChange={(e) => setEditDesc(e.target.value)}
          rows={2}
          className={`min-w-[200px] resize-none border-transparent ${editId === row.original.id ? "border-input bg-background" : "bg-transparent"
            }`}
        />
      );
    },
  },
  {
    id: "paymentDeliveryInfo",
    header: "Оплата и доставка",
    cell: ({ row }) => {
      const [editId] = useQueryState("editId");
      const [editPayment, setEditPayment] = useQueryState("editPayment");
      return (
        <Textarea
          disabled={editId !== row.original.id}
          value={editId === row.original.id ? (editPayment ?? row.original.paymentDeliveryInfo ?? "") : (row.original.paymentDeliveryInfo ?? "")}
          onChange={(e) => setEditPayment(e.target.value)}
          rows={2}
          className={`min-w-[200px] resize-none border-transparent ${editId === row.original.id ? "border-input bg-background" : "bg-transparent"
            }`}
        />
      );
    },
  },
  {
    id: "actions",
    header: "Действия",
    cell: ({ row }) => {
      const [editId, setEditId] = useQueryState("editId");
      const [editDesc, setEditDesc] = useQueryState("editDesc");
      const [editPayment, setEditPayment] = useQueryState("editPayment");
      const queryClient = useQueryClient();

      const isEditing = editId === row.original.id;

      const { mutate, isPending } = useMutation({
        mutationFn: (payload: { description?: string; paymentDeliveryInfo?: string }) =>
          UpdatePatchData(apiRoutes.collections, row.original.id, payload),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [apiRoutes.collections] });
          toast.success("Успешно обновлено");
          setEditId(null);
          setEditDesc(null);
          setEditPayment(null);
        },
        onError: () => {
          toast.error("Ошибка при обновлении");
        },
      });

      const handleAction = () => {
        if (isEditing) {
          mutate({
            description: editDesc ?? row.original.description ?? "",
            paymentDeliveryInfo: editPayment ?? row.original.paymentDeliveryInfo ?? "",
          });
        } else {
          setEditId(row.original.id);
          setEditDesc(row.original.description ?? "");
          setEditPayment(row.original.paymentDeliveryInfo ?? "");
        }
      };

      return (
        <p
          onClick={handleAction}
          className={`cursor-pointer inline-block py-[6px] text-[12px] px-[10px] rounded-[4px] ${isEditing
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
            } ${isPending ? "opacity-50 pointer-events-none" : ""}`}
        >
          {isEditing ? "Сохранить" : "Изменить"}
        </p>
      );
    },
  },
];
