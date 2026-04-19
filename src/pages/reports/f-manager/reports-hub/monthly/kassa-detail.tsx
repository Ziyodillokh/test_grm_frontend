import { useParams } from "react-router-dom";
import FManagerCurrent from "@/pages/dashboard/f-manager-current";

export default function MonthlyKassaDetailPage() {
  const { id } = useParams();
  return <FManagerCurrent kassaIdProp={id} />;
}
