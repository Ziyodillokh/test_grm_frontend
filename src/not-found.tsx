import { useTranslation } from "react-i18next";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full text-center">
        <h4 className="text-7xl font-extrabold">404</h4>
        <p className="text-gray-400 text-lg my-5">{t("notFoundText")}</p>
        <Button className="mx-auto" onClick={() => navigate("/dashboard")} size={"lg"}>
          {t("goDashboard")}
        </Button>
      </div>
    </div>
  );
}
