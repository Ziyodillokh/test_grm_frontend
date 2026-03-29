import useDataFetch from "./queries";
import { useMeStore } from "@/store/me-store";
import { format, getMonth } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";
import { getAllData } from "@/service/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { TStaticData } from "./type";
import { forwardRef } from "react";
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
  const {year}= useYear()

  const { data: StatucData } = useQuery({
    queryKey: [apiRoutes.paperReportStatic, meUser, filial, month],
    queryFn: () =>
      getAllData<TStaticData, object>(apiRoutes.paperReportStatic, {
        month: +month || undefined,
        year,
        filialId:
          meUser?.position?.role == 4
            ? meUser?.filial?.id
            : filial || undefined,
      }),
  });

  const { data } = useDataFetch({
    queries: {
      filialId:
        meUser?.position?.role == 4 ? meUser?.filial?.id : filial || undefined,
      month: +month || undefined,
      year,
    },
  });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
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
        <div className=" max-h-[600px]  scrollCastom ">
          <div className="bg-[#F9F9F9] rounded-2xl m-2">
            <RowUI
              title={"Savdo naqd"}
              price={StatucData?.savdoNarxi || 0}
              kv={StatucData?.savdoKv || 0}
            />
            <RowUI
              title={"Kelgan qarzlar"}
              price={StatucData?.kelganQarzlar || 0}
              kv={0}
            />
            <RowUI
              title={"Oldingi oydan o'tgan pul"}
              price={StatucData?.qolganPul || 0}
              kv={0}
            />
            <RowUI
              title={"Terminal va perechisleniya savdosi"}
              price={StatucData?.terminal || 0}
              kv={0}
              isbordereble={false}
            />
          </div>
          <div className="bg-[#85D188]/10 rounded-2xl m-2">
            <RowUI
              title={"Inkassatsiya"}
              price={StatucData?.inkasatsiya || 0}
              kv={0}
            />
            {!filial && meUser?.position?.role != 4 && (
              <RowUI
                title={"Naqd kassa"}
                price={StatucData?.naqdFilial || 0}
                kv={0}
              />
            )}
            {!filial && meUser?.position?.role != 4 && (
              <>
                <RowUI
                  title={"Diller naqd"}
                  price={StatucData?.naqdDealer || 0}
                  kv={0}
                />
                <RowUI
                  title={"Diller perechisleniya"}
                  price={StatucData?.terminalDealer || 0}
                  kv={0}
                />
                <RowUI
                  title={"Foyda 1"}
                  price={StatucData?.foyda1 || 0}
                  kv={StatucData?.savdoKv || 0}
                />
                <RowUI
                  title={"Boss - prixod - rasxod"}
                  price={StatucData?.bossRasxod || 0}
                  price1={StatucData?.bossPrixod || 0}
                  isbordereble={false}
                />
              </>
            )}
          </div>
          {/* {StatucData?.davlatlar?.map((item) => (
            <RowUI
              key={item?.countryId}
              title={item?.countryName}
              price={item?.totalPrice || 0}
              kv={item?.totalKv || 0}
            />
          ))} */}
          <div className="bg-[#D76B43]/7 rounded-2xl m-2">
            <RowUI
              title={"Qarzga sotilgan"}
              price={StatucData?.qarzgaSotilganNarx || 0}
              kv={StatucData?.qarzgaSotilganKv || 0}
            />

            <RowUI
              title={"Qaytgan tovarlar"}
              price={StatucData?.qaytganNarx || 0}
              kv={StatucData?.qaytganKv || 0}
            />

            <RowUI title={"Skidka"} price={StatucData?.skidka || 0} kv={0} />

            <RowUI
              title={"Biznes rasxod"}
              price={StatucData?.magazinRasxod || 0}
              kv={0}
            />

            {!filial && meUser?.position?.role != 4 && (
              <>
                <RowUI
                  title={"Postavshik"}
                  price={StatucData?.postavshik || 0}
                  price1={StatucData?.postavshikTerminal || 0}
                />

                <RowUI
                  title={"Tamojnya"}
                  price={StatucData?.tamojnya || 0}
                  kv={0}
                  isbordereble={false}
                />

                {/* <RowUI
                title={"Bank harajatlari"}
                price={StatucData?.bank || 0}
                kv={0}
              />
                <RowUI
                title={"Kredit"}
                price={StatucData?.kredit || 0}
                kv={0}
              /> */}
              </>
            )}
          </div>
          {/* {!filial && meUser?.position?.role != 4 && (
            <div className="border border-border m-[20px] ">
              <p className="text-primary px-3">Qarzlar</p>
              {StatucData?.debts &&
                StatucData?.debts?.map((item) => (
                  <RowUI
                    title={item?.fullName}
                    price1={item?.totalDebt}
                    price2={item?.monthlyOwed }
                    price={item?.monthlyGiven || 0}
                  />
                ))}
            </div>
          )} */}
          {flatData?.map((e) => (
            <RowUI
              key={e.id}
              id={e.id}
              title={e.title}
              price={e.price}
              kv={e.kv}
            />
          ))}
        </div>
        {/* <div className="flex  items-center w-full border-border border-b">
          <FormTextInput
            classNameInput="min-w-[378px] bg-background"
            name="title"
            placeholder="Пишите сюда"
          />
          <FormTextInput
            classNameInput="min-w-[100px] bg-background"
            name="kv"
            type="number"
            placeholder="kv"
          />
          <FormTextInput
            classNameInput="min-w-[100px] bg-background"
            name="price"
            type="number"
            placeholder="price"
          />
        </div> */}
      </div>

      {/* {meUser?.position?.role == 4 && (
        <div className="flex items-center justify-center border-border border-t mt-auto p-3">
          <Button
            disabled={month !== getMonth(new Date()) + 1 + ""}
            className="w-full rounded-md max-w-[610px] bg-[#272727]"
          >
            Добавить
          </Button>
        </div>
      )} */}
    </div>
  );
});
