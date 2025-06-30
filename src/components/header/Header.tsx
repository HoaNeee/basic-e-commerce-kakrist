"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import LOGOAPP from "@/assets/logo.png";
import { MenuNav } from "./MenuNav";
import { LuSearch } from "react-icons/lu";
import { FaBars } from "react-icons/fa6";
import Link from "next/link";
import { IoIosHeartEmpty } from "react-icons/io";
import { PiShoppingBag } from "react-icons/pi";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { addAuth, removeAuth } from "@/redux/reducer/authReducer";

interface Props {
  token?: RequestCookie;
}

const Header = (props: Props) => {
  const { token } = props;

  const auth = useSelector((state: RootState) => state.auth.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !auth.accessToken) {
      console.log(token);
      //DO THEN
      dispatch(addAuth({ accessToken: token.value }));
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center w-full z-10 sticky top-0 bg-white">
      <div className="container w-full py-5 flex justify-between items-center bg-white xl:px-4 md:px-0 px-2">
        <div>
          <Link className="w-30 h-12 md:block hidden" href="/">
            <Image
              alt="LOGO"
              src={LOGOAPP}
              priority
              className="w-full h-full"
            />
          </Link>
          <div className="md:hidden block">
            <FaBars size={20} />
          </div>
        </div>
        <div className="hidden md:block">
          <MenuNav />
        </div>
        <div className="flex gap-4 items-center">
          <LuSearch className="lg:text-2xl text-lg" />
          <IoIosHeartEmpty className="lg:text-2xl text-lg" />
          <PiShoppingBag className="lg:text-2xl text-lg" />
          {auth.accessToken ? (
            <>
              <Button
                variant={"default"}
                onClick={() => {
                  dispatch(removeAuth());
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href={"/auth/login"}>
              <Button variant={"default"}>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
