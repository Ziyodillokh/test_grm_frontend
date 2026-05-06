import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRoutes } from "@/service/apiRoutes";
import { AddData, getAllData } from "@/service/apiHelpers";

interface CollectionPrice {
  id: string;
  factoryPricePerKv: number;
  overheadPerKv: number;
  sharePricePerKv: number;
  collection: {
    id: string;
    title: string;
  };
}

interface PriceRow {
  collectionId: string;
  collectionTitle: string;
  factoryPricePerKv: number;
  overheadPerKv: number;
  sharePricePerKv: number;
  kv: number;
  kassaPricePerKv: number;
}

export default function CollectionPriceDialog({
  open,
  onOpenChange,
  partiyaId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partiyaId: string;
}) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<PriceRow[]>([]);

  const { data: existing, isLoading } = useQuery({
    queryKey: [apiRoutes.partiyaCollectionPriceByPartiya, partiyaId],
    queryFn: () =>
      getAllData<CollectionPrice[], object>(
        apiRoutes.partiyaCollectionPriceByPartiya + "/" + partiyaId
      ),
    enabled: open && !!partiyaId,
  });

  // Get collections from products in this partiya
  const { data: collectionsData } = useQuery({
    queryKey: [apiRoutes.excelProductsReport, partiyaId, "collections"],
    queryFn: () =>
      getAllData<any, object>(apiRoutes.excelProducts, {
        partiyaId,
        type: "collection",
        limit: 100,
        page: 1,
      }),
    enabled: open && !!partiyaId,
  });

  useEffect(() => {
    if (!open) return;

    const collections: {
      id: string;
      title: string;
      kv: number;
      kassaPricePerKv: number;
    }[] = [];
    const items = collectionsData?.items || collectionsData || [];
    for (const item of items) {
      const col = item?.bar_code?.collection || item?.collection || (item?.id ? { id: item.id, title: item.title } : null);
      if (col?.id && !collections.find((c) => c.id === col.id)) {
        collections.push({
          id: col.id,
          title: col.title,
          kv: Number(item?.kv || 0),
          kassaPricePerKv: Number(item?.collectionPrice?.priceMeter || 0),
        });
      }
    }

    const existingMap = new Map<string, CollectionPrice>();
    if (existing) {
      for (const e of existing) {
        if (e.collection?.id) existingMap.set(e.collection.id, e);
      }
      // Also add collections from existing prices that might not be in products
      for (const e of existing) {
        if (e.collection?.id && !collections.find((c) => c.id === e.collection.id)) {
          collections.push({
            id: e.collection.id,
            title: e.collection.title,
            kv: 0,
            kassaPricePerKv: 0,
          });
        }
      }
    }

    setRows(
      collections.map((col) => {
        const ex = existingMap.get(col.id);
        return {
          collectionId: col.id,
          collectionTitle: col.title,
          factoryPricePerKv: ex?.factoryPricePerKv || 0,
          overheadPerKv: ex?.overheadPerKv || 0,
          sharePricePerKv: ex?.sharePricePerKv || 0,
          kv: col.kv,
          kassaPricePerKv: col.kassaPricePerKv,
        };
      })
    );
  }, [existing, collectionsData, open]);

  const { mutate: save, isPending } = useMutation({
    mutationFn: () =>
      AddData(apiRoutes.partiyaCollectionPrice, {
        partiyaId,
        items: rows.map((r) => ({
          collectionId: r.collectionId,
          factoryPricePerKv: r.factoryPricePerKv,
          overheadPerKv: r.overheadPerKv,
          sharePricePerKv: r.sharePricePerKv,
        })),
      }),
    onSuccess: () => {
      toast.success("Narxlar saqlandi");
      queryClient.invalidateQueries({
        queryKey: [apiRoutes.partiyaCollectionPriceByPartiya],
      });
      onOpenChange(false);
    },
    onError: (e) => toast.error(String(e)),
  });

  const updateRow = (idx: number, field: keyof PriceRow, value: number) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[920px]">
        <DialogHeader>
          <DialogTitle>Kolleksiya narxlari</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Partiyada mahsulot yo'q yoki kolleksiya topilmadi
          </p>
        ) : (
          <div className="max-h-[60vh] overflow-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 px-2 font-medium">Kolleksiya</th>
                  <th className="py-2 px-2 font-medium">Zavor narxi ($/m²)</th>
                  <th className="py-2 px-2 font-medium">Ustama ($/m²)</th>
                  <th className="py-2 px-2 font-medium">Sherik ulushi ($/m²)</th>
                  <th className="py-2 px-2 font-medium">Tani ($/m²)</th>
                  <th className="py-2 px-2 font-medium">Kassa ($)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.collectionId} className="border-b">
                    <td className="py-2 px-2 font-medium">{row.collectionTitle}</td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={row.factoryPricePerKv || ""}
                        onChange={(e) =>
                          updateRow(idx, "factoryPricePerKv", Number(e.target.value))
                        }
                        className="h-8 w-[120px]"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={row.overheadPerKv || ""}
                        onChange={(e) =>
                          updateRow(idx, "overheadPerKv", Number(e.target.value))
                        }
                        className="h-8 w-[120px]"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={row.sharePricePerKv || ""}
                        onChange={(e) =>
                          updateRow(idx, "sharePricePerKv", Number(e.target.value))
                        }
                        className="h-8 w-[120px]"
                      />
                    </td>
                    <td className="py-2 px-2 text-muted-foreground">
                      {(row.factoryPricePerKv + row.overheadPerKv + row.sharePricePerKv).toFixed(2)} $
                    </td>
                    <td className="py-2 px-2 text-muted-foreground">
                      {(row.kassaPricePerKv * row.kv).toFixed(2)} $
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button onClick={() => save()} disabled={isPending || rows.length === 0}>
            {isPending ? <Loader className="animate-spin h-4 w-4 mr-2" /> : null}
            Saqlash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
