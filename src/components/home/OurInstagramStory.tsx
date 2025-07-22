import React from "react";
import HeadContent from "../HeadContent";
import Image from "next/image";
import STORY1 from "../../assets/auth-register.png";
import STORY2 from "../../assets/story1.webp";
import STORY3 from "../../assets/story2.jpg";
import STORY4 from "../../assets/story3.jpg";
import { FaInstagram } from "react-icons/fa6";
import { Button } from "../ui/button";

const OurInstagramStory = () => {
  return (
    <div className="w-full h-full">
      <HeadContent title="Our Instagram Stories" />
      <div className="grid md:grid-cols-4 grid-cols-2 gap-8">
        <div className="xl:h-80 md:h-60 sm:h-80 h-40 relative group">
          <Image
            src={STORY4}
            alt="this is image test"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute top-0 opacity-0 transition-all duration-300 justify-center items-center w-full h-full group-hover:opacity-100 group-hover:backdrop-blur-xs flex">
            <Button variant={"outline"}>
              <FaInstagram />
            </Button>
          </div>
        </div>
        <div className="xl:h-80 md:h-60 sm:h-80 h-40 relative group">
          <Image
            src={STORY2}
            alt="this is image test"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 opacity-0 transition-all duration-300 justify-center items-center w-full h-full group-hover:opacity-100 group-hover:backdrop-blur-xs flex">
            <Button variant={"outline"}>
              <FaInstagram />
            </Button>
          </div>
        </div>
        <div className="xl:h-80 md:h-60 sm:h-80 h-40 relative group">
          <Image
            src={STORY3}
            alt="this is image test"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute top-0 opacity-0 transition-all duration-300 justify-center items-center w-full h-full group-hover:opacity-100 group-hover:backdrop-blur-xs flex">
            <Button variant={"outline"}>
              <FaInstagram />
            </Button>
          </div>
        </div>
        <div className="xl:h-80 md:h-60 sm:h-80 h-40 relative group">
          <Image
            src={STORY1}
            alt="this is image test"
            className="w-full h-full object-cover object-top"
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
