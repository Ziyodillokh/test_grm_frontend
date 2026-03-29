import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
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
import { Input, InputProps } from "../ui/input";

interface Props extends InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function FormPasswordInput({
  name,
  label,
  placeholder,
  className,
  ...props
}: Props) {
  const { control } = useFormContext();
  const { t } = useTranslation();
  const [isPasswordType, setIsPasswordType] = useState(true);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem className={cn("flex flex-col items-start w-full", className)}>
          {label && (
            <FormLabel className="font-medium text-[#99998C] dark:text-white">
              {t(label)}
            </FormLabel>
          )}
          <FormControl className="w-full">
            <div className="relative">
              <Input
                type={isPasswordType ? "password" : "text"}
                className="w-full"
                placeholder={placeholder ? t(placeholder) : ""}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                {...props}
              />
              {isPasswordType ? (
                <EyeClosed
                  size={16}
                  className="absolute top-3 right-3 cursor-pointer z-10"
                  onClick={() => setIsPasswordType(false)}
                />
              ) : (
                <Eye
                  size={16}
                  className="absolute top-3 right-3 cursor-pointer z-10"
                  onClick={() => setIsPasswordType(true)}
                />
              )}
            </div>
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
}
