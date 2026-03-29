import { ColumnDef } from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";


import { ProductCharacteristic } from "../type";

export const ProductCharacteristicColumns: ColumnDef<ProductCharacteristic>[] = [
  {
    id: "collection",
    header: "Коллекция",
    accessorKey: "title",
  },
  {
    id: "description",
    header: "Описание",
    accessorKey: "description",
    cell: ({ row }) => {
      const [editId] = useQueryState("editId");
      const [editDesc, setEditDesc] = useQueryState("editDesc");
      return (
        <Input
          disabled={editId !== row.original.id}
          value={editId === row.original.id ? (editDesc ?? row.original.description) : row.original.description}
          onChange={(e) => setEditDesc(e.target.value)}
          className={`border-transparent ${editId === row.original.id ? "border-input bg-background" : "bg-transparent"
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
      const queryClient = useQueryClient();

      const isEditing = editId === row.original.id;

      const { mutate, isPending } = useMutation({
        mutationFn: (newDescription: string) =>
          UpdatePatchData(apiRoutes.collections, row.original.id, {
            description: newDescription,
          }),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [apiRoutes.collections] });
          toast.success("Описание успешно обновлено");
          setEditId(null);
          setEditDesc(null);
        },
        onError: () => {
          toast.error("Ошибка при обновлении описания");
        },
      });

      const handleAction = () => {
        if (isEditing) {
          mutate(editDesc || row.original.description);
        } else {
          setEditId(row.original.id);
          setEditDesc(row.original.description);
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
