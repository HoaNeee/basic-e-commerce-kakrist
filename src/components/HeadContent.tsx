/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface Props {
  title?: string;
  left?: any;
  styles?: React.CSSProperties;
}

const HeadContent = (props: Props) => {
  const { title, left, styles } = props;
  return (
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
