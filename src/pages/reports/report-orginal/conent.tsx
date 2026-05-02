import { useMeStore } from "@/store/me-store";
import { getMonth } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import qs from "qs";

import { ListRow } from "@/components/ui/list-row";
import BossFilterRow from "@/components/boss-filter-row";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { useYear } from "@/store/year-store";
import formatPrice from "@/utils/formatPrice";
import { apiRoutes } from "@/service/apiRoutes";

import { useDataFetch } from "./queries";
import { TData } from "./type";

const gridTemplate = "1fr 100px 100px 50px";

type SectionItem = {
  label: string;
  key: keyof TData;
  detail?: string;
  hasKv?: boolean;
};

export function Conent() {
  const { meUser } = useMeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const { year } = useYear();

  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(String(getMonth(new Date()) + 1))
  );
  const [filial] = useQueryState("filial");

  // Rejimlar — asl logika
  const isDealers = filial === "#dealers";
  const isFManager = meUser?.position?.role == 4;
  const isFilial = !!(filial || isFManager) && !isDealers;
  const isUmumiy = !filial && !isFManager;

  const { data, isLoading } = useDataFetch({
    queries: {
      filialId: isFManager ? meUser?.filial?.id : filial || undefined,
      month: +month || undefined,
      year,
    },
  });

  // Excel export
  const { mutate: excelExport, isPending: excelPending } = useMutation({
    mutationFn: async () => {
      const query = {
        month: +month || undefined,
        year,
        filialId: isFManager ? meUser?.filial?.id : filial || undefined,
      };
      const params = `?${qs.stringify(query, { arrayFormat: "repeat" })}`;
      window.location.href =
        import.meta.env.VITE_BASE_URL + apiRoutes.paperReportExportExcel + params;
    },
  });

  const goToDetail = (type: string, label: string, tip: string) => {
    const params = new URLSearchParams(location.search);
    params.set("tip", tip);
    const path = `${location.pathname}/detail/${type}?${params.toString()}`;
    push(label, path);
    navigate(path);
  };

  // ── Bo'lim 1 — Umumiy ma'lumotlar ──
  const generalItems: SectionItem[] = [
    { label: "Savdo aylanmasi", key: "turnover", hasKv: true },
    { label: "Qarz savdosi", key: "debt_trading", hasKv: true },
    { label: "Chegirma", key: "discount" },
    ...((isUmumiy || isDealers)
      ? [{ label: "Foyda hisobi", key: "profit" as keyof TData }]
      : []),
    ...(isUmumiy
      ? [{ label: "Foyda qoldig'i", key: "profit_remaining" as keyof TData }]
      : []),
    { label: "Ustama (navar)", key: "navar_income" },
  ];

  // ── Bo'lim 2 — Kirimlar ──
  const incomeItems: SectionItem[] = isDealers
    ? [
        { label: "Diller naqd", key: "dealer_cash", detail: "dealer_cash" },
        { label: "Diller o'tkazma", key: "dealer_terminal", detail: "dealer_terminal" },
      ]
    : isFilial
      ? [
          { label: "Kelgan qarzlar", key: "owed_debt", detail: "kelgan_qarz" },
          { label: "Oydan o'tgan pul", key: "openingBalance", detail: "openingBalance" },
          { label: "Bossdan kirim", key: "boss_income", detail: "boss_income" },
        ]
      : [
          { label: "Naqd kassa", key: "cash", detail: "naqd_kassa" },
          { label: "Terminal va o'tkazma", key: "terminal", detail: "terminal" },
          { label: "Inkassatsiya", key: "cashCollection", detail: "inkassatsiya" },
          { label: "Diller naqd", key: "dealer_cash", detail: "dealer_cash" },
          { label: "Diller o'tkazma", key: "dealer_terminal", detail: "dealer_terminal" },
          { label: "Kelgan qarzlar", key: "owed_debt", detail: "kelgan_qarz" },
          { label: "Oydan o'tgan pul", key: "openingBalance", detail: "openingBalance" },
          { label: "Bossdan kirim", key: "boss_income", detail: "boss_income" },
          { label: "Kentdan kirim", key: "kent_income", detail: "kent_income" },
          { label: "Boshqa kirimlar", key: "extra_income", detail: "extra_income" },
        ];

  // ── Bo'lim 3 — Chiqimlar ──
  const expenseItems: SectionItem[] = isDealers
    ? []
    : isFilial
      ? [
          { label: "Naqd kassa", key: "cash", detail: "naqd_kassa" },
          { label: "Terminal va o'tkazma", key: "terminal", detail: "terminal" },
          { label: "Inkassatsiya", key: "cashCollection", detail: "inkassatsiya" },
          { label: "Bossdan chiqim", key: "boss_expense", detail: "boss_expense" },
          { label: "Biznes xarajatlari", key: "business_expense", detail: "business_expense" },
          { label: "Qaytgan tovarlar", key: "return_orders", detail: "return_orders", hasKv: true },
          { label: "Ustama(navar)dan xarajat", key: "navar_expense", detail: "navar_expense" },
        ]
      : [
          { label: "Biznes xarajatlari", key: "business_expense", detail: "business_expense" },
          { label: "Bossdan chiqim", key: "boss_expense", detail: "boss_expense" },
          { label: "Kentga chiqim", key: "kent_expense", detail: "kent_expense" },
          { label: "Taminotchiga to'lov", key: "factory", detail: "factory" },
          { label: "Logistika xarajatlari", key: "logistics", detail: "logistics" },
          { label: "Bojxona xarajatlari", key: "tamojniy", detail: "tamojniy" },
          { label: "Qaytgan tovarlar", key: "return_orders", detail: "return_orders", hasKv: true },
          { label: "Ustama(navar)dan xarajat", key: "navar_expense", detail: "navar_expense" },
        ];

  // ── Bo'lim 4 — Qoldiqlar ──
  const balanceItems: SectionItem[] = isDealers
    ? []
    : isFilial
      ? [{ label: "Filial balansi", key: "filial_balance" }]
      : [
          { label: "Filial balansi", key: "filial_balance" },
          { label: "Menejer balansi", key: "manager_balance" },
          { label: "Hisobchi balansi", key: "accountant_balance" },
        ];

  const renderSection = (
    items: SectionItem[],
    priceColor: string,
    hasChevron: boolean,
    sectionTip?: string
  ) => {
    if (items.length === 0) return null;
    return (
      <div className="flex flex-col gap-[4px]">
        {items.map((item) => {
          const d = data?.[item.key];
          const clickable = hasChevron && !!item.detail;
          return (
            <ListRow
              key={item.key}
              gridTemplate={gridTemplate}
              minHeight={60}
              className="pl-[20px]"
              onClick={clickable ? () => goToDetail(item.detail!, item.label, sectionTip!) : undefined}
            >
              <span className="text-[15px] text-[#1a1a1a]">{item.label}</span>
              <span className="text-[15px] text-[#1a1a1a]">
                {item.hasKv && d?.kv ? `${d.kv.toFixed(2)} m²` : ""}
              </span>
              <span className="text-[15px] font-medium text-right" style={{ color: priceColor }}>
                {formatPrice(d?.price || 0)} $
              </span>
              {clickable ? (
                <div className="flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-[#a3a3a3]" />
                </div>
              ) : (
                <span />
              )}
            </ListRow>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Toolbar — Boss Dashboard style filters + Excel button (no bg) */}
      <div className="mb-[10px] shrink-0">
        <BossFilterRow hideFilial={isFManager}>
          <button
            onClick={() => excelExport()}
            disabled={excelPending}
            className="h-[34px] px-[10px] flex items-center justify-center shrink-0 hover:opacity-70 transition disabled:opacity-50"
            title="Excel export"
          >
            {excelPending ? (
              <Loader className="w-[18px] h-[18px] animate-spin text-[#a3a3a3]" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip_xls_gen)">
                  <path d="M10.3725 0.0113551L0.2925 1.92386C0.122344 1.9562 0 2.11089 0 2.28385V15.7164C0 15.8893 0.122344 16.044 0.2925 16.0764L10.3725 17.9889C10.395 17.9931 10.4175 18.0001 10.44 18.0001C10.523 18.0001 10.6003 17.9748 10.665 17.9214C10.748 17.8524 10.8 17.747 10.8 17.6401V0.360105C10.8 0.25323 10.748 0.147761 10.665 0.0788551C10.582 0.00994889 10.478 -0.00833238 10.3725 0.0113551ZM11.52 2.1601V4.6801H12.24V5.4001H11.52V7.2001H12.24V7.9201H11.52V9.7201H12.24V10.4401H11.52V12.6001H12.24V13.3201H11.52V15.8401H16.92C17.3166 15.8401 17.64 15.5167 17.64 15.1201V2.88011C17.64 2.48354 17.3166 2.1601 16.92 2.1601H11.52ZM12.96 4.6801H15.84V5.4001H12.96V4.6801ZM2.4075 5.6476H4.2525L5.22 7.66135C5.29594 7.82026 5.36344 8.01573 5.4225 8.2351H5.43375C5.47172 8.10432 5.54484 7.89901 5.6475 7.63885L6.71625 5.6476H8.40375L6.39 8.9776L8.46 12.3751H6.67125L5.50125 10.1814C5.45766 10.0998 5.41266 9.94932 5.36625 9.73135H5.355C5.3325 9.83401 5.27906 9.99432 5.1975 10.2039L4.0275 12.3751H2.2275L4.37625 9.01135L2.4075 5.6476ZM12.96 7.2001H15.84V7.9201H12.96V7.2001ZM12.96 9.7201H15.84V10.4401H12.96V9.7201ZM12.96 12.6001H15.84V13.3201H12.96V12.6001Z" fill="#1A1A1A"/>
                </g>
                <defs>
                  <clipPath id="clip_xls_gen"><rect width="18" height="18" fill="white"/></clipPath>
                </defs>
              </svg>
            )}
          </button>
        </BossFilterRow>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-9 flex flex-col gap-[10px]">
              {renderSection(generalItems, "#1a1a1a", false)}
              {renderSection(incomeItems, "#47B13C", true, "income")}
              {renderSection(expenseItems, "#EF5C12", true, "expense")}
              {renderSection(balanceItems, "#58A0C6", false)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
