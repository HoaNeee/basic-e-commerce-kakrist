import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const CardSkeleton = ({
  control,
  className,
}: {
  control?: boolean;
  className?: string;
}) => {
  return (
    <div
      //rounded-sm overflow-hidden border-0 shadow-none py-0 group
      className={
        control
          ? cn("xl:h-[490px] lg:h-[380px] md:h-[430px] h-[350px]", className)
          : "lg:w-[calc(100%/4-20px)] w-[calc(100%/2-18px)] xl:h-[490px] lg:h-[380px] md:h-[430px] h-[350px]"
      }
    >
      <Skeleton className="h-5/7 w-full" />
      <div className="mt-6 flex flex-col gap-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 mt-2 w-1/4" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
};

export default CardSkeleton;
