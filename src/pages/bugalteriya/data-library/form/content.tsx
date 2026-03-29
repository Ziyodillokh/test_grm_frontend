import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Check } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import FormTextInput from "@/components/forms/FormTextInput";
import TableWrapper from "@/components/table-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteData, getAllData } from "@/service/apiHelpers";
import { TResponse } from "@/types";

import { TActionData, TFormData } from "../type";

export default function FormContent({ isPending }: { isPending: boolean }) {
  const [type, settype] = useQueryState(
    "type",
    parseAsString.withDefault("country")
  );
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setValue } = useFormContext();
  const { watch } = useFormContext();
  const collectionId = watch()?.collection.value;
  const title = watch()?.title;

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [type, collectionId],
      queryFn: ({ pageParam = 1 }) =>
        getAllData<TResponse<TActionData>, object>(
          `/${collectionId && type == "model" ? `model/by-collection/${collectionId}` : type}`,
          {
            page: pageParam as number,
            limit: 10,
          }
        ),
      getNextPageParam: (lastPage) => {
        if (lastPage.meta?.currentPage <= lastPage.meta?.totalPages) {
          return lastPage?.meta?.currentPage + 1;
        } else {
          return null;
        }
      },
      select: (data) => ({
        items: data.pages.flatMap((page) =>
          page.items.map((item) => ({
            ...item,
            value: item?.id,
            label: item?.title,
          }))
        ),
        meta: data.pages[data.pages.length - 1]?.meta,
      }),
      initialPageParam: 1,
    });

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      return await DeleteData(`/${type}`, id);
    },
    onSuccess: () => {
      toast.success(t("deleteToast"));
      setValue("title", "");
      setValue("collection", {
        value: undefined,
        label: "",
      });
      setValue("country", {
        value: undefined,
        label: "",
      });
      setValue("factory", {
        value: undefined,
        label: "",
      });
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  return (
    <>
      <TableWrapper
        className="border-r  border-border"
        options={[
          {
            label: "Страна",
            value: "country",
            onClick: () => settype("country"),
            isActive: type === "country",
          },
          {
            label: "Поставщики",
            value: "factory",
            onClick: () => settype("factory"),
            isActive: type === "factory",
          },
          {
            label: "Партии",
            value: "partiya-number",
            onClick: () => settype("partiya-number"),
            isActive: type === "partiya-number",
          },
          {
            label: "Коллекция",
            value: "collection",
            onClick: () => settype("collection"),
            isActive: type === "collection",
          },
          {
            label: "Модели",
            value: "model",
            onClick: () => settype("model"),
            isActive: type === "model",
          },
          {
            label: "Размеры",
            value: "size",
            onClick: () => settype("size"),
            isActive: type === "size",
          },
          {
            label: "Форма",
            value: "shape",
            onClick: () => settype("shape"),
            isActive: type === "shape",
          },
          {
            label: "Цвета",
            value: "color",
            onClick: () => settype("color"),
            isActive: type === "color",
          },
          {
            label: "Стиль",
            value: "style",
            onClick: () => settype("style"),
            isActive: type === "style",
          },
        ]}
        title="Оснавные"
      />
      <TableWrapper
        isAdd={true}
        isloading={isLoading}
        className="border-r  border-border"
        title={type || ""}
        setValue={setValue}
        options={data?.items?.map((e) => ({
          onDelete: () => mutate(e?.value),
          onUpdate: (e) => {
            const value = e as TFormData
            if (type == "factory") {
              setValue("country", {
                value: value?.country?.id,
                label: value?.country?.title,
              });
            }
            if (type == "model") {
              setValue("country", {
                value: value?.collection?.id,
                label: value?.collection?.title,
              });
            }
            if (type == "collection") {
              setValue("country", {
                value: value?.factory?.id,
                label: value?.factory?.title,
              });
            }
          },
          ...e,
        }))}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        isPending={isPending as boolean}
      >
        {type === "model" && (
          <FormComboboxDemoInput
            classNameChild="mb-3 m-1 w-[95%] rounded-none bg-transparent border border-border"
            className="w-full"
            fetchUrl="/collection"
            fieldNames={{ value: "id", label: "title" }}
            name="collection"
            placeholder="collection"
          />
        )}
        {type === "factory" && (
          <FormComboboxDemoInput
            classNameChild="mb-3 m-1 w-[95%] rounded-none bg-transparent border border-border"
            className="w-full"
            fetchUrl="/country"
            fieldNames={{ value: "id", label: "title" }}
            name="country"
            placeholder="country"
          />
        )}
          {type === "collection" && (
          <FormComboboxDemoInput
            classNameChild="mb-3 m-1 w-[95%] rounded-none bg-transparent border border-border"
            className="w-full"
            fetchUrl="/factory"
            fieldNames={{ value: "id", label: "title" }}
            name="factory"
            placeholder="factory"
          />
        )}
        <div className="relative w-[95%]">
          {type === "size" ? (
            <div className="flex mb-3 m-1">
              <Input
                value={title?.split("x")[0]}
                onChange={(e) =>
                  setValue(
                    "title",
                    `${e?.target?.value}x${title?.split("x")[1] || ""}`
                  )
                }
                placeholder="x"
                className="w-full bg-transparent border text-center  border-border"
              />
              <Input
                disabled
                value={"X"}
                placeholder="x"
                className="w-[66px] text-center  bg-transparent border-y border-border"
              />
              <Input
                value={
                  title?.split("x")[1]?.length
                    ? title?.split("x")[1]
                    : undefined
                }
                onChange={(e) =>
                  setValue(
                    "title",
                    `${title?.split("x")[0] || ""}x${e?.target?.value}`
                  )
                }
                placeholder="y"
                className="w-full bg-transparent border text-center  border-border"
              />
            </div>
          ) : (
            <FormTextInput
              classNameInput="mb-3 m-1 w-full bg-transparent border border-border"
              name="title"
              type={"string"}
              placeholder="title"
            />
          )}
          {type === "size" ? (
            ""
          ) : (
            <Button
              disabled={!title}
              className={`${title ? "bg-[#89A143] tecx-white hover:bg-[#89A143]" : "bg-sidebar"} w-[30px] absolute top-2.5 right-0.5 flex items-center justify-center cursor-pointer h-[30px] rounded-[2px]   text-border`}
            >
              <Check />
            </Button>
          )}
        </div>
      </TableWrapper>
    </>
  );
}
