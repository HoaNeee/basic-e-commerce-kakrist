"use client";

import FooterComponent from "@/components/footer/FooterComponent";
import Header from "@/components/header/Header";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const MainLayout = ({
  children,
  token,
}: {
  children: ReactNode;
  token?: RequestCookie;
}) => {
  const pathName = usePathname();

  return (
    <div className="w-full h-full">
      {!pathName.startsWith("/auth") && <Header token={token} />}
      {children}
      {!pathName.startsWith("/auth") && <FooterComponent />}
    </div>
  );
};

export default MainLayout;
