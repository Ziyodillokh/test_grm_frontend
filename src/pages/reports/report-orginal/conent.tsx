import { useMeStore } from "@/store/me-store";
import { format, getMonth } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import { forwardRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useDataFetch } from "./queries";
import { useYear } from "@/store/year-store";

// Qator komponenti — chevron va onClick qo'shildi
function RowUI({
  title,
  price,
  kv,
  hasChevron,
  onClick,
  isLast = false,
}: {
  title: string;
  price: number;
  kv?: number;
  hasChevron?: boolean;
  onClick?: () => void;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center w-full border-border/20 ${!isLast ? "border-b" : ""} ${
        hasChevron ? "cursor-pointer hover:bg-black/3" : ""
      }`}
      onClick={hasChevron ? onClick : undefined}
    >
      <p className="px-[23px] py-[11px] flex-1 text-[#272727] text-[15px] font-medium">
        {title}
      </p>
      {kv !== undefined && kv !== null && (
        <p className="px-[12px] py-[11px] min-w-[100px] text-nowrap text-[#272727] text-[15px] font-medium">
          {kv === 0 ? "-" : `${kv.toFixed(2)}m²`}
        </p>
      )}
      <p className="px-[12px] py-[11px] min-w-[110px] text-nowrap text-right text-[#272727] text-[15px] font-medium">
        {price === 0 ? "-" : `$${price.toFixed(2)}`}
      </p>
      {hasChevron ? (
        <ChevronRight className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
      ) : (
        <div className="w-4 mr-3 shrink-0" />
      )}
    </div>
  );
}

export const Conent = forwardRef<HTMLDivElement>((_, ref) => {
  const { meUser } = useMeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(getMonth(new Date()) + 1 + "")
  );
  const [filial] = useQueryState("filial");
  const { year } = useYear();

  const { data } = useDataFetch({
    queries: {
      filialId:
        meUser?.position?.role == 4 ? meUser?.filial?.id : filial || undefined,
      month: +month || undefined,
      year,
    },
  });

  // Sahifaga o'tish — detail/:type + query params saqlash
  const goToDetail = (type: string) => {
    navigate(`${location.pathname}/detail/${type}${location.search || ""}`);
  };

  // Rejimlar
  const isDealers = filial === "#dealers";
  const isFManager = meUser?.position?.role == 4;
  const isFilial = !!(filial || isFManager);
  const isUmumiy = !filial && !isFManager;

  return (
    <div
      ref={ref}
      className="h-full flex flex-col w-full border-border border-x"
    >
      {/* Header */}
      <div className="flex items-center border-border border-b min-h-[56px] gap-[100px] justify-center">
        <p className="text-[13px] text-[#272727] font-semibold">
          {format(new Date(2025, +month - 1, 1), "MMMM")} {year}
        </p>
        <p className="text-[17px] text-[#272727] font-extrabold">
          {isFManager ? meUser?.filial?.name : "Филиал"}
        </p>
        <p className="text-[13px] text-[#272727] font-semibold">
          {meUser?.firstName} {meUser?.lastName}
        </p>
      </div>

      <div className="w-full max-w-[610px] mx-auto bg-white rounded-2xl m-[20px] mb-[20px] flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto scrollCastom">

          {/* OQ BO'LIM — Umumiy ko'rsatkichlar (chevron yo'q) */}
          <div className="bg-[#F9F9F9] rounded-2xl m-2">
            <RowUI
              title="Savdo aylanmasi"
              price={data?.turnover?.price || 0}
              kv={data?.turnover?.kv || 0}
            />
            <RowUI
              title="Qarz savdosi"
              price={data?.debt_trading?.price || 0}
              kv={data?.debt_trading?.kv || 0}
            />
            <RowUI
              title="Chegirma"
              price={data?.discount?.price || 0}
            />
            {(isUmumiy || isDealers) && (
              <RowUI
                title="Foyda hisobi"
                price={data?.profit?.price || 0}
              />
            )}
            {isUmumiy && (
              <RowUI
                title="Foyda qoldig'i"
                price={data?.profit_remaining?.price || 0}
              />
            )}
            <RowUI
              title="Navar"
              price={data?.navar_income?.price || 0}
              isLast
            />
          </div>

          {/* YASHIL BO'LIM — Kirimlar */}
          {isDealers ? (
            <div className="bg-[#85D188]/10 rounded-2xl m-2">
              <RowUI
                title="Diller Naqd"
                price={data?.dealer_cash?.price || 0}
                hasChevron
                onClick={() => goToDetail("dealer_cash")}
              />
              <RowUI
                title="Diller perechesleniya"
                price={data?.dealer_terminal?.price || 0}
                hasChevron
                onClick={() => goToDetail("dealer_terminal")}
                isLast
              />
            </div>
          ) : isFilial ? (
            <div className="bg-[#85D188]/10 rounded-2xl m-2">
              <RowUI
                title="Kelgan qarzlar"
                price={data?.owed_debt?.price || 0}
                hasChevron
                onClick={() => goToDetail("kelgan_qarz")}
              />
              <RowUI
                title="O'tgan pul"
                price={data?.opening_balance?.price || 0}
                hasChevron
                onClick={() => goToDetail("opening_balance")}
              />
              <RowUI
                title="Boss prixod"
                price={data?.boss_income?.price || 0}
                hasChevron
                onClick={() => goToDetail("boss_income")}
                isLast
              />
            </div>
          ) : (
            <div className="bg-[#85D188]/10 rounded-2xl m-2">
              <RowUI
                title="Naqd kassa"
                price={data?.cash?.price || 0}
                hasChevron
                onClick={() => goToDetail("naqd_kassa")}
              />
              <RowUI
                title="Terminal"
                price={data?.terminal?.price || 0}
                hasChevron
                onClick={() => goToDetail("terminal")}
              />
              <RowUI
                title="Inkassatsiya"
                price={data?.cash_collection?.price || 0}
                hasChevron
                onClick={() => goToDetail("inkassatsiya")}
              />
              <RowUI
                title="Diller Naqd"
                price={data?.dealer_cash?.price || 0}
                hasChevron
                onClick={() => goToDetail("dealer_cash")}
              />
              <RowUI
                title="Diller perechesleniya"
                price={data?.dealer_terminal?.price || 0}
                hasChevron
                onClick={() => goToDetail("dealer_terminal")}
              />
              <RowUI
                title="Kelgan qarzlar"
                price={data?.owed_debt?.price || 0}
                hasChevron
                onClick={() => goToDetail("kelgan_qarz")}
              />
              <RowUI
                title="O'tgan pul"
                price={data?.opening_balance?.price || 0}
                hasChevron
                onClick={() => goToDetail("opening_balance")}
              />
              <RowUI
                title="Boss prixod"
                price={data?.boss_income?.price || 0}
                hasChevron
                onClick={() => goToDetail("boss_income")}
              />
              <RowUI
                title="Kent prixod"
                price={data?.kent_income?.price || 0}
                hasChevron
                onClick={() => goToDetail("kent_income")}
              />
              <RowUI
                title="Qo'shimcha prixodlar"
                price={data?.extra_income?.price || 0}
                hasChevron
                onClick={() => goToDetail("extra_income")}
                isLast
              />
            </div>
          )}

          {/* TO'Q SARIQ BO'LIM — Chiqimlar */}
          {!isDealers && (
            <div className="bg-[#D76B43]/7 rounded-2xl m-2">
              {isUmumiy && (
                <RowUI
                  title="Kent rasxod"
                  price={data?.kent_expense?.price || 0}
                  hasChevron
                  onClick={() => goToDetail("kent_expense")}
                />
              )}
              {isFilial && (
                <>
                  <RowUI
                    title="Naqd kassa"
                    price={data?.cash?.price || 0}
                    hasChevron
                    onClick={() => goToDetail("naqd_kassa")}
                  />
                  <RowUI
                    title="Terminal"
                    price={data?.terminal?.price || 0}
                  />
                  <RowUI
                    title="Inkassatsiya"
                    price={data?.cash_collection?.price || 0}
                    hasChevron
                    onClick={() => goToDetail("inkassatsiya")}
                  />
                </>
              )}
              <RowUI
                title="Boss rasxod"
                price={data?.boss_expense?.price || 0}
                hasChevron
                onClick={() => goToDetail("boss_expense")}
              />
              <RowUI
                title="Biznes rasxod"
                price={data?.business_expense?.price || 0}
                hasChevron
                onClick={() => goToDetail("business_expense")}
              />
              {isUmumiy && (
                <>
                  <RowUI
                    title="Taminotchi (Pastavchik)"
                    price={data?.factory?.price || 0}
                    hasChevron
                    onClick={() => goToDetail("factory")}
                  />
                  <RowUI
                    title="Logistika"
                    price={data?.logistics?.price || 0}
                    hasChevron
                    onClick={() => goToDetail("logistics")}
                  />
                  <RowUI
                    title="Bojxona (tamojniy)"
                    price={data?.tamojniy?.price || 0}
                    hasChevron
                    onClick={() => goToDetail("tamojniy")}
                  />
                </>
              )}
              <RowUI
                title="Qaytgan Tavarlar"
                price={data?.return_orders?.price || 0}
                kv={data?.return_orders?.kv || 0}
              />
              {isFilial && (
                <RowUI
                  title="Navar Rasxod"
                  price={data?.navar_expense?.price || 0}
                  hasChevron
                  onClick={() => goToDetail("navar_expense")}
                  isLast
                />
              )}
            </div>
          )}

          {/* KO'K BO'LIM — Balanslar (chevron yo'q) */}
          {!isDealers && (
            <div className="bg-[#4A90D9]/8 rounded-2xl m-2">
              <RowUI
                title="Filial balansi"
                price={data?.filial_balance?.price || 0}
              />
              <RowUI
                title="Manager balansi"
                price={data?.manager_balance?.price || 0}
              />
              <RowUI
                title="Bugalter balansi"
                price={data?.accountant_balance?.price || 0}
                isLast
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
});
