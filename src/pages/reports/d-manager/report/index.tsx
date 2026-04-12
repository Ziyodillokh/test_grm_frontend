import { useState, useEffect } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import {
  DollarSign,
  Calendar,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Plus,
  Banknote,
} from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
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

export default function DealerReportPage() {
  const { id, dealerId: dealerIdParam } = useParams();
  const { year } = useYear();
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(String(new Date().getMonth() + 1))
  );
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // If dealerId param exists (from /dealer/:dealerId), use it directly
  // Otherwise fetch kassa to get dealer filial info (from old route with kassa id)
  const { data: kassaData } = useKassaReportSingle({
    id: id,
    enabled: Boolean(id) && !dealerIdParam,
    queries: {},
  });

  const dealerId = dealerIdParam || kassaData?.filial?.id || "";

  const { data, isLoading } = useDealerKassaDetail({
    dealerId,
    queries: {
      year,
      month: Number(month),
    },
    enabled: !!dealerId,
  });

  const flatData: DealerDetailItem[] =
    data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;
  const dealer = data?.pages?.[0]?.dealer;

  const toggleExpand = (itemId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  // === Приход dialog state ===
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
        toast.error("Введите корректную сумму");
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
      toast.success("Приход успешно добавлен");
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

  const cards = [
    { title: "Отправлено", price: formatPrice(dealer?.owed || 0) },
    { title: "Получено", price: formatPrice(dealer?.given || 0) },
    { title: "Qolgan", price: formatPrice(dealer?.balance || 0) },
  ];

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div>
        {/* Header */}
        <div className="px-5 h-[64px] flex items-center gap-2 border-b border-border bg-sidebar">
          <p className="text-[20px] mr-auto font-medium">
            {dealer?.title || kassaData?.filial?.title || ""}
          </p>

          <FilterSelect
            placeholder="Oy"
            className="border-border max-w-[160px] w-full border-l"
            options={MonthsArray}
            name="month"
            icons={<Calendar size={18} />}
            defaultValue={String(new Date().getMonth() + 1)}
          />

          {id && !dealerIdParam && (
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="h-full border-l border-border rounded-none px-4 bg-[#89A143] text-white hover:bg-[#799132]"
              >
                <Plus size={18} className="mr-1" />
                Приход
              </Button>
            </DialogTrigger>
          )}
        </div>

        {/* Card sort */}
        <div className="flex bg-sidebar border-b border-border">
          <div className="p-5 pl-7 w-full border-border border-r max-w-[350px]">
            <div className="flex items-center">
              <DollarSign size={48} />
              <div>
                <p className="text-[12px]">Jami qarz</p>
                <p className="text-[22px] font-bold text-foreground">
                  {formatPrice(dealer?.balance || 0)} $
                </p>
              </div>
            </div>
          </div>
          <div className="grid w-full grid-cols-3">
            {cards.map((e) => (
              <div
                key={e.title}
                className="bg-sidebar h-[78px] border-border border-r border-b flex justify-between items-center px-4 py-5"
              >
                <div>
                  <p className="text-[12px] mb-0.5">{e.title}</p>
                  <p className="text-[15px] font-medium">{e.price} $</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Period totals */}
        {totals && (
          <div className="bg-[#EEEEEE] dark:bg-muted/50 flex">
            <p className="p-[20px] border-border border-r text-[14px] w-full">
              Davriy balans
            </p>
            <p className="p-[20px] border-border border-r text-[14px] w-full text-[#FF6600]">
              Отправлено: {formatPrice(totals.period_owed || 0)} $
            </p>
            <p className="p-[20px] border-border border-r text-[14px] w-full text-[#89A143]">
              Получено: {formatPrice(totals.period_given || 0)} $
            </p>
            <p className="p-[20px] text-[14px] w-full font-bold">
              Qolgan: {formatPrice(totals.period_balance || 0)} $
            </p>
          </div>
        )}

        {/* Table */}
        <div className="w-full">
          {/* Table header */}
          <div className="grid grid-cols-[48px_160px_100px_130px_1fr_150px_40px] px-5 py-3 border-b border-border bg-muted/50 text-[13px] text-muted-foreground font-medium">
            <div></div>
            <div>Summasi</div>
            <div>Turi</div>
            <div>Sanasi</div>
            <div>Ma'lumoti</div>
            <div>To'lovchi</div>
            <div></div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              Yuklanmoqda...
            </div>
          )}

          {/* Table rows */}
          {flatData.map((item) => {
            const isPackage = item.entry_type === "package";
            const isExpanded = expandedRows.has(item.id);
            const hasCollections =
              isPackage && item.collections && item.collections.length > 0;

            return (
              <div key={item.id}>
                {/* Main row */}
                <div
                  className={`grid grid-cols-[48px_160px_100px_130px_1fr_150px_40px] px-5 py-3 border-b border-border items-center ${
                    hasCollections ? "cursor-pointer hover:bg-muted/30" : ""
                  }`}
                  onClick={() => {
                    if (hasCollections) toggleExpand(item.id);
                  }}
                >
                  {/* Icon */}
                  <div>
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded ${
                        isPackage
                          ? "bg-[#FF6600] text-white"
                          : "bg-[#89A143] text-white"
                      }`}
                    >
                      {isPackage ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Summasi */}
                  <div>
                    <span
                      className={`font-bold text-[16px] ${
                        isPackage ? "text-[#FF6600]" : "text-[#89A143]"
                      }`}
                    >
                      {formatPrice(item.total_cost || 0)} $
                    </span>
                  </div>

                  {/* Turi */}
                  <div
                    className={`text-[13px] font-medium ${
                      isPackage ? "text-[#FF6600]" : "text-[#89A143]"
                    }`}
                  >
                    {isPackage ? "Пакет" : "To'lov"}
                  </div>

                  {/* Sanasi */}
                  <div className="text-[13px]">
                    {format(new Date(item.date), "dd MMM yyyy")}
                  </div>

                  {/* Ma'lumoti */}
                  <div className="text-[13px]">
                    {isPackage ? (
                      <span className="font-medium">
                        {item.title || "Пакет"}
                        <span className="text-muted-foreground font-normal ml-2">
                          {item.total_kv
                            ? `${formatPrice(item.total_kv)} m²`
                            : ""}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {item.comment || ""}
                        {item.is_online && (
                          <span className="ml-2 text-[#58A0C6]">
                            (онлайн)
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* To'lovchi */}
                  <div className="text-[13px]">
                    {!isPackage && item.who_paid ? item.who_paid : ""}
                  </div>

                  {/* Chevron */}
                  <div className="flex items-center justify-center">
                    {hasCollections ? (
                      isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )
                    ) : null}
                  </div>
                </div>

                {/* Expanded collection rows */}
                {isPackage && isExpanded && item.collections && (
                  <div className="bg-muted/20">
                    {item.collections.map((col, idx) => (
                      <div
                        key={`${item.id}-col-${idx}`}
                        className="grid grid-cols-[48px_160px_100px_130px_1fr_150px_40px] px-5 py-2 border-b border-border/50 items-center"
                      >
                        <div></div>
                        <div className="text-[13px] text-[#FF6600] font-medium pl-1">
                          {formatPrice(col.total_cost)} $
                        </div>
                        <div></div>
                        <div></div>
                        <div className="text-[13px]">
                          <span>{col.collection_title}</span>
                          <span className="text-muted-foreground ml-3">
                            {formatPrice(col.total_kv)} m²
                          </span>
                          <span className="text-muted-foreground ml-3">
                            × {formatPrice(col.price_per_kv)} $
                          </span>
                        </div>
                        <div></div>
                        <div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {!isLoading && flatData.length === 0 && (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              Ma'lumot topilmadi
            </div>
          )}
        </div>
      </div>

      {/* Приход dialog */}
      <DialogContent className="costomModal border-0 gap-[0px] min-w-[494px] p-1 rounded-[10px]">
        <div className="p-3 h-[44px] font-bold pb-0 text-center mx-auto rounded-t-[7px] w-1/2 -mt-[48px] bg-[#89A143] text-white">
          Добавление прихода
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="w-full">
            <div className="flex pl-2 items-center bg-input rounded-[7px] h-[90px]">
              <Input
                placeholder="0.00"
                value={price || undefined}
                type="number"
                min={0}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border-none h-[90px] placeholder:text-[32px] !text-[32px] font-semibold rounded-[7px] bg-transparent px-0"
              />
              <div className="text-4xl text-[#5D5D53] mx-4">$</div>
            </div>
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="datetime-local"
              className="w-full border-none h-[45px] mt-0.5 text-[14px] font-semibold rounded-[7px] px-[17px] py-[10px]"
            />
            <div className="text-center mt-1 w-full bg-input p-1 rounded-[7px]">
              <div className="flex items-center justify-center mt-[18px] mb-2">
                <Banknote />
              </div>
              <div className="flex cursor-pointer relative rounded-[5px] p-0.5 items-center bg-primary">
                <div
                  className={`${typePay === "cash" ? "left-0.5" : "left-[120px]"} transition-all duration-300 ease-in-out w-[118px] absolute rounded-[3px] top-0.5 h-[31px] bg-input`}
                ></div>
                <p
                  onClick={() => setTypePay("cash")}
                  className={`${typePay === "cash" ? "text-primary" : "text-input"} text-[13px] p-[6px] transition-all duration-300 ease-in-out z-10 w-full text-center rounded-[3px] font-medium`}
                >
                  Наличий
                </p>
                <p
                  onClick={() => setTypePay("online")}
                  className={`${typePay === "online" ? "text-primary" : "text-input"} text-[13px] p-[6px] transition-all duration-300 ease-in-out z-10 w-full text-center rounded-[3px] font-medium`}
                >
                  Онлайн
                </p>
              </div>
            </div>
          </div>
          <Textarea
            placeholder="Комментария"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="h-full w-full border-none focus:border-none outline-none mt-0.5 text-[13px] bg-input font-semibold rounded-[7px] px-2 py-2.5"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          type="submit"
          className="p-5 mt-[6px] rounded-[7px] h-[50px] bg-[#89A143] hover:bg-[#799132] text-white"
        >
          {loading ? "Добавление..." : "Добавить в приход"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
