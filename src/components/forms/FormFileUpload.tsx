import { CloudUpload, Eye, LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import { FormField, FormItem, FormMessage } from "../ui/form";

interface iProps {
  label: string;
  className?: string;
  acceptTypes: string;
  text: string;
  folder: string;
  name: string;
}

// const maxFileSize = 5000000;

export default function FormFileUpload({
  label,
  acceptTypes,
  className,
  name,
  folder,
}: iProps) {
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const { t } = useTranslation();
  const { control } = useFormContext();

  const hendleimg = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    setLoadingFile(true)
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);
    formData.append("type", folder);

    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + `/media-upload/single/${folder}/${folder}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: formData,
        }
      );
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        field.onChange({
          id: data?.id || data?.[0]?.id,
          url: data?.path || data?.[0]?.path,
        });
      };
      setLoadingFile(false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to upload image:", error);
      setLoadingFile(false)
    }
  };
  const hendleRemove = (field: ControllerRenderProps<FieldValues, string>) => {
    field.onChange(undefined);
  };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("cursor-pointer", className)}>
          <p className="text-[#252C32] text-[13px] leading-[18px] font-normal">
            {t(label)}
          </p>
          {field?.value?.url ? (
            <div className="aspect-[2/3] w-full group relative overflow-hidden">
              <img
                src={"https://s3.gilam-market.uz" + field?.value?.url}
                alt="image"
                className="w-full h-full object-cover"
              />
              <div className="absolute -bottom-[300px] gap-2 group-hover:bottom-0 left-0 w-full flex items-center justify-center h-full z-10 bg-black/80">
                <span onClick={() => hendleRemove(field)}>
                  <Trash2 color="white" />
                </span>
                <Eye color="white" />
              </div>
            </div>
          ) : (
            <label
              className={`flex items-center justify-center aspect-[2/3] text-center p-auto w-full cursor-pointer p-[21px] bg-[#F5F5F5] rounded-lg mt-1.5`}
            >
              <div className="text-center">
                {loadingFile ? (
                  <LoaderCircle />
                ) : (
                  <CloudUpload size={"40"} className="text-2.5 m-auto" />
                )}
                <input
                  className="hidden"
                  type="file"
                  accept={acceptTypes}
                  onChange={(e) => {
                    hendleimg(e, field);
                  }}
                />
                <p>{t("selectFile")}</p>
              </div>
            </label>
          )}
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
}
