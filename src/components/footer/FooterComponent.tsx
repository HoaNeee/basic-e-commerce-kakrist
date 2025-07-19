import Image from "next/image";
import React from "react";
import LOGO from "../../assets/logo-white.png";
import { BiPhoneCall } from "react-icons/bi";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import AMEX from "../../assets/amex.png";
import GOOGLE from "../../assets/google.png";
import PAYPAL from "../../assets/paypal.png";
import MASTER from "../../assets/master.png";
import VISA from "../../assets/visa.png";
import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { Button } from "../ui/button";
import { FaLongArrowAltRight } from "react-icons/fa";

const payment = [AMEX, GOOGLE, PAYPAL, MASTER, VISA];

const FooterComponent = () => {
  return (
    <footer className="w-full bg-[#131118] tracking-wider font-light">
      <div className="container w-full xl:px-4 px-2 md:px-0 mx-auto">
        <div className="grid grid-cols-2 md:gap-0 gap-6 md:grid-cols-4 py-16 text-white">
          <div>
            <Image alt="this is LOGO" src={LOGO} width={142} height={58} />
            <div className="text-white flex flex-col gap-5 mt-5">
              <div className="flex gap-2 items-center">
                <BiPhoneCall size={21} /> <span>0393911183</span>{" "}
              </div>
              <div className="flex gap-2 items-center">
                <MdOutlineMailOutline size={21} />{" "}
                <span>nhhoa03@gmail.com</span>{" "}
              </div>
              <div className="flex gap-2 items-center">
                <FaMapMarkerAlt size={21} /> <span>Hanoi, Vietnam</span>{" "}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold">Information</p>
            <p className="">My Account</p>
            <p>Login</p>
            <p>My Cart</p>
            <p>My Wishlist</p>
            <p>Checkout</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold">Service</p>
            <p>About Us</p>
            <p>Careers</p>
            <p>My Cart</p>
            <p>Delivery Infomation</p>
            <p>Privacy Policy</p>
            <p>Terms & Conditions</p>
          </div>
          <div className="flex flex-col gap-5">
            <p className="font-bold">Subscribe</p>
            <p>
              Enter your email below to be the first to know about new
              collections and product launches.
            </p>
            <div>
              <form action={"/"}>
                <div className="px-2 h-13 border-2 border-white rounded-md flex items-center pl-4">
                  <MdOutlineMailOutline size={30} />
                  <input
                    type="email"
                    name="email"
                    className="w-full h-full outline-0 pl-2 bg-transparent dark"
                    placeholder="Your Email"
                  />
                  <Button title="Subscribe">
                    <FaLongArrowAltRight />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="container w-full xl:px-4 px-2 md:px-0 text-white mx-auto">
        <div className="flex gap-2 w-full border-t-2 py-6 border-gray-500 items-center justify-between relative">
          <div className="hidden gap-2 md:flex">
            {payment.map((item, index) => (
              <div
                key={index}
                className="lg:w-[46px] lg:h-[28px] w-[40px] h-[22px] rounded-[3px] bg-white flex items-center justify-center"
              >
                <Image src={item} alt="payment" className="" />
              </div>
            ))}
          </div>
          <div className="absolute flex items-center justify-center left-0 w-full h-full">
            <p className="">@2025 Krist All Rights are reserved </p>
          </div>

          <div className="items-center hidden gap-2 md:flex">
            <FaFacebookF size={18} />
            <FaInstagram size={18} />
            <BsTwitterX size={18} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
