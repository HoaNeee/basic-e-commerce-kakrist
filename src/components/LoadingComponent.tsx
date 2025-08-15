import { cn } from "@/lib/utils";
import React from "react";

const LoadingComponent = ({
  size = 28,
  type = "spinner",
  className,
  ...props
}: ISVGProps) => {
  return type === "superScreen" ? (
    <div className="bg-black/20 z-999 fixed top-0 bottom-0 left-0 flex items-center justify-center w-full min-h-screen">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 mx-auto mb-4 border-b-2 border-white rounded-full"></div>
        <p className="text-white/80">Loading...</p>
      </div>
    </div>
  ) : type === "screen" ? (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="text-center">
        <div className="animate-spin dark:border-gray-400 w-12 h-12 mx-auto mb-4 border-b-2 border-gray-900 rounded-full"></div>
        <p className="dark:text-gray-400 text-gray-600">Loading...</p>
      </div>
    </div>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export default LoadingComponent;

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 24,
  className,
  ...props
}: ISVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
