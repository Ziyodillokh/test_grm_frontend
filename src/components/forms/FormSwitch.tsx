import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputProps } from "../ui/input";
import { Switch } from "../ui/switch";

interface Props extends InputProps {
  name: string;
  label?: string;
  type?: string;
  className?: string;
}

export default function FormSwitch({ name, label, className }: Props) {
  const { control } = useFormContext();
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem className={cn("flex flex-col items-start w-full", className)}>
          {label && (
            <FormLabel
              htmlFor={name}
              className="font-medium text-[#99998C] dark:text-white"
            >
              {t(label)}
            </FormLabel>
          )}
          <FormControl>
            <Switch onCheckedChange={onChange} checked={value} id={name} />
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
}
