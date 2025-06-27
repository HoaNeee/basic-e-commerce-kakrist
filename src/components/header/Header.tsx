import Image from "next/image";
import React from "react";
import LOGOAPP from "@/assets/logo.png";
import { MenuNav } from "./MenuNav";
import { LuSearch } from "react-icons/lu";
import { IoIosHeartEmpty } from "react-icons/io";
import { FaBars } from "react-icons/fa6";
import { PiShoppingBag } from "react-icons/pi";
import { Button } from "../ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex items-center justify-center w-full relative z-10">
      <div className="container w-full py-5 sticky top-0 flex justify-between items-center bg-white xl:px-4">
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
          <Button variant={"default"}>Login</Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
