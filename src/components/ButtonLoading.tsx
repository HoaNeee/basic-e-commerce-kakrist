/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import LoadingComponent from "./LoadingComponent";

interface Props {
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode | string;
  onClick: any;
  styles?: React.CSSProperties | undefined;
}

const ButtonLoading = (props: Props) => {
  const { loading, disabled, children, onClick, styles } = props;
  return (
    <Button
      disabled={loading || disabled}
      type="submit"
      className="transition-all duration-400 flex items-center justify-center relative"
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
        <LoadingComponent />
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
