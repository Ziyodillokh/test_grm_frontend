import { Button } from "@/components/ui/button";
import { useMeStore } from "@/store/me-store";
import FilterSelect from "@/components/filters-ui/filter-select";
import useDataFetch from "@/pages/filial/table/queries";
import { useQueryState } from "nuqs";
import ReportToolbar from "@/components/report-toolbar";

export default function Filters() {
  const { meUser } = useMeStore();
  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });
  const [id] = useQueryState("id");
  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

  return (
    <ReportToolbar
      filterContent={
        <>
          {(meUser?.position?.role == 10 || (meUser?.position?.role == 9 && !id)) && (
            <>
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Filial</p>
                <FilterSelect
                  placeholder="Hammasi"
                  className="w-full"
                  options={[{ value: "clear", label: "Hammasi" }, ...filialOption]}
                  name="filial"
                />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Turi</p>
                <FilterSelect
                  className="w-full"
                  placeholder="Hammasi"
                  options={[
                    { value: "clear", label: "Hammasi" },
                    { value: "income", label: "Kirim" },
                    { value: "expense", label: "Chiqim" },
                    { value: "sale", label: "Sotuv" },
                    { value: "return", label: "Qaytarish" },
                    { value: "collection", label: "Inkassa" },
                  ]}
                  name="tip"
                />
              </div>
            </>
          )}
          {meUser?.position.role === 4 && (
            <div className="flex items-center bg-white rounded-sm px-[12px] h-[42px]">
              <span className="text-[14px] font-medium text-[#1a1a1a]">Kassa</span>
            </div>
          )}
          <Button variant="outline" className="w-full mt-2">
            Tozalash
          </Button>
        </>
      }
    />
  );
}
