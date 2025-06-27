"use client";

import FooterComponent from "@/components/footer/FooterComponent";
import Header from "@/components/header/Header";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();

  return (
    <div className="w-full h-full">
      {!pathName.startsWith("/auth") && <Header />}
      {children}
      {!pathName.startsWith("/auth") && <FooterComponent />}
    </div>
  );
};

export default MainLayout;
