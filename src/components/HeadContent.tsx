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
      className={`w-full flex items-center mb-8 `}
      style={{
        justifyContent: left ? "space-between" : "center",
        ...styles,
      }}
    >
      <h3 className="md:text-2xl lg:text-3xl text-xl font-medium">
        {title || "Head Title"}
      </h3>
      {left || undefined}
    </div>
  );
};

export default HeadContent;
