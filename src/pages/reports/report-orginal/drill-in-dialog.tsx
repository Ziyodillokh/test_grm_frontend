import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import formatPrice from "@/utils/formatPrice";
import { useReportDetail } from "./queries";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  detailType: string;
  month?: number;
  year?: number;
  filialId?: string;
};

export default function DrillInDialog({
  open,
  onClose,
  title,
  detailType,
  month,
  year,
  filialId,
}: Props) {
  const { data, isLoading } = useReportDetail(
    { type: detailType, month, year, filialId },
    open
  );

  const items = data?.items || [];

  // Terminal turi — filiallar ro'yxati
  const isTerminalType = detailType === "terminal";
  // Inkassatsiya turi — kassa ro'yxati
  const isInkassatsiya = detailType === "inkassatsiya";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-4 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              Ma'lumot topilmadi
            </p>
          ) : isTerminalType ? (
            // Terminal: filiallar ro'yxati + plasticSum
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 font-medium">#</th>
                  <th className="py-2 font-medium">Filial</th>
                  <th className="py-2 font-medium text-right">Summa</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, i: number) => (
                  <tr key={item.filialId || i} className="border-b">
                    <td className="py-2 text-muted-foreground">{i + 1}</td>
                    <td className="py-2">{item.filialTitle}</td>
                    <td className="py-2 text-right font-medium">
                      ${formatPrice(Number(item.plasticSum || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : isInkassatsiya ? (
            // Inkassatsiya: kassa ro'yxati
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 font-medium">#</th>
                  <th className="py-2 font-medium">Filial</th>
                  <th className="py-2 font-medium text-right">Summa</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, i: number) => (
                  <tr key={item.id || i} className="border-b">
                    <td className="py-2 text-muted-foreground">{i + 1}</td>
                    <td className="py-2">{item.filialTitle}</td>
                    <td className="py-2 text-right font-medium">
                      ${formatPrice(Number(item.price || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Cashflow ro'yxati
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 font-medium">#</th>
                  <th className="py-2 font-medium">Izoh</th>
                  <th className="py-2 font-medium">Filial</th>
                  <th className="py-2 font-medium text-right">Summa</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, i: number) => (
                  <tr key={item.id || i} className="border-b">
                    <td className="py-2 text-muted-foreground">{i + 1}</td>
                    <td className="py-2 max-w-[200px] truncate">
                      {item.comment || "-"}
                    </td>
                    <td className="py-2">{item.filial?.title || "-"}</td>
                    <td className="py-2 text-right font-medium">
                      ${formatPrice(Number(item.price || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
