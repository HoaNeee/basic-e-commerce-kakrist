"use client";

import { changeTheme } from "@/redux/reducer/settingReducer";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import Header from "@/components/header/Header";
import FooterComponent from "@/components/footer/FooterComponent";
import { SystemSettingModel } from "@/models/settingSystem";

const MainLayout = ({
  children,
  system_settings,
}: {
  children: ReactNode;
  system_settings: SystemSettingModel;
}) => {
  const setting = useSelector((state: RootState) => state.setting.setting);
  const pathName = usePathname();

  const dispatch = useDispatch();
  useEffect(() => {
    if (document) {
      const theme = localStorage.getItem("theme") || "light";
      dispatch(changeTheme(theme));
    }
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        className="dark:text-white/80"
        theme={setting.theme === "dark" ? "dark" : "light"}
      />
      {!pathName.startsWith("/auth") && !pathName.startsWith("/error") && (
        <Header system_settings={system_settings} />
      )}
      {pathName.startsWith("/profile") || pathName === "/" ? (
        children
      ) : (
        <AnimatePresence mode="wait">
          <motion.main
            key={pathName}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      )}
      {!pathName.startsWith("/auth") && !pathName.startsWith("/error") && (
        <FooterComponent system_settings={system_settings} />
      )}
    </>
  );
};

export default MainLayout;
