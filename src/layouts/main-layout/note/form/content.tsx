import { Check, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import FormTextArea from "@/components/forms/FormTextArea";
import { Button } from "@/components/ui/button";

const colors = ["none", "#58A0C6", "#89A143", "#E38157"];
export default function FormContent() {
  const [id, setId] = useQueryState("id");
  const { setValue, watch } = useFormContext();
  const color = watch("color");
  const title = watch("title");
  useEffect(() => {
    setValue("color", "none");
  }, [setValue]);
  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <Button
          type={id && title ? "submit" : "button"}
          onClick={() => setId("new")}
          className={`${title && "bg-primary"} rounded-full w-11 h-11`}
          variant={"outline"}
          size={"icon"}
        >
          {title ? (
            <Check color="#F0F0E5" width={24} height={24} />
          ) : (
            <Plus width={24} height={24} />
          )}
        </Button>
        <div className="w-full flex items-center gap-0.5 ">
          {colors?.map((e) => (
            <div
              onClick={() => {
                setValue("color", e);
              }}
              key={e}
              style={{ backgroundColor: e }}
              className={`${e == color ? "!border-black " : ""} border cursor-pointer w-6 h-6 rounded-full`}
            ></div>
          ))}
          <p className="text-[#5D5D53] ml-5 font-semibold">Заметки</p>
        </div>
      </div>

      {id && (
        <FormTextArea
          name="title"
          label="Новая заметка"
          placeholder="Новая заметка"
        />
      )}
    </>
  );
}
