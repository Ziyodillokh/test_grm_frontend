import { useQueryState } from "nuqs";
import { useFormContext } from "react-hook-form";
import { Loader, X } from "lucide-react";

import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import FormTextInput from "@/components/forms/FormTextInput";
import { PrimaryButton } from "@/components/ui/primary-button";

const FIELD_INPUT = "w-full h-[44px] bg-white border-0 border-b border-[#e7ebf0] rounded-none";
const LABEL = "text-[13px] text-[#1a1a1a] pl-[10px]";

export default function FormContent({ isPending }: { isPending: boolean }) {
  const [id, setId] = useQueryState("id");
  const form = useFormContext();
  const warehouse = form.watch("warehouse");
  const dateValue = form.watch("date");

  const dateInputValue = dateValue
    ? new Date(dateValue).toISOString().slice(0, 10)
    : "";

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px] py-[10px] pl-[12px]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4.16699V15.8337M4.16667 10.0003H15.8333" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[15px] font-medium text-[#1a1a1a] leading-none">
            {id === "new" ? "Yangi partiya" : "Partiyani tahrirlash"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setId(null)}
          className="py-[10px] pr-[12px] pl-[12px] flex items-center justify-center"
          aria-label="Yopish"
        >
          <X className="w-[20px] h-[20px] text-[#1a1a1a]" strokeWidth={1.4} />
        </button>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-[#e7ebf0]" />

      {/* Body */}
      <div className="pt-[20px] px-[40px] pb-[20px] grid grid-cols-2 gap-x-[20px] gap-y-[16px]">
        <div className="flex flex-col gap-[6px]">
          <p className={LABEL}>Davlat</p>
          <FormComboboxDemoInput
            fieldNames={{ value: "id", label: "title" }}
            fetchUrl="/country"
            name="country"
            placeholder="Davlatni tanlang"
            disabled={id != "new"}
            classNameChild={FIELD_INPUT}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <p className={LABEL}>Taminotchi</p>
          <FormComboboxDemoInput
            fieldNames={{ value: "id", label: "title" }}
            fetchUrl="/factory"
            name="factory"
            placeholder="Taminotchini tanlang"
            disabled={id != "new"}
            classNameChild={FIELD_INPUT}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <p className={LABEL}>Partiya raqami</p>
          <FormComboboxDemoInput
            fieldNames={{ value: "id", label: "title" }}
            fetchUrl="/partiya-number"
            name="partiya_no"
            placeholder="Partiyani tanlang"
            disabled={id != "new"}
            classNameChild={FIELD_INPUT}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <p className={LABEL}>Sana</p>
          <input
            type="date"
            value={dateInputValue}
            onChange={(e) =>
              form.setValue("date", e.target.value ? new Date(e.target.value) : undefined as any)
            }
            className={`${FIELD_INPUT} px-[12px] text-[14px] text-[#1a1a1a] outline-none`}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <p className={LABEL}>Xarajat ($)</p>
          <FormTextInput
            name="expense"
            placeholder="Xarajatni kiriting"
            type="number"
            classNameInput={FIELD_INPUT}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <p className={LABEL}>Hajm (m²)</p>
          <FormTextInput
            name="volume"
            placeholder="Hajmni kiriting"
            type="number"
            classNameInput={FIELD_INPUT}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <p className={LABEL}>Ombor</p>
          <FormComboboxDemoInput
            fieldNames={{ value: "id", label: "title" }}
            fetchUrl="/filial"
            onLocalChange={() => form.setValue("user", null)}
            queries={{ type: "warehouse" }}
            name="warehouse"
            placeholder="Omborni tanlang"
            classNameChild={FIELD_INPUT}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <p className={LABEL}>Mas'ul shaxs</p>
          <FormComboboxDemoInput
            fetchUrl={`/user/managers/${warehouse?.value}`}
            fieldNames={{ value: "id", label: "firstName" }}
            name="user"
            disabled={!warehouse}
            placeholder="Mas'ul shaxsni tanlang"
            classNameChild={FIELD_INPUT}
          />
        </div>

        <div className="col-span-2 flex justify-start">
          <PrimaryButton
            type="submit"
            disabled={isPending}
            icon={isPending ? <Loader className="animate-spin" /> : undefined}
          >
            {id === "new" ? "Saqlash" : "Yangilash"}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}
