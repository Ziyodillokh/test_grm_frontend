import { useMeStore } from "@/store/me-store";
import { format, getMonth } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";
import { forwardRef } from "react";
import { useDataFetch } from "./queries";
import { useYear } from "@/store/year-store";

function RowUI({
  id,
  title,
  price,
  kv,
  price1,
  price2,
  isbordereble = true,
}: {
  id?: string;
  title: string;
  price: number;
  kv?: number;
  price1?: number;
  price2?: number;
  isbordereble?: boolean;
}) {
  return (
    <div
      className={`flex items-center w-full border-border/20 ${isbordereble ? "border-b" : ""}`}
    >
      <p
        className={`${id ? "pr-[23px]" : "px-[23px]"}  py-[11px] flex items-center gap-[3px]  w-[379px] text-[#272727] text-[15px] border-border/20 border-r font-medium`}
      >
        {id ? (
          <TableAction
            ShowPreview={false}
            ShowUpdate={false}
            id={id}
            url={apiRoutes.paperReport}
            refetchUrl={apiRoutes.paperReport}
          />
        ) : (
          ""
        )}
        {title}
      </p>
      {kv || kv == 0 ? (
        <p className="px-[23px] py-[11px] w-[110px]  text-nowrap text-[#272727] text-[15px]  border-border/20 border-r font-medium">
          {kv == 0 ? "-" : `${kv.toFixed(2)}м²`}
        </p>
      ) : (
        ""
      )}
      {price1 || price1 == 0 ? (
        <p className="px-[23px] py-[11px] w-[120px]  text-nowrap text-[#272727] text-[15px]  border-border/20 border-r font-medium">
          {price1 == 0 ? "-" : `$${price1.toFixed(2)}`}
        </p>
      ) : (
        ""
      )}
      {price2 || price2 == 0 ? (
        <p className="px-[23px] py-[11px] w-[120px]  text-nowrap text-[#272727] text-[15px]  border-border/20 border-r font-medium">
          {price2 == 0 ? "-" : `$${price2.toFixed(2)}`}
        </p>
      ) : (
        ""
      )}
      {
        <p className="px-[23px] py-[11px]  w-[120px] text-nowrap text-[#272727] text-[15px] font-medium">
          {price == 0 ? "-" : `$${price.toFixed(2)}`}
        </p>
      }
    </div>
  );
}

export const Conent = forwardRef<HTMLDivElement>((_, ref) => {
  const { meUser } = useMeStore();
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(getMonth(new Date()) + 1 + "")
  );

  const [filial] = useQueryState("filial");
  const {year}= useYear();
  
  const { data } = useDataFetch({
    queries: {
      filialId:
        meUser?.position?.role == 4 ? meUser?.filial?.id : filial || undefined,
      month: +month || undefined,
      year,
    },
  });

  return (
    <div
      ref={ref}
      className="min-h-full flex flex-col w-full border-border border-x"
    >
      <div className="flex items-center border-border border-b min-h-[56px] gap-[100px] justify-center">
        <p className="text-[13px] text-[#272727] font-semibold">
          {format(new Date(2025, +month - 1, 1), "MMMM")} {year}
        </p>
        <p className="text-[17px] text-[#272727] font-extrabold">
          {meUser?.position?.role == 4 ? meUser?.filial?.name : "Филиал"}
        </p>
        <p className="text-[13px] text-[#272727] font-semibold">
          {meUser?.firstName} {meUser?.lastName}
        </p>
      </div>

      <div className="w-full max-w-[610px] max-h-[700px] mx-auto bg-white rounded-2xl m-[20px] ">
        <div className=" max-h-[620px]  scrollCastom ">
          <div className="bg-[#F9F9F9] rounded-2xl m-2">
            <RowUI
              title={"Savdo aylanmasi"}
              price={data?.turnover?.price || 0}
              kv={data?.turnover?.kv || 0}
            />
            <RowUI
              title={"Qarz savdosi"}
              price={data?.debt_trading?.price || 0}
              kv={data?.debt_trading?.kv || 0}
            />
            <RowUI
              title={"Chegirma(Skidka)"}
              price={data?.discount?.price || 0}
              kv={data?.discount?.kv || 0}
            />
            <RowUI
              title={"Foyda hisobi"}
              price={data?.profit?.price || 0}
              kv={data?.profit?.kv || 0}
              isbordereble={false}
            />
          </div>
          {filial == "#dealers" ? (
            <div className="bg-[#85D188]/10 rounded-2xl m-2">
              <RowUI
                title={"Diller Naqd"}
                price={data?.dealer_cash?.price || 0}
                kv={data?.dealer_cash?.kv || 0}
              />
              <RowUI
                title={"Diller perechesleniya"}
                price={data?.dealer_terminal?.price || 0}
                kv={data?.dealer_terminal?.kv || 0}
              />
            </div>
          ) : (
            <div className="bg-[#85D188]/10 rounded-2xl m-2">
              {!filial && meUser?.position?.role != 4 && (
                <>
                  <RowUI
                    title={"Naqd kassa"}
                    price={data?.cash?.price || 0}
                    kv={data?.cash?.kv || 0}
                  />
                  <RowUI
                    title={"Terminal va perechesleniya"}
                    price={data?.terminal?.price || 0}
                    kv={data?.terminal?.kv || 0}
                  />
                  <RowUI
                    title={"Inkassatsiya"}
                    price={data?.cash_collection?.price || 0}
                    kv={data?.cash_collection?.kv || 0}
                  />
                  <RowUI
                    title={"Diller Naqd"}
                    price={data?.dealer_cash?.price || 0}
                    kv={data?.dealer_cash?.kv || 0}
                  />
                  <RowUI
                    title={"Diller perechesleniya"}
                    price={data?.dealer_terminal?.price || 0}
                    kv={data?.dealer_terminal?.kv || 0}
                  />
                </>
              )}

              <RowUI
                title={"Kelgan qarzlar"}
                price={data?.owed_debt?.price || 0}
                kv={data?.owed_debt?.kv || 0}
              />
              <RowUI
                title={"Oldingi oydan o'tgan pul"}
                price={data?.opening_balance?.price || 0}
                kv={data?.opening_balance?.kv || 0}
              />
              <RowUI
                title={"Filial balansi"}
                price={data?.filial_balance?.price || 0}
                kv={data?.filial_balance?.kv || 0}
              />
              <RowUI
                title={"Boss prixod"}
                price={data?.boss_income?.price || 0}
                kv={data?.boss_income?.kv || 0}
              />
              {(filial || meUser?.position?.role == 4)  && (
                <RowUI
                  title={"Navar"}
                  price={data?.navar_income?.price || 0}
                  kv={data?.navar_income?.kv || 0}
                />
              )}
              {!filial && meUser?.position?.role != 4 && (
                <>
                  <RowUI
                    title={"Kent prixod"}
                    price={data?.kent_income?.price || 0}
                    kv={data?.kent_income?.kv || 0}
                    isbordereble={false}
                  />
                </>
              )}
            </div>
          )}

          {filial != "#dealers" && (
            <div className="bg-[#D76B43]/7 rounded-2xl m-2">
              {!filial && meUser?.position?.role != 4 && (
                <RowUI
                  title={"Kent rasxod"}
                  price={data?.kent_expense?.price || 0}
                  kv={data?.kent_expense?.kv || 0}
                />
              )}
              {(filial || meUser?.position?.role == 4)  && (
                <>
                  <RowUI
                    title={"Naqd kassa"}
                    price={data?.cash?.price || 0}
                    kv={data?.cash?.kv || 0}
                  />
                  <RowUI
                    title={"Terminal va perechesleniya"}
                    price={data?.terminal?.price || 0}
                    kv={data?.terminal?.kv || 0}
                  />
                  <RowUI
                    title={"Inkassatsiya"}
                    price={data?.cash_collection?.price || 0}
                    kv={data?.cash_collection?.kv || 0}
                  />
                </>
              )}
              <RowUI
                title={"Boss rasxod"}
                price={data?.boss_expense?.price || 0}
                kv={data?.boss_expense?.kv || 0}
              />
              <RowUI
                title={"Biznes rasxod"}
                price={data?.business_expense?.price || 0}
                kv={data?.business_expense?.kv || 0}
              />
              {!filial && meUser?.position?.role != 4 && (
                <>
                  <RowUI
                    title={"Yetkazib beruvchi(Pastavshik)"}
                    price={data?.dealer_cash?.price || 0}
                    kv={data?.dealer_cash?.kv || 0}
                  />
                  <RowUI
                    title={"Bojxona(tamojniy)"}
                    price={data?.debt_trading?.price || 0}
                    kv={data?.debt_trading?.kv || 0}
                  />
                </>
              )}
              <RowUI
                title={"Qaytgan Tavarlar(Vazvrad)"}
                isbordereble={false}
                price={data?.return_orders?.price || 0}
                kv={data?.return_orders?.kv || 0}
              />
              {(filial || meUser?.position?.role == 4)  && (
                <RowUI
                  title={"Navar Rasxod"}
                  isbordereble={false}
                  price={data?.navar_expense?.price || 0}
                  kv={data?.navar_expense?.kv || 0}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
