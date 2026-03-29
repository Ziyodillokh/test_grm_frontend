import clsx from "clsx";
import { FC, PropsWithChildren } from "react";

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

const Container: FC<ContainerProps> = ({ className, children }) => {
  return (
    <div
      className={clsx("w-full max-w-[1140px]  mx-auto px-[15px]", className)}
    >
      {children}
    </div>
  );
};

export default Container;
