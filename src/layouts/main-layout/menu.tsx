import { ChevronLeft, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/auth-store";
import { useMeStore } from "@/store/me-store";

import { DeviceDesktopIcons, HomeIcons } from "../../components/icons";
import { DataMenu } from "./menu-datas";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { minio_img_url } from "@/constants";
// import NotePage from "./note/list";
// import Weather from "./weather";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeSwitcherDock } from "@/components/ThemeSwitcherDock";

export default function Menu() {
  const navigate = useNavigate();
  const { meUser, removeUserMe } = useMeStore();
  const { removeToken } = useAuthStore();
  const pathName = useLocation();
  const [isBack] = useQueryState("isBack", parseAsBoolean.withDefault(false));
  return (
    <div
      className={`${" min-w-[66px] "} flex relative max-h-screen  flex-col  bg-background   `}
    >
      <div className="p-1 bg-white mx-auto mt-2.5 mb-8 rounded-xl inline-block">
        <Avatar
          className="w-[58px] h-[58px] "
          onClick={
            meUser?.position?.role == 3
              ? () => {
                window.location.replace("/cashier/home");
              }
              : () => { }
          }
        >
          <AvatarImage src={minio_img_url + meUser?.avatar?.path} />
          <AvatarFallback className="bg-primary text-white w-[58px] flex items-center justify-center h-[50px]">
            {meUser?.firstName?.[0]}
            {meUser?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
      </div>
      <ScrollArea
        className={`max-h-[calc(100vh-100px)] flex flex-col justify-between items-between h-full  bg-white mb-auto mx-auto rounded-xl p-0.5 `}
      >
        {pathName.pathname.split("/").length > 3 || isBack ? (
          <div
            onClick={() => {
              if (isBack) {
                window.location.replace(pathName.pathname);
              } else {
                navigate(-1);
              }
            }}
            className={`cursor-pointer sticky top-0 bg-white  border-border border-b text-center flex items-center justify-center p-5`}
          >
            <ChevronLeft />
          </div>
        ) : meUser?.position?.role == 3 ? "" : meUser?.position?.role == 4 || meUser?.position?.role == 8 ? (
          <div
            onClick={() => {
              navigate("/cashier/home");
            }}
            className={`${pathName.pathname.includes("/cashier/home") ? "bg-background" : ""} rounded-xl group w-[80%] mx-auto w-[80%] mx-autow-[80%] iconsColor border-transparent cursor-pointer  text-center flex items-center justify-center  p-2`}
          >
            <DeviceDesktopIcons width={22} height={22} />
            <span className="absolute opacity-0 group-hover:opacity-100 flex justify-center align-middle items-center left-full -ml-6   whitespace-nowrap text-[#5D5D53] bg-white border-border border-1 text-[15px] rounded px-[13px] py-[5px] transition-opacity duration-200 z-20">
              Касса
            </span>
          </div>
        ) : (
          <div
            onClick={() => {
              navigate("/dashboard");
            }}
            className={`${meUser?.position?.role === 11 ? "hidden" : ""} ${pathName.pathname.includes("/dashboard") ? "bg-background" : ""} rounded-xl group w-[80%] mx-auto w-[80%] mx-autow-[80%]w-[80%] iconsColor border-transparent cursor-pointer  text-center flex items-center justify-center  p-2`}
          >
            <HomeIcons />
            <span className="absolute opacity-0 group-hover:opacity-100 flex justify-center align-middle items-center left-full -ml-6   whitespace-nowrap text-[#5D5D53] bg-white border-border border-1 text-[15px] rounded px-[13px] py-[5px] transition-opacity duration-200 z-20">
              Dashboard
            </span>
          </div>
        )}
        {DataMenu[
          (meUser?.position?.role || "admin") as keyof typeof DataMenu
        ]?.map((e) => (
          <div
            onClick={() => {
              if (e?.link) {
                navigate(e?.link);
              }
            }}
            className={`${pathName.pathname.includes(e?.link) ? "bg-background" : " opacity-70"} group w-[80%] mx-auto w-[80%] mx-autow-[80%]  rounded-xl border-transparent cursor-pointer    text-center flex items-center justify-center p-2`}
            key={e?.link}
          >
            {e?.icons()}
            <span className="absolute hidden opacity-0 text-[12px] group-hover:opacity-100 group-hover:flex justify-center align-middle items-center left-full -ml-6   whitespace-nowrap text-[#5D5D53] bg-white border-border border-1 text-md rounded px-[13px] py-[5px] transition-opacity duration-200 z-20">
              {e?.text}
            </span>
          </div>
        ))}

        {/* <NotePage /> */}
        <div
          onClick={() => {
            removeToken();
            removeUserMe();
            window.location.replace("/login");
          }}
          className={`group w-[80%] mx-auto w-[80%] mx-autow-[80%]  cursor-pointer  text-center flex items-center justify-center p-5`}
        >
          <LogOut className="min-w-[20px]" width={20} />
          <span className="absolute opacity-0 group-hover:opacity-100 flex justify-center align-middle items-center left-full -ml-6   whitespace-nowrap text-[#5D5D53] bg-card border-border border-1 text-[15px] rounded px-[13px] py-[5px] transition-opacity duration-200 z-20">
            Выйти
          </span>
        </div>
      </ScrollArea>

      <ThemeSwitcherDock />
      {/* <Weather /> */}
    </div>
  );
}
