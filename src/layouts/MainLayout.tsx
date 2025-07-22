"use client";

import FooterComponent from "@/components/footer/FooterComponent";
import Header from "@/components/header/Header";
import React, { ReactNode, useEffect } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (document) {
      console.log(localStorage);
    }
  }, []);

  return (
    <div className="w-full h-full">
      <Header />
      {children}
      <FooterComponent />
    </div>
  );
};

export default MainLayout;
