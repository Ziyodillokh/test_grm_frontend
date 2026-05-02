import FormTextInput from "@/components/forms/FormTextInput";
import BarcodeQenerat from "@/components/barcode-generat";
import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import Filters from "./filters";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { parseAsString, useQueryState } from "nuqs";
import { useMeStore } from "@/store/me-store";
import { useEditPartiyaProductStore } from "@/store/edit-partiya-product-store";

// Read-only field display (label tashqarida, qiymat ichida)
function StaticField({ value, placeholder }: { value: string; placeholder: string }) {
  return (
    <div className="h-[40px] px-[12px] text-[14px] rounded-[4px] bg-[#f5f7f9] border border-border flex items-center text-[#1a1a1a]">
      {value || <span className="text-[#999]">{placeholder}</span>}
    </div>
  );
}

export default function FormContent() {
  const { meUser } = useMeStore();

  const [editble] = useState<boolean>(true);
  const [, setBarCode] = useQueryState("barcode");
  const { watch } = useFormContext();
  const isMetric = watch("isMetric");
  const [tip] = useQueryState(
    "tip",
    parseAsString.withDefault(
      meuserIsW(meUser?.position?.role) ? "recount" : "new"
    )
  );

  const inputCls = "h-[40px] px-[12px] text-[14px] rounded-[4px]";

  const role = meUser?.position?.role;
  const canSubmit =
    (role === 9 && tip === "new") ||
    role === 5 ||
    ((role === 7 || role === 4) && tip === "recount");

  const editProduct = useEditPartiyaProductStore((s) => s.product);
  const isEditing = !!editProduct;
  const bc = editProduct?.bar_code;
  const editIsMetric = bc?.isMetric;
  const editTipLabel = editIsMetric ? "Metrli" : "Donabay";

  return (
    <div className="w-full flex flex-col">
      {!isEditing && <Filters />}
      <div
        className="w-full px-[20px] py-[16px]"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 8,
          rowGap: 16,
        }}
      >
        {isEditing ? (
          <>
            <div>
              <StaticField value={bc?.code || ""} placeholder="Shtrix kod" />
            </div>
            <div>
              <StaticField value={bc?.country?.title || ""} placeholder="Davlat" />
            </div>
            <div>
              <StaticField
                value={
                  editProduct?.factory?.title ||
                  (editProduct as any)?.bar_code?.factory?.title ||
                  (editProduct as any)?.partiya?.factory?.title ||
                  ""
                }
                placeholder="Taminotchi"
              />
            </div>
            <div>
              <StaticField
                value={bc?.collection?.title || ""}
                placeholder="Kolleksiya"
              />
            </div>
            <div>
              <StaticField value={bc?.model?.title || ""} placeholder="Model" />
            </div>
            <div>
              <StaticField value={editTipLabel} placeholder="Tip" />
            </div>
            <div>
              <StaticField value={bc?.size?.title || ""} placeholder="O'lcham" />
            </div>
            <div>
              <StaticField value={bc?.shape?.title || ""} placeholder="Shakl" />
            </div>
            <div>
              <StaticField value={bc?.color?.title || ""} placeholder="Rang" />
            </div>
            <div>
              <StaticField value={bc?.style?.title || ""} placeholder="Uslub" />
            </div>
          </>
        ) : (
          <>
            <div>
              <FormTextInput
                classNameInput={inputCls}
                name="code"
                placeholder="Shtrix kod"
                localChange={() => {
                  setBarCode("new");
                }}
              />
            </div>
            <div>
              <FormComboboxDemoInput
                fieldNames={{ value: "id", label: "title" }}
                fetchUrl="/country"
                classNameChild={inputCls}
                name="country"
                placeholder="Davlat"
                disabled={true}
              />
            </div>
            <div>
              <FormComboboxDemoInput
                fieldNames={{ value: "id", label: "title" }}
                fetchUrl="/factory"
                name="factory"
                classNameChild={inputCls}
                placeholder="Taminotchi"
                disabled={true}
              />
            </div>
            <div>
              <FormComboboxDemoInput
                fieldNames={{ value: "id", label: "title" }}
                fetchUrl="/collection"
                name="collection"
                disabled={true}
                classNameChild={inputCls}
                placeholder="Kolleksiya"
              />
            </div>
            <div>
              <FormComboboxDemoInput
                fieldNames={{ value: "id", label: "title" }}
                fetchUrl={`/model`}
                name="model"
                disabled={true}
                classNameChild={inputCls}
                placeholder="Model"
              />
            </div>
            <div>
              <FormTextInput
                classNameInput={inputCls}
                name="isMetric"
                placeholder="Tip"
                disabled={true}
              />
            </div>
            <div>
              <FormComboboxDemoInput
                fieldNames={{ value: "id", label: "title" }}
                fetchUrl="/size"
                name="size"
                disabled={true}
                classNameChild={inputCls}
                placeholder="O'lcham"
              />
            </div>
            <div>
              <FormComboboxDemoInput
                fieldNames={{ value: "id", label: "title" }}
                fetchUrl="/shape"
                name="shape"
                disabled={true}
                classNameChild={inputCls}
                placeholder="Shakl"
              />
            </div>
            <div>
              <FormComboboxDemoInput
                fieldNames={{ value: "id", label: "title" }}
                fetchUrl="/color"
                name="color"
                classNameChild={inputCls}
                placeholder="Rang"
                disabled={true}
              />
            </div>
            <div>
              <FormComboboxDemoInput
                fieldNames={{ value: "id", label: "title" }}
                fetchUrl="/style"
                name="style"
                classNameChild={inputCls}
                placeholder="Uslub"
                disabled={true}
              />
            </div>
          </>
        )}

        <div>
          <FormTextInput
            type="number"
            classNameInput={inputCls}
            name="count"
            placeholder={
              (isEditing ? editIsMetric : isMetric == "Metrli")
                ? "Uzunlik"
                : "Miqdor"
            }
            disabled={!editble}
          />
        </div>
        {canSubmit && (
          <div>
            <Button
              type="submit"
              className="w-full h-[40px] rounded-[4px] bg-[#1A1A1A] hover:bg-[#333] text-white text-[14px]"
            >
              Qo'shish
            </Button>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="px-[20px] py-[20px] border-t border-border">
          <BarcodeQenerat />
        </div>
      )}
    </div>
  );
}

function meuserIsW(role: number | undefined): boolean {
  return role === 7 || role === 4;
}
