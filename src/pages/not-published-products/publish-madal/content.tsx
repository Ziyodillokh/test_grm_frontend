import { DialogTitle } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FormTextArea from "@/components/forms/FormTextArea";
import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import { useFormContext } from "react-hook-form";
import FormTextInput from "@/components/forms/FormTextInput";
import FormFileUpload from "@/components/forms/FormFileUpload";

export default function FormContent() {
  const { watch, setValue } = useFormContext();
  return (
    <>
      <DialogHeader>
        <DialogTitle>Публикация продукта</DialogTitle>
      </DialogHeader>
      <div className="grid px-14 py-8 row-start   mb-2 gap-2 lg:grid-cols-4">
        <FormTextInput
          label="Баркод"
          className="w-full"
          name="code"
          disabled={true}
          classNameInput="rounded-none"
          placeholder="Баркод"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/country"
          name="country"
          placeholder="country"
          label="country"
          disabled={true}
        />

        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/factory"
          name="factory"

          placeholder="factory"
          label="factory"
          disabled={true}
        />

        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/collection"
          name="collection"
          onLocalChange={(value) => {
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

          placeholder="collection"
          label="collection"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl={`/model/by-collection/${watch("collection")?.value}`}
          name="model"


          placeholder="model"
          label="model"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/shape"
          name="shape"

          placeholder="shape"
          label="shape"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/size"
          name="size"
          placeholder="size"
          label="size"
        />

        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/color"
          name="color"
          placeholder="color"
          label="color"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/style"
          name="style"
          placeholder="style"
          label="style"
        />

        <FormComboboxDemoInput

          option={[
            {
              label: "extraSmall",
              value: "extraSmall",
            },
            {
              label: "small",
              value: "small",
            },
            {
              label: "medium",
              value: "medium",
            },
            {
              label: "large",
              value: "large",
            },
            {
              label: "extraLarge",
              value: "extraLarge",
            },
          ]}
          name="sizeType"
          placeholder="sizeType"
          label="sizeType"
        />
        <FormTextInput
          label="Цена за м² (сум)"
          className="w-full"
          type="number"
          name="i_price"
          classNameInput="rounded-none"
          placeholder="Цена за м² (сум)"
        />
        <FormTextArea
          label="Харакетистика"
          className="w-full rounded-none col-span-2"
          name="internetInfo"
        />
        <FormFileUpload
          name="imgUrl"
          folder="products"
          className="col-span-4 max-w-[120px]"
          acceptTypes="image/*"
          label="Primary photo"
          text="text"
        />
      </div>

      <DialogFooter className="!justify-start mt-2 flex">
        <Button type="submit" onClick={() => setValue("status", "draft")} className="w-[220px] h-[44px]">
          {/* Снять с публикации */}
          Толька сохранить
        </Button>
        <Button
          type="submit"
          onClick={() => setValue("status", "published")}
          className="bg-[#89A143] hover:bg-[#89A143] h-[44px]"
        >
          Сохранить и опубликовть для продажи
        </Button>
      </DialogFooter>
    </>
  );
}
