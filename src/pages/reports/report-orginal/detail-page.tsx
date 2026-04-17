import { useNavigate, useParams, useLocation } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { useYear } from "@/store/year-store";
import { useMeStore } from "@/store/me-store";
import formatPrice from "@/utils/formatPrice";
import { useReportDetail } from "./queries";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getMonth } from "date-fns";

// Drill-in type -> sarlavha mapping
const TITLES: Record<string, string> = {
  naqd_kassa: "Naqd kassa",
  terminal: "Terminal",
  inkassatsiya: "Inkassatsiya",
  dealer_cash: "Diller Naqd",
  dealer_terminal: "Diller perechesleniya",
  kelgan_qarz: "Kelgan qarzlar",
  opening_balance: "O'tgan pul",
  boss_income: "Boss prixod",
  boss_expense: "Boss rasxod",
  kent_income: "Kent prixod",
  kent_expense: "Kent rasxod",
  extra_income: "Qo'shimcha prixodlar",
  business_expense: "Biznes rasxod",
  factory: "Taminotchi (Pastavchik)",
  logistics: "Logistika",
  tamojniy: "Bojxona (tamojniy)",
  navar_expense: "Navar Rasxod",
};

export default function ReportDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams<{ type: string }>();
  const { meUser } = useMeStore();
  const { year } = useYear();
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(getMonth(new Date()) + 1 + "")
  );
  const [filial] = useQueryState("filial");

  const isFManager = meUser?.position?.role == 4;
  const detailFilialId = isFManager
    ? meUser?.filial?.id
    : filial && filial !== "#dealers"
      ? filial
      : undefined;

  const { data, isLoading } = useReportDetail(
    {
      type: type || "",
      month: +month || undefined,
      year,
      filialId: detailFilialId,
    },
    !!type
  );

  const items = data?.items || [];
  const title = TITLES[type || ""] || type || "";

  // Terminal turi — filiallar ro'yxati
  const isTerminalType = type === "terminal";
  // Inkassatsiya turi — kassa ro'yxati
  const isInkassatsiya = type === "inkassatsiya";

  // Orqaga qaytish — /general sahifasiga
  const basePath = location.pathname.replace(`/detail/${type}`, "");

  // Jami summa
  const totalSum = items.reduce((acc: number, item: any) => {
    return acc + Number(item.price || item.plasticSum || 0);
  }, 0);

  return (
    <div>
      {/* Header */}
      <div className="bg-sidebar border-border border-b h-[64px] flex items-center px-4 gap-3">
        <button
          onClick={() => navigate(basePath + (location.search || ""))}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Umumiy Hisobot
        </button>
        <span className="text-muted-foreground">/</span>
        <p className="text-[16px] font-medium">{title}</p>
        <div className="ml-auto text-sm text-muted-foreground">
          {items.length} ta yozuv &middot;{" "}
          <span className="font-medium text-foreground">
            ${formatPrice(totalSum)}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">
            Ma'lumot topilmadi
          </p>
        ) : isTerminalType ? (
          // Terminal: filiallar ro'yxati + plasticSum
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="py-3 px-4 font-medium text-muted-foreground w-12">#</th>
                  <th className="py-3 px-4 font-medium text-muted-foreground">Filial</th>
                  <th className="py-3 px-4 font-medium text-muted-foreground text-right">Summa</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, i: number) => (
                  <tr key={item.filialId || i} className="border-b last:border-0">
                    <td className="py-3 px-4 text-muted-foreground">{i + 1}</td>
                    <td className="py-3 px-4">{item.filialTitle}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${formatPrice(Number(item.plasticSum || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : isInkassatsiya ? (
          // Inkassatsiya: kassa ro'yxati
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="py-3 px-4 font-medium text-muted-foreground w-12">#</th>
                  <th className="py-3 px-4 font-medium text-muted-foreground">Filial</th>
                  <th className="py-3 px-4 font-medium text-muted-foreground text-right">Summa</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, i: number) => (
                  <tr key={item.id || i} className="border-b last:border-0">
                    <td className="py-3 px-4 text-muted-foreground">{i + 1}</td>
                    <td className="py-3 px-4">{item.filialTitle}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${formatPrice(Number(item.price || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Cashflow ro'yxati
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="py-3 px-4 font-medium text-muted-foreground w-12">#</th>
                  <th className="py-3 px-4 font-medium text-muted-foreground">Izoh</th>
                  <th className="py-3 px-4 font-medium text-muted-foreground">Yaratgan</th>
                  <th className="py-3 px-4 font-medium text-muted-foreground">Filial</th>
                  <th className="py-3 px-4 font-medium text-muted-foreground text-right">Summa</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, i: number) => (
                  <tr key={item.id || i} className="border-b last:border-0">
                    <td className="py-3 px-4 text-muted-foreground">{i + 1}</td>
                    <td className="py-3 px-4 max-w-[250px] truncate">
                      {item.comment || "-"}
                    </td>
                    <td className="py-3 px-4">
                      {item.createdBy
                        ? `${item.createdBy.firstName || ""} ${item.createdBy.lastName || ""}`.trim()
                        : "-"}
                    </td>
                    <td className="py-3 px-4">{item.filial?.title || "-"}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${formatPrice(Number(item.price || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
