/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { cn } from "@/lib/utils";

interface Props {
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode | string;
  onClick?: any;
  styles?: React.CSSProperties | undefined;
  className?: string;
  type?: "submit" | "button" | "reset";
  typeLoading?: 1 | 2;
}

const ButtonLoading = (props: Props) => {
  const {
    loading,
    disabled,
    children,
    onClick,
    styles,
    className,
    type,
    typeLoading,
  } = props;
  return typeLoading === 1 ? (
    <>
      <Button
        className={cn("py-6 px-4 flex", className)}
        disabled={loading || disabled}
        type={type || "submit"}
        onClick={onClick}
      >
        <div className="relative">
          <div
            className={
              "transition-all duration-300 absolute w-full h-full items-center justify-center flex"
            }
            style={{
              opacity: loading ? "1" : "0",
            }}
          >
            <Spinner />
          </div>
          <div
            className="flex items-center gap-1.5 transition-all duration-300"
            style={{
              opacity: loading ? "0" : "1",
            }}
          >
            {children}
          </div>
        </div>
      </Button>
    </>
  ) : (
    <Button
      disabled={loading || disabled}
      type={type || "submit"}
      className={cn(
        "transition-all duration-400 flex items-center justify-center relative",
        className
      )}
      onClick={onClick}
      style={styles}
    >
      <div
        className="opacity-0 transition-all duration-300 invisible"
        style={{
          opacity: loading ? "1" : undefined,
          visibility: loading ? "visible" : undefined,
        }}
      >
        <Spinner />
      </div>
      {
        <p
          className="transition-all duration-300 absolute flex items-center justify-center"
          style={{
            opacity: loading ? "0" : "1",
          }}
        >
          {children}
        </p>
      }
    </Button>
  );
};

export default ButtonLoading;
