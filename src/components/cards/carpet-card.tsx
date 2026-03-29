import { Bookmark, Circle, RectangleVertical } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

import { minio_img_url } from "@/constants";

interface ICarpetCard {
  id: string;
  className?: string;
  model: string;
  size: string;
  count: string;
  img: {
    path: string;
  };
  price: string;
  color: string;
  colaction: string;
  discount?: string;
  carpetType: string;
  isMetric?: boolean;
  isBron?: boolean;
  user: {
    firstName: string;
    lastName: string;
    avatar: {
      path: string;
    };
  } | null;
  producdId: string;
  shape: string;
  onPublish?: () => void;
  actionLabel?: string;
}

export default function CarpetCard({
  className,
  // id,
  user,
  isBron,
  discount,
  model,
  carpetType,
  size,
  id,
  isMetric,
  count,
  producdId,
  img,
  colaction,
  color,
  shape,
  onPublish,
  actionLabel = "Publish",
}: ICarpetCard) {
  const [, setCarpetType] = useQueryState("carpetType");
  const [, setOpenBronId] = useQueryState("openBronId");
  const [, setOpenBronItemId] = useQueryState("openBronItemId");
  // const navigate = useNavigate();
  return (
    <div
      className={`w-full relative bg-sidebar border-border   max-h-[500px] rounded-lg border ${className && className}`}
    >
      <div className="flex border-b border-border ">
        <p className="p-2 w-full text-[12px] text-primary text-center border-border border-r">
          {model}
        </p>
        <p className="p-2 w-full text-[12px] text-primary text-center border-border border-r">
          {size}
        </p>
        <p className="p-2 w-full text-[12px] text-primary text-center">
          {count} {isMetric ? "" : "x"}
        </p>
      </div>
      <div
        // onClick={() => navigate(`/carpet/${id}`)}
        className="w-full relative "
      >
        <p className="bg-sidebar text-primary font-bold rounded-md absolute left-0.5 top-0.5 p-1">
          {colaction}
        </p>
        <img
          className="w-full  rounded-b-lg"
          style={{ aspectRatio: "0.67/1" }}
          src={img?.path ? minio_img_url + img?.path : "/images/default.svg"}
        />

        <div className="bottom-1 px-1.5  flex items-streech  gap-2  absolute">
          <p className="flex gap-2 items-center bg-card rounded-md  px-1.5  py-1">
            {shape === "Rulo" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M9.33343 8.03924C9.24183 8.23679 9.10085 8.40739 8.9241 8.53457C8.21743 9.00991 7.2761 8.60924 6.89543 7.92191C6.3361 6.91324 6.9101 5.67657 7.9121 5.20191C9.24743 4.56857 10.8261 5.30457 11.4054 6.59257C12.1354 8.21391 11.2121 10.0912 9.59876 10.7566C7.64476 11.5619 5.41009 10.4779 4.64009 8.58657C3.73343 6.35791 5.01143 3.83057 7.23743 2.97991C9.80743 1.99724 12.7041 3.43324 13.6614 5.92791C14.7481 8.76324 13.1128 11.9439 10.2734 12.9786C7.0881 14.1386 3.52809 12.3512 2.38476 9.25191C2.16078 8.65032 2.03103 8.01776 2.0001 7.37657"
                  stroke="#45453C"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {shape === "Oval" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 14C5.79086 14 4 11.3137 4 8C4 4.68629 5.79086 2 8 2C10.2091 2 12 4.68629 12 8C12 11.3137 10.2091 14 8 14Z"
                  stroke="#45453C"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {shape === "Rectangle" && (
              <RectangleVertical className="text-primary w-4" />
            )}
            {shape === "Circle" && <Circle className="text-primary w-4" />}
            {shape}
          </p>
          <p className="text-primary  bg-card left-0.5  px-1.5 py-1 rounded-md ">{color}</p>
        </div>
      </div>

      {discount && user ? (
        <div className="absolute right-0 bottom-[46px] ">
          {user?.avatar?.path ? (
            <img
              src={minio_img_url + user?.avatar?.path}
              className="w-[46px] h-[46px] rounded-full object-cover"
            />
          ) : (
            <div className="w-[46px]   bg-[#45453C] border border-white rounded-full text-sidebar h-[46px] flex items-center justify-center">
              {user?.firstName[0]} {user?.lastName[0]}
            </div>
          )}
        </div>
      ) : (
        ""
      )}

      {onPublish && (
        <div onClick={(e) => {
          e.stopPropagation();
          onPublish();
        }} className="absolute bottom-2 right-2 z-10">
          <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
            {actionLabel}
          </Button>
        </div>
      )}

      {isBron ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setCarpetType(carpetType || null);
            setOpenBronId(producdId);
            setOpenBronItemId(id);
          }}
          className={`w-[46px] cursor-pointer absolute ${(count || 0) < count ? "right-11.5" : "right-0"}  bottom-0 bg-[#FF7700] text-background h-[46px] flex items-center justify-center`}
        >
          <Bookmark className="text-white w-[24px]" />
          <p className="absolute top-0  text-white font-bold text-[12px] right-1">
            {count}
          </p>
        </div>
      ) : (
        ""
        // <div
        //   //   onClick={(e) => {
        //   //     e.stopPropagation();
        //   //     setCarpetType(carpetType || null);
        //   //   }}
        //   className="w-[46px] cursor-pointer absolute right-0 bottom-0 bg-primary text-background h-[46px] flex items-center justify-center"
        // >
        //   <ShoppingCart />
        // </div>
      )}
    </div>
  );
}
