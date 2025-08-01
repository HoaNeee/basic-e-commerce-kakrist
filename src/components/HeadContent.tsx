/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface Props {
  title?: string | ReactNode;
  left?: any;
  styles?: React.CSSProperties;
  size?: "default" | "large";
  desc?: string | ReactNode;
  className?: string;
}

const HeadContent = (props: Props) => {
  const { title, left, styles, size, desc, className } = props;
  return size === "large" ? (
    <div className={cn("mb-8", className)} style={styles}>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {title || "Head Title"}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {desc || "Description of the head content goes here."}
      </p>
    </div>
  ) : (
    <div
      className={`w-full flex items-center mb-10`}
      style={{
        justifyContent: left ? "space-between" : "center",
        ...styles,
      }}
    >
      <h3 className="xl:text-3xl lg:text-2xl leading-tight text-xl font-bold text-gray-800 dark:text-white">
        {title || "Head Title"}
      </h3>
      {left || undefined}
    </div>
  );
};

export default HeadContent;
