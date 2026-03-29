import { FileOutput, Loader, PlusCircle, Send, Store } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

import { useStatementsDataDetail, useStatementsId } from "../table/queries";
import AddEmployeeModal from "./AddEmployeeModal";
import { StatementEmployeeColumns } from "./columns";
import { Statement } from "../type";
import FilterSelect from "@/components/filters-ui/filter-select";
import { usefilialWarehouseFetch } from "@/pages/reports/m-manager/remaider/queries";
import { useQueryState } from "nuqs";
import { useStatusMutation } from "../form/action";
import CardSort from "./card-sort";
import ActionPage from "./form";
import { useMeStore } from "@/store/me-store";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [filial] = useQueryState("filial");
  const {meUser} = useMeStore();
  const { data, isLoading } = useStatementsDataDetail({
    queries: {
      payrollId: id,
      filialId: filial == "all" ? undefined : filial || undefined,
    },
  });
  const { data: dataSingle } = useStatementsId({
    id: id,
  });

  function isStatement(obj: any): obj is Statement {
    return (
      obj &&
      typeof obj === "object" &&
      "id" in obj &&
      "createdAt" in obj &&
      "user" in obj &&
      typeof obj.user === "object" &&
      "payroll" in obj &&
      typeof obj.payroll === "object"
    );
  }

  let flatData: Statement[] = [];
  if (data?.items) {
    flatData = data.items.filter(isStatement).map((item: any) => {
      // Ensure we're not passing any raw objects to React
      const transformedItem = {
        ...item,
        id: String(item.id), // Ensure id is a string
        user: {
          firstName: String(item.user?.firstName || ""),
          lastName: String(item.user?.lastName || ""),
          avatar: item.user?.avatar,
          salary: Number(item.user?.salary || 0),
          filial: String(item.user?.filial?.title || ""),
        },
        payroll: {
          bonus: Number(item.payroll?.bonus || 0),
          award: Number(item.payroll?.award || 0),
          total: Number(item.payroll?.total || 0),
          plastic: Number(item.payroll?.plastic || 0),
          prepayment: Number(item.payroll?.prepayment || 0),
          in_hand: Number(item.payroll?.in_hand || 0),
        },
      };
      return transformedItem;
    });
  }


  const { data: DataFilial } = usefilialWarehouseFetch({
    queries: { limit: 50 },
  });
  const filialOption =
    DataFilial?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

  const { mutate, isPending } = useStatusMutation();
  return (
    <>
      <div className="bg-sidebar border-border border-b  px-[20px] h-[64px] items-center  flex   ">
       {meUser?.position?.role == 11 &&   <Button
          onClick={() =>
            mutate({
              id: id || "",
              status: "InProgress",
            })
          }
          disabled={dataSingle?.status != "Sent" && isPending}
          variant="outline"
          className="border-y-0 h-full"
        >
          {isPending ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {dataSingle?.status == "Sent" ? "Отправить ведомость" : "Отправлено"}
        </Button>}

        <FilterSelect
          icons={<Store />}
          className="w-full max-w-[170px] ml-auto"
          placeholder="Филиалы"
          name="filial"
          options={[{ label: "Все", value: "all" }, ...filialOption]}
        />
        <Button className="h-full  border-y-0 w-[140px]  " variant={"outline"}>
          <FileOutput className="mr-2 h-4 w-4" /> Экспорт
        </Button>
      {meUser?.position?.role == 11 &&  <Button
          className="h-full  border-y-0 w-[240px] "
          variant={"outline"}
          onClick={() => setIsAddEmployeeOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Добавить сотрудника
        </Button>}
      </div>

      <CardSort columnData={dataSingle}/>

      <div className="">
        <DataTable
          columns={StatementEmployeeColumns()}
          data={flatData}
          isLoading={isLoading}
        />
      </div>

      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        month={dataSingle?.month || ""}
        onClose={() => setIsAddEmployeeOpen(false)}
        statementId={id || ""}
      />

      <ActionPage  month={dataSingle?.month || ""}/>
      {/* <Update */}
    </>
  );
}
