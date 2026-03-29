import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useMeStore } from "@/store/me-store";

export default function Page() {
  const { meUser } = useMeStore();
  const navigate = useNavigate();
  return (
    <div className="p-4">
      {meUser?.filial?.need_get_report && (
        <Button onClick={() => navigate("/re-register")}>Переучёт</Button>
      )}
    </div>
  );
}
