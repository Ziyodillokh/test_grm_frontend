import { useMeStore } from "@/store/me-store";
import { getMonth } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import qs from "qs";

import { ListRow } from "@/components/ui/list-row";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray, Years } from "@/consts";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { useYear } from "@/store/year-store";
import formatPrice from "@/utils/formatPrice";
import useDataFetchFilial from "@/pages/filial/table/queries";
import { apiRoutes } from "@/service/apiRoutes";

import { useDataFetch } from "./queries";
import { TData } from "./type";

const yearsArray = Years.map((y) => ({ label: String(y), value: String(y) }));

const gridTemplate = "1fr 100px 100px 50px";

type SectionItem = {
  label: string;
  key: keyof TData;
  detail?: string;
  hasKv?: boolean;
};

const FilialIcon = (
  <span className="pl-[10px] shrink-0">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 15.75H15.75M2.25 5.25V6C2.25 6.59674 2.48705 7.16903 2.90901 7.59099C3.33097 8.01295 3.90326 8.25 4.5 8.25C5.09674 8.25 5.66903 8.01295 6.09099 7.59099C6.51295 7.16903 6.75 6.59674 6.75 6M2.25 5.25H6.75V6M2.25 5.25H15.75M2.25 5.25L3.75 2.25H14.25L15.75 5.25M6.75 6C6.75 6.59674 6.98705 7.16903 7.40901 7.59099C7.83097 8.01295 8.40326 8.25 9 8.25C9.59674 8.25 10.169 8.01295 10.591 7.59099C11.0129 7.16903 11.25 6.59674 11.25 6M6.75 6L11.25 5.25V6M11.25 6C11.25 6.59674 11.4871 7.16903 11.909 7.59099C12.331 8.01295 12.9033 8.25 13.5 8.25C14.0967 8.25 14.669 8.01295 15.091 7.59099C15.5129 7.16903 15.75 6.59674 15.75 6V5.25M3.75 15.7501V8.13757M14.25 15.7501V8.13757M6.75 15.75V12.75C6.75 12.3522 6.90804 11.9706 7.18934 11.6893C7.47064 11.408 7.85218 11.25 8.25 11.25H9.75C10.1478 11.25 10.5294 11.408 10.8107 11.6893C11.092 11.9706 11.25 12.3522 11.25 12.75V15.75" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
);

const CalendarIcon = (
  <span className="pl-[10px] shrink-0">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.25V5.25M6 2.25V5.25M3 8.25H15M8.25 11.25H9V13.5M4.5 3.75H13.5C14.3284 3.75 15 4.42157 15 5.25V14.25C15 15.0784 14.3284 15.75 13.5 15.75H4.5C3.67157 15.75 3 15.0784 3 14.25V5.25C3 4.42157 3.67157 3.75 4.5 3.75Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
);

const ClockIcon = (
  <span className="pl-[10px] shrink-0">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.99961 5.99951V8.99951L10.4996 10.4995M2.28711 8.24956C2.45518 6.59961 3.22481 5.06927 4.44916 3.95054C5.67351 2.8318 7.26688 2.20298 8.92527 2.18403C10.5837 2.16509 12.191 2.75736 13.4406 3.84784C14.6901 4.93832 15.4945 6.45067 15.7002 8.09636C15.9059 9.74205 15.4986 11.4059 14.5559 12.7704C13.6132 14.1349 12.2011 15.1046 10.5891 15.4945C8.97705 15.8843 7.27792 15.667 5.81586 14.8841C4.3538 14.1012 3.23115 12.8074 2.66211 11.2496M2.28711 14.9996V11.2496H6.03711" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
);

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

  // Filial options
  const { data: filialData } = useDataFetchFilial({
    queries: { type: "filial", limit: 50 },
  });
  const filialOption =
    filialData?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

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
          { label: "Oydan o'tgan pul", key: "opening_balance", detail: "opening_balance" },
          { label: "Bossdan kirim", key: "boss_income", detail: "boss_income" },
        ]
      : [
          { label: "Naqd kassa", key: "cash", detail: "naqd_kassa" },
          { label: "Terminal va o'tkazma", key: "terminal", detail: "terminal" },
          { label: "Inkassatsiya", key: "cash_collection", detail: "inkassatsiya" },
          { label: "Diller naqd", key: "dealer_cash", detail: "dealer_cash" },
          { label: "Diller o'tkazma", key: "dealer_terminal", detail: "dealer_terminal" },
          { label: "Kelgan qarzlar", key: "owed_debt", detail: "kelgan_qarz" },
          { label: "Oydan o'tgan pul", key: "opening_balance", detail: "opening_balance" },
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
          { label: "Inkassatsiya", key: "cash_collection", detail: "inkassatsiya" },
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
      {/* Toolbar — FilterSelects + Excel */}
      <div className="flex items-center gap-[4px] mb-[10px] shrink-0">
        <FilterSelect
          placeholder="Barchasi"
          disabled={isFManager}
          className="h-[42px] bg-white rounded-sm min-w-[160px]"
          options={[
            { value: "clear", label: "Barchasi" },
            { value: "#dealers", label: "Diller" },
            ...filialOption,
          ]}
          name="filial"
          defaultValue={isFManager ? meUser?.filial?.id : undefined}
          icons={FilialIcon}
        />
        <FilterSelect
          placeholder="Oy tanlang"
          className="h-[42px] bg-white rounded-sm min-w-[140px]"
          options={MonthsArray}
          name="month"
          defaultValue={String(getMonth(new Date()) + 1)}
          icons={CalendarIcon}
        />
        <FilterSelect
          placeholder="Yil"
          className="h-[42px] bg-white rounded-sm min-w-[100px]"
          options={yearsArray}
          name="year"
          defaultValue={String(new Date().getFullYear())}
          icons={ClockIcon}
        />
        <button
          onClick={() => excelExport()}
          disabled={excelPending}
          className="h-[42px] px-[14px] bg-white rounded-sm flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
