/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useEffect } from "react";
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
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { SystemSettingModel } from "@/models/settingSystem";
import { post } from "@/utils/requets";

const payment = [AMEX, GOOGLE, PAYPAL, MASTER, VISA];

const footerLinks = {
  information: [
    { title: "My Account", href: "/profile" },
    { title: "Login", href: "/auth/login" },
    { title: "My Cart", href: "/cart" },
    { title: "Wishlist", href: "/wishlists" },
    { title: "Checkout", href: "/cart/checkout" },
  ],
  service: [
    { title: "About Us", href: "/stories" },
    { title: "Contact", href: "/contact" },
    { title: "Shipping Info", href: "/" },
    { title: "Privacy Policy", href: "/" },
    { title: "Terms & Conditions", href: "/" },
  ],
};

const FooterComponent = ({
  system_settings,
}: {
  system_settings: SystemSettingModel;
}) => {
  const pathName = usePathname();

  useEffect(() => {
    checkIsToastLogin();
  }, []);

  const checkIsToastLogin = () => {
    const isToastLogin = sessionStorage.getItem("is_toast_login_success");
    if (isToastLogin && isToastLogin === "true") {
      toast.success("Login successfully, Welcome!", {
        description: "You have successfully logged in.",
        style: {
          top: "75px",
        },
      });
      sessionStorage.removeItem("is_toast_login_success");
    }
  };

  const socialLinks = [
    {
      icon: <FaFacebookF size={18} />,
      href: system_settings?.facebook || "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: <FaInstagram size={18} />,
      href: system_settings?.instagram || "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: <BsTwitterX size={18} />,
      href: system_settings?.twitter || "https://twitter.com",
      label: "Twitter",
    },
  ];

  if (pathName.startsWith("/auth") || pathName.startsWith("/error")) {
    return <></>;
  }

  const handleSubscribe = async (e: any) => {
    e.preventDefault();

    const email = e.target[0].value;
    if (!email) {
      return;
    }
    try {
      const response = await post("/subscribers", { email });
      toast.success(response.message, {
        description: "You have successfully subscribed to our newsletter.",
        position: "top-center",
      });
      e.target[0].value = "";
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to subscribe");
    }
  };

  return (
    <footer className="text-white bg-gray-900">
      <div className="max-w-7xl px-4 mx-auto">
        <div className="md:grid-cols-2 lg:grid-cols-4 grid grid-cols-1 gap-8 py-16">
          <div className="lg:col-span-1">
            <Image
              alt="Company Logo"
              src={LOGO}
              width={142}
              height={58}
              className="mb-6"
            />
            <p className="mb-6 leading-relaxed text-gray-400">
              Your trusted partner for premium fashion and lifestyle products.
              Quality guaranteed, customer satisfaction first.
            </p>

            <div className="space-y-3">
              <Link
                href={"tel:+84393911183"}
                className="hover:text-white flex items-center gap-3 text-gray-300 transition-colors"
              >
                <BiPhoneCall size={18} />
                <span>{system_settings?.phone || "+84 393 911 183"}</span>
              </Link>
              <div className="hover:text-white flex items-center gap-3 text-gray-300 transition-colors">
                <MdOutlineMailOutline size={18} />
                <span>{system_settings?.email || "contact@kakrist.com"}</span>
              </div>
              <Link
                href={"https://www.google.com/maps?q=Hanoi,+Vietnam"}
                className="hover:text-white flex items-center gap-3 text-gray-300 transition-colors"
              >
                <FaMapMarkerAlt size={18} />
                <span>{system_settings?.address || "Hanoi, Vietnam"}</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold">Account</h3>
            <ul className="space-y-3">
              {footerLinks.information.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-white text-gray-400 transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold">Company</h3>
            <ul className="space-y-3">
              {footerLinks.service.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-white text-gray-400 transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold">Stay Updated</h3>
            <p className="mb-6 leading-relaxed text-gray-400">
              Subscribe to get updates on new collections and exclusive offers.
            </p>

            <form className="space-y-4" onSubmit={handleSubscribe}>
              <div className="relative flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="focus:outline-none focus:border-gray-500 flex-1 px-4 py-6 pr-10 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-l-lg"
                />
                <Button
                  type="submit"
                  className="hover:bg-gray-100 right-2 top-1/2 absolute px-6 text-gray-900 transform -translate-y-1/2 bg-white"
                >
                  <FaLongArrowAltRight />
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <p className="mb-3 text-sm font-medium">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="hover:bg-gray-700 hover:text-white flex items-center justify-center w-10 h-10 text-gray-400 transition-colors duration-200 bg-gray-800 rounded-full"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-gray-800">
          <div className="md:flex-row flex flex-col items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {payment.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center w-10 h-6 p-1 bg-white rounded"
                >
                  <Image
                    src={item}
                    alt="Payment method"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                ©2025 Krist. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
