import React from "react";
import HeadContent from "../HeadContent";
import Image from "next/image";
import IMAGETEST from "../../assets/auth-register.png";
import { FaInstagram } from "react-icons/fa6";
import { Button } from "../ui/button";

const OurInstagramStory = () => {
  return (
    <div className="w-full h-full">
      <HeadContent title="Our Instagram Stories" />
      <div className="grid md:grid-cols-4 grid-cols-2 gap-8">
        <div className="h-60 relative group">
          <Image
            src={IMAGETEST}
            alt="this is image test"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 opacity-0 transition-all duration-300 justify-center items-center w-full h-full group-hover:opacity-100 group-hover:backdrop-blur-xs flex">
            <Button variant={"outline"}>
              <FaInstagram />
            </Button>
          </div>
        </div>
        <div className="h-60 relative group">
          <Image
            src={IMAGETEST}
            alt="this is image test"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 opacity-0 transition-all duration-300 justify-center items-center w-full h-full group-hover:opacity-100 group-hover:backdrop-blur-xs flex">
            <Button variant={"outline"}>
              <FaInstagram />
            </Button>
          </div>
        </div>
        <div className="h-60 relative group">
          <Image
            src={IMAGETEST}
            alt="this is image test"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 opacity-0 transition-all duration-300 justify-center items-center w-full h-full group-hover:opacity-100 group-hover:backdrop-blur-xs flex">
            <Button variant={"outline"}>
              <FaInstagram />
            </Button>
          </div>
        </div>
        <div className="h-60 relative group">
          <Image
            src={IMAGETEST}
            alt="this is image test"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 opacity-0 transition-all duration-300 justify-center items-center w-full h-full group-hover:opacity-100 group-hover:backdrop-blur-xs flex">
            <Button variant={"outline"}>
              <FaInstagram />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurInstagramStory;
