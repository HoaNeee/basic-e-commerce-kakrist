"use client";

import FooterComponent from "@/components/footer/FooterComponent";
import Header from "@/components/header/Header";
import { addAuth, removeAuth } from "@/redux/reducer/authReducer";
import { removeCart } from "@/redux/reducer/cartReducer";
import { get } from "@/utils/requets";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

const MainLayout = ({
  children,
  token,
}: {
  children: ReactNode;
  token?: RequestCookie;
}) => {
  const pathName = usePathname();

  const dispatch = useDispatch();

  useEffect(() => {
    if (token?.value) {
      getInfo();
    }
  }, [token]);

  const getInfo = async () => {
    try {
      const response = await get("/auth/profile");
      console.log(response);
      //DO THEN
      dispatch(
        addAuth({
          ...response.data,
          isLogin: true,
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(removeAuth());
      dispatch(removeCart([]));
    }
  };

  return (
    <div className="w-full h-full">
      {!pathName.startsWith("/auth") && <Header />}
      {children}
      {!pathName.startsWith("/auth") && <FooterComponent />}
    </div>
  );
};

export default MainLayout;
