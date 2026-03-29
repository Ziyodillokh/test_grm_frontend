import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useNavigate, useParams } from "react-router-dom";

import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";
import UploadExel from "@/components/upload-exel";
import { useMeStore } from "@/store/me-store";

export default function Filters() {
  const { meUser } = useMeStore();
  const [idLoc, setId] = useQueryState("id");
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="bg-sidebar border-border border-b   h-[64px]   flex   ">
      <SearchInput className="ml-2 gap-2 w-full" />
      {id || idLoc ? (
        <UploadExel />
      ) : (
        meUser?.position.role == 9  && (
          <Button
            onClick={() => {
              navigate("new");
              setId("new");
            }}
            className="h-full w-full max-w-[247px] px-[50px] bg-primary text-primary-foreground border-y-0"
            variant={"outline"}
          >
            <Plus size={24} /> Добавить баркод
          </Button>
        )
      )}
    </div>
  );
}
