"use client";

import FooterComponent from "@/components/footer/FooterComponent";
import Header from "@/components/header/Header";
import { changeTheme } from "@/redux/reducer/settingReducer";
import { RootState } from "@/redux/store";
import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const setting = useSelector((state: RootState) => state.setting.setting);

  const dispatch = useDispatch();
  useEffect(() => {
    if (document) {
      const theme = localStorage.getItem("theme") || "light";
      dispatch(changeTheme(theme));
    }
  }, []);

  return (
    <div className="w-full h-full">
      <Toaster
        position="top-right"
        className="dark:text-white/80"
        theme={setting.theme === "dark" ? "dark" : "light"}
      />
      <Header />
      {children}
      <FooterComponent />
    </div>
  );
};

export default MainLayout;
