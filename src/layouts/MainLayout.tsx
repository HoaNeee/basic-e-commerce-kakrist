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
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const MainLayout = ({
  children,
  system_settings,
  jwt_token,
}: {
  children: ReactNode;
  system_settings: SystemSettingModel;
  jwt_token: RequestCookie | undefined;
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
        <Header system_settings={system_settings} jwt_token={jwt_token} />
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
