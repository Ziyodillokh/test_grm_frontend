import FormTextInput from "@/components/forms/FormTextInput";
import Filters from "./filters";
import BarcodeQenerat from "@/components/barcode-generat";
import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { parseAsString, useQueryState } from "nuqs";
import { useMeStore } from "@/store/me-store";

export default function FormContent() {
  const { meUser } = useMeStore();
  
  const [barcode, setBarCode] = useQueryState("barcode");
  const [reportStatus] = useQueryState("reportStatus");
  const { watch,setValue } = useFormContext();
  const isMetric = watch("isMetric");
  const [tip] = useQueryState(
    "tip",
    parseAsString.withDefault(
      meUser?.position?.role == 7 || meUser?.position.role == 4
        ? "переучет"
        : "new"
    )
  );

  return (
    <div className="w-full max-h-[calc(100vh-66px)] scrollCastom border-border border-r ">
      <Filters />
      <div className="grid row-start  px-[40px] py-[20px] gap-2 lg:grid-cols-2">
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/country"
          classNameChild="h-[28px] p-2"
          name="country"
          placeholder="country"
          label="country"
          disabled={true}
        />
        
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/factory"
          name="factory"
          classNameChild="h-[28px] p-2"
          placeholder="factory"
          label="factory"
          disabled={true}
        />
        
        <FormTextInput
          classNameInput="h-[28px] p-2"
          name="code"
          placeholder="code"
          localChange={() => {
            setBarCode("new");
          }}
          label="code"
          disabled={tip !== "переучет" || reportStatus == "closed"}
        />
         <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/collection"
          name="collection"
          onLocalChange={(value)=>{
            const costomValue = value as {
              country: {
                id: string;
                title: string;
              };
              factory: {
                id: string;
                title: string;
              };
            };
            setValue("country", {
              value: costomValue?.country?.id,
              label: costomValue?.country?.title,
            })
            setValue("factory", {
              value: costomValue?.factory?.id,
              label: costomValue?.factory?.title,
            })
            setValue("model", {
              value: undefined,
              label: "",
            })
          }}
          classNameChild="h-[28px] p-2"
          placeholder="collection"
          label="collection"
          disabled={tip !== "переучет"|| reportStatus == "closed"}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl={`/model/by-collection/${watch("collection")?.value}`}
          name="model"
         
          classNameChild="h-[28px] p-2"
          placeholder="model"
          label="model"
          disabled={tip !== "переучет"|| reportStatus == "closed"}
        />
      <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          option={[
            { value: "true", label: "Метражный" },
            { value: "false", label: "Штучный" },
          ]}
          name="isMetric"
          classNameChild="h-[28px] p-2"
          placeholder="isMetric"
          label="isMetric"
          disabled={tip !== "переучет"|| reportStatus == "closed"}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/shape"
          name="shape"
          classNameChild="h-[28px] p-2"
          placeholder="shape"
          label="shape"
          disabled={tip !== "переучет"|| reportStatus == "closed"}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/size"
          name="size"
          classNameChild="h-[28px] p-2"
          placeholder="size"
          label="size"
          disabled={tip !== "переучет"|| reportStatus == "closed"}
        />
        <FormTextInput
          type="number"
          classNameInput="h-[28px] p-2"
          name="value"
          placeholder={isMetric?.value === "true"   ? "Длина" : "count"}
          disabled={tip !== "переучет"|| reportStatus == "closed"}
          label={isMetric?.value === "true" ? "Длина" : "count"}
          
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/color"
          name="color"
          classNameChild="h-[28px] p-2"
          placeholder="color"
          label="color"
          disabled={tip !== "переучет"|| reportStatus == "closed"}
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/style"
          name="style"
          classNameChild="h-[28px] p-2"
          placeholder="style"
          label="style"
          disabled={tip !== "переучет" || reportStatus == "closed"}
        />
      </div>
      <div className="bg-sidebar border-y text-primary border-border  h-[44px]  flex  items-center justify-end  ">
        {tip == "переучет" && reportStatus !== "closed"  &&<>
          <Button
            className={`h-full w-1/2 text-primary justify-center font-[16px] gap-1.5  border-none`}
            variant={"outline"}
            disabled={barcode == "new" || barcode == undefined}
          >
            Изменить
          </Button>
       
          <Button
            className={`h-full w-1/2 text-primary justify-center font-[16px] gap-1.5  border-none`}
            variant={"outline"}
            disabled={barcode != "new" && barcode != undefined}
          >
            Добавить
          </Button>
        </>}
      
      </div>
      <BarcodeQenerat />
    </div>
  );
}
