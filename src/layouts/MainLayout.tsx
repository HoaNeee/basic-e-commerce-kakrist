"use client";

import FooterComponent from "@/components/footer/FooterComponent";
import Header from "@/components/header/Header";
import { changeTheme } from "@/redux/reducer/settingReducer";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "motion/react";

const MainLayout = ({ children }: { children: ReactNode }) => {
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
      <Header />
      {pathName.startsWith("/profile") ? (
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
      <FooterComponent />
    </>
  );
};

export default MainLayout;
