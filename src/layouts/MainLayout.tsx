"use client";

import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();

  return (
    <div className="w-full h-full">
      {!pathName.startsWith("/auth") && <div>Header</div>}
      {children}
      {!pathName.startsWith("/auth") && <div>Footer</div>}
    </div>
  );
};

export default MainLayout;
