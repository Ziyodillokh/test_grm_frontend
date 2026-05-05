import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Loader,
  Banknote,
} from "lucide-react";
import { ListRow } from "@/components/ui/list-row";
import { useYear } from "@/store/year-store";
import { useDealerKassaDetail } from "./queries";
import formatPrice from "@/utils/formatPrice";
import { format } from "date-fns";
import { DealerDetailItem } from "./type";
import { useKassaReportSingle } from "@/pages/report/table/queries";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRoutes } from "@/service/apiRoutes";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/service/fetchInstance";
import ReportToolbar from "@/components/report-toolbar";
import { TrendingDown } from "lucide-react";

export default function DealerReportPage() {
  const { id, dealerId: dealerIdParam } = useParams();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const { year } = useYear();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data: kassaData } = useKassaReportSingle({
    id: id,
    enabled: Boolean(id) && !dealerIdParam,
    queries: {},
  });

  const dealerId = dealerIdParam || kassaData?.filial?.id || "";

  // Kassa kontekstidan oy/yil olamiz; dealerlar ro'yxatidan kelgan bo'lsa global yil + joriy oy
  const kassaYear = (kassaData as any)?.year;
  const kassaMonth = (kassaData as any)?.month;
  const filterYear = kassaYear ?? year;
  const filterMonth = dealerIdParam ? new Date().getMonth() + 1 : kassaMonth;

  const { data, isLoading } = useDealerKassaDetail({
    dealerId,
    queries: { year: filterYear, month: filterMonth },
    enabled: !!dealerId && (dealerIdParam ? true : Boolean(kassaMonth)),
  });

  const flatData: DealerDetailItem[] =
    data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;
  const dealer = data?.pages?.[0]?.dealer;

  useEffect(() => {
    const title = (dealer as any)?.title || (kassaData as any)?.filial?.title || "Diller";
    if (title) push(title, location.pathname);
  }, [dealer, kassaData, location.pathname]);

  const toggleExpand = (itemId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  // Kirim dialog state
  const queryClient = useQueryClient();
  const [typePay, setTypePay] = useState<string>("cash");
  const [comment, setComment] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!price || price <= 0) {
        toast.error("Summani kiriting");
        setLoading(false);
        return;
      }
      const body = {
        comment,
        price,
        ...(date ? { date } : {}),
        kassa: id,
        is_online: typePay === "online",
      };
      await api.post(apiRoutes.cashflowDealerIncome, body);
      toast.success("Kirim qo'shildi");
      setComment("");
      setPrice(undefined);
      setDate("");
      setDialogOpen(false);
      setTypePay("cash");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.dealerKassaDetail] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTypePay("cash");
    setComment("");
    setPrice(undefined);
    setDate("");
  }, [dialogOpen]);

  const kassaDiscount = kassaData?.discount ?? kassaData?.totalDiscount ?? 0;

  const gridTemplate = "48px 100px 100px 130px 1fr 40px";
  const columnLabels = ["", "Summa", "Turi", "Sana", "Ma'lumot", ""];

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex flex-col h-full">
        {/* Toolbar + Kirim qo'shish button */}
        <div className="flex items-center gap-[4px] mb-[10px]">
          <ReportToolbar />
          <div className="ml-auto">
            {id && !dealerIdParam && (
              <DialogTrigger asChild>
                <button className="h-[42px] px-[20px] rounded-sm bg-[#47B13C] text-white text-[14px] font-medium flex items-center gap-[8px] hover:bg-[#3da032] transition-colors">
                  Kirim qo'shish
                </button>
              </DialogTrigger>
            )}
          </div>
        </div>

        {/* Cards: yashil + 3 oq */}
        <div className="flex gap-[4px] flex-col lg:flex-row">
          {/* Yashil card — Qarz qoldig'i */}
          <div
            className="bg-[#47B13C] text-white rounded-sm min-w-[260px] w-[25%] shrink-0 relative overflow-hidden flex flex-col"
            style={{ height: 80, padding: "10px 20px" }}
          >
            <p className="text-[20px] font-medium leading-tight mt-[5px]">
              ${formatPrice(dealer?.balance || 0)}
            </p>
            <p className="text-[13px] opacity-60 mt-auto">Qarz qoldig'i</p>
            <svg className="absolute right-[8px] bottom-[8px] opacity-70" width="60" height="38" viewBox="0 0 61 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.3" d="M6.72032 23.7873L0.368164 30.6778V40H60.3677V2.64208L55.5589 5.65377C53.8525 6.72247 52.4565 8.22039 51.5105 9.99777C48.9524 14.804 43.3749 17.1583 38.1467 15.6386L35.4451 14.8534C34.0685 14.4533 32.9121 13.5137 32.2385 12.2482C29.9493 7.94705 23.5607 8.73988 22.3922 13.4702L20.8222 19.8261C19.9904 23.1934 16.1106 24.7635 13.1711 22.9226C11.0929 21.621 8.38237 21.9844 6.72032 23.7873Z" fill="url(#paint0_linear_dealer)"/>
              <path d="M0.368164 30.7143L6.72067 23.8152C8.38208 22.0108 11.0937 21.6472 13.1717 22.9502C16.1099 24.7925 19.99 23.2228 20.8207 19.8558L22.3924 13.4853C23.5599 8.7532 29.9515 7.96069 32.2393 12.2643C32.9124 13.5303 34.0686 14.4705 35.4452 14.8711L38.1372 15.6545C43.37 17.1772 48.9533 14.8199 51.5115 10.0078C52.4568 8.22951 53.8524 6.73052 55.5586 5.66065L60.3677 2.64522" stroke="white"/>
              <defs>
                <linearGradient id="paint0_linear_dealer" x1="30.3679" y1="0" x2="30.3679" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1" stopColor="white" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 3 oq card — Jami yuborilgan, Jami qaytarilgan, Jami chegirma */}
          <div className="grid grid-cols-3 gap-[4px] flex-1" style={{ maxHeight: 80 }}>
            <div className="bg-white rounded-sm flex flex-col gap-[2px]" style={{ padding: 10 }}>
              <p className="text-[15px] font-normal">{formatPrice(dealer?.owed || 0)}$</p>
              <div className="flex items-center gap-1 text-[12px] text-green-500"><TrendingDown className="w-3 h-3" /><span>--%</span></div>
              <p className="text-[13px] text-[#1a1a1a] opacity-60">Jami yuborilgan</p>
            </div>
            <div className="bg-white rounded-sm flex flex-col gap-[2px]" style={{ padding: 10 }}>
              <p className="text-[15px] font-normal">{formatPrice(dealer?.given || 0)}$</p>
              <div className="flex items-center gap-1 text-[12px] text-green-500"><TrendingDown className="w-3 h-3" /><span>--%</span></div>
              <p className="text-[13px] text-[#1a1a1a] opacity-60">Jami qaytarilgan</p>
            </div>
            <div className="bg-white rounded-sm flex flex-col gap-[2px]" style={{ padding: 10 }}>
              <p className="text-[15px] font-normal" style={{ color: "#FF6314" }}>-{formatPrice(Math.abs(kassaDiscount))}$</p>
              <div className="flex items-center gap-1 text-[12px] text-red-500"><TrendingDown className="w-3 h-3" /><span>--%</span></div>
              <p className="text-[13px] text-[#1a1a1a] opacity-60">Jami chegirma</p>
            </div>
          </div>
        </div>

        {/* Davriy ko'rsatkichlar */}
        {totals && (
          <div className="flex gap-[4px] mt-[10px]">
            <div className="bg-white rounded-sm px-[12px] py-[8px] flex-1 flex items-center gap-[10px]">
              <span className="text-[13px] text-[#1a1a1a] opacity-60">Davriy yuborilgan:</span>
              <span className="text-[13px] text-[#EC6724]">{formatPrice(totals.period_owed || 0)}$</span>
            </div>
            <div className="bg-white rounded-sm px-[12px] py-[8px] flex-1 flex items-center gap-[10px]">
              <span className="text-[13px] text-[#1a1a1a] opacity-60">Davriy qaytarilgan:</span>
              <span className="text-[13px] text-[#47B13C]">{formatPrice(totals.period_given || 0)}$</span>
            </div>
            <div className="bg-white rounded-sm px-[12px] py-[8px] flex-1 flex items-center gap-[10px]">
              <span className="text-[13px] text-[#1a1a1a] opacity-60">Davriy chegirma:</span>
              <span className="text-[13px] text-[#FF6314]">-{formatPrice(Math.abs(totals.period_balance || 0))}$</span>
            </div>
          </div>
        )}

        {/* Column labels */}
        <div
          className="mt-[16px] mb-[10px] shrink-0 px-[12px]"
          style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
        >
          {columnLabels.map((label, i) => (
            <span key={i} className="text-[13px] text-[#A3A3A3]">{label}</span>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
            </div>
          ) : flatData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-[#a3a3a3] text-[14px]">
              Ma'lumot topilmadi
            </div>
          ) : (
            flatData.map((item) => {
              const isPackage = item.entry_type === "package";
              const isExpanded = expandedRows.has(item.id);
              const hasCollections = isPackage && item.collections && item.collections.length > 0;

              return (
                <div key={item.id}>
                  <ListRow
                    gridTemplate={gridTemplate}
                    onClick={hasCollections ? () => toggleExpand(item.id) : undefined}
                  >
                    {/* Icon */}
                    <div className="flex items-center">
                      <div className={`w-[36px] h-[36px] flex items-center justify-center rounded ${isPackage ? "bg-[#EC6724]" : "bg-[#47B13C]"} text-white`}>
                        {isPackage ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                      </div>
                    </div>

                    {/* Summa */}
                    <span className={`text-[15px] font-medium ${isPackage ? "text-[#EC6724]" : "text-[#47B13C]"}`}>
                      {formatPrice(item.total_cost || 0)}$
                    </span>

                    {/* Turi */}
                    <span className={`text-[13px] font-medium ${isPackage ? "text-[#EC6724]" : "text-[#47B13C]"}`}>
                      {isPackage ? "Paket" : "To'lov"}
                      {!isPackage && item.is_online && <span className="text-[#0078D4] ml-1">(onlayn)</span>}
                    </span>

                    {/* Sana */}
                    <span className="text-[13px] text-[#1a1a1a]">
                      {format(new Date(item.date), "dd MMM yyyy")}
                    </span>

                    {/* Ma'lumot */}
                    <span className="text-[13px] text-[#1a1a1a] truncate">
                      {isPackage ? (
                        <>
                          {item.title || "Paket"}
                          {item.total_kv ? <span className="text-[#a3a3a3] ml-2">{formatPrice(item.total_kv)} m²</span> : null}
                        </>
                      ) : (
                        item.comment || ""
                      )}
                    </span>

                    {/* Chevron */}
                    <div className="flex items-center justify-center">
                      {hasCollections ? (
                        isExpanded ? <ChevronDown className="h-4 w-4 text-[#a3a3a3]" /> : <ChevronRight className="h-4 w-4 text-[#a3a3a3]" />
                      ) : null}
                    </div>
                  </ListRow>

                  {/* Expanded collections */}
                  {isPackage && isExpanded && item.collections && (
                    <div className="flex flex-col gap-[2px] ml-[60px] mt-[2px]">
                      {item.collections.map((col, idx) => (
                        <div
                          key={`${item.id}-col-${idx}`}
                          className="bg-white/60 rounded-sm px-[12px] py-[8px] flex items-center gap-[16px]"
                        >
                          <span className="text-[13px] text-[#EC6724] font-medium">{formatPrice(col.total_cost)}$</span>
                          <span className="text-[13px] text-[#1a1a1a]">{col.collection_title}</span>
                          <span className="text-[13px] text-[#a3a3a3]">{formatPrice(col.total_kv)} m²</span>
                          <span className="text-[13px] text-[#a3a3a3]">× {formatPrice(col.price_per_kv)}$</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Kirim dialog */}
      <DialogContent className="costomModal border-0 gap-[0px] min-w-[494px] p-1 rounded-sm">
        <div className="p-3 h-[44px] font-bold pb-0 text-center mx-auto rounded-t-sm w-1/2 -mt-[48px] bg-[#47B13C] text-white">
          Kirim qo'shish
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="w-full">
            <div className="flex pl-2 items-center bg-input rounded-sm h-[90px]">
              <Input
                placeholder="0.00"
                value={price || undefined}
                type="number"
                min={0}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border-none h-[90px] placeholder:text-[32px] !text-[32px] font-semibold rounded-sm bg-transparent px-0"
              />
              <div className="text-4xl text-[#5D5D53] mx-4">$</div>
            </div>
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="datetime-local"
              className="w-full border-none h-[45px] mt-0.5 text-[14px] font-semibold rounded-sm px-[17px] py-[10px]"
            />
            <div className="text-center mt-1 w-full bg-input p-1 rounded-sm">
              <div className="flex items-center justify-center mt-[18px] mb-2">
                <Banknote />
              </div>
              <div className="flex cursor-pointer relative rounded-sm p-0.5 items-center bg-primary">
                <div
                  className={`${typePay === "cash" ? "left-0.5" : "left-[120px]"} transition-all duration-300 ease-in-out w-[118px] absolute rounded-sm top-0.5 h-[31px] bg-input`}
                ></div>
                <p
                  onClick={() => setTypePay("cash")}
                  className={`${typePay === "cash" ? "text-primary" : "text-input"} text-[13px] p-[6px] transition-all duration-300 ease-in-out z-10 w-full text-center rounded-sm font-medium`}
                >
                  Naqd
                </p>
                <p
                  onClick={() => setTypePay("online")}
                  className={`${typePay === "online" ? "text-primary" : "text-input"} text-[13px] p-[6px] transition-all duration-300 ease-in-out z-10 w-full text-center rounded-sm font-medium`}
                >
                  Onlayn
                </p>
              </div>
            </div>
          </div>
          <Textarea
            placeholder="Izoh"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="h-full w-full border-none focus:border-none outline-none mt-0.5 text-[13px] bg-input font-semibold rounded-sm px-2 py-2.5"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          type="submit"
          className="p-5 mt-[6px] rounded-sm h-[50px] bg-[#47B13C] hover:bg-[#3da032] text-white"
        >
          {loading ? "Qo'shilmoqda..." : "Kirimga qo'shish"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
