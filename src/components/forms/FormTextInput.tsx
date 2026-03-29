import { ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input, InputProps } from "../ui/input";
import { PhoneInput } from "./phone-input";
import debounce from "@/utils/debounce";
import { ChangeEvent } from "react";

interface Props extends InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  isdebounce?: boolean;
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  localChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  classNameInput?: string;
}

export default function FormTextInput({
  name,
  type,
  label,
  placeholder,
  className,
  isdebounce,
  classNameInput,
  handleKeyDown,
  localChange,
  ...props
}: Props) {
  const { control } = useFormContext();
  const { t } = useTranslation();
  // bg-[#EDECE3] text-[15px] leading-[18px] font-medium px-[13px] py-[20px] border-none outline-none rounded-none mb-[54px] w-full max-w-[296px]
  const HendleChangeFunction = (e: ChangeEvent<HTMLInputElement>,field: ControllerRenderProps<FieldValues, string>) => {
    if (type === "number") {
      if (isNaN(e.target.valueAsNumber)) {
        field.onChange(null);
      } else {
        field.onChange(e.target.valueAsNumber);
      }
    } else {
      if(localChange) localChange(e)
      field.onChange(e.target.value);
    }
  }
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn("flex gap-1 flex-col items-start w-full", className)}
        >
          {label && (
            <FormLabel className="font-normal text-[12px] text-[#99998C]">
              {t(label)}
            </FormLabel>
          )}
          <FormControl className="w-full">
            {type == "tel" ? (
              <PhoneInput
                placeholder={placeholder ? t(placeholder) : ""}
                onChange={field.onChange}
                value={field.value}
              />
            ) : (
              <Input
                type={type ?? "text"}
                onKeyDown={handleKeyDown}
                className={cn(
                  "flex flex-col items-start w-full rounded-sm",
                  classNameInput
                )}
                placeholder={placeholder ? t(placeholder) : ""}
                {...field}
                onChange={isdebounce ? debounce((e) => {
                  HendleChangeFunction(e,field);
                }, 800)
                :
                (e) => {
                  HendleChangeFunction(e,field);
                }}
                {...props}
              />
            )}
          </FormControl>

          {/* <FormMessage className="text-sm text-red-500" /> */}
        </FormItem>
      )}
    />
  );
}
