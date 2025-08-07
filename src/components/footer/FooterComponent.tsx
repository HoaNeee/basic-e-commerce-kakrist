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
    const isToastLogin = localStorage.getItem("is_toast_login_success");
    if (isToastLogin && isToastLogin === "true") {
      toast.success("Login successfully, Welcome!", {
        description: "You have successfully logged in.",
        style: {
          top: "75px",
        },
      });
      localStorage.removeItem("is_toast_login_success");
    }
  };

  const socialLinks = [
    {
      icon: <FaFacebookF size={18} />,
      href: system_settings.facebook || "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: <FaInstagram size={18} />,
      href: system_settings.instagram || "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: <BsTwitterX size={18} />,
      href: system_settings.twitter || "https://twitter.com",
      label: "Twitter",
    },
  ];

  if (pathName.startsWith("/auth") || pathName.startsWith("/error")) {
    return <></>;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          <div className="lg:col-span-1">
            <Image
              alt="Company Logo"
              src={LOGO}
              width={142}
              height={58}
              className="mb-6"
            />
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for premium fashion and lifestyle products.
              Quality guaranteed, customer satisfaction first.
            </p>

            <div className="space-y-3">
              <Link
                href={"tel:+84393911183"}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <BiPhoneCall size={18} />
                <span>{system_settings.phone || "+84 393 911 183"}</span>
              </Link>
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <MdOutlineMailOutline size={18} />
                <span>{system_settings.email || "contact@kakrist.com"}</span>
              </div>
              <Link
                href={"https://www.google.com/maps?q=Hanoi,+Vietnam"}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <FaMapMarkerAlt size={18} />
                <span>{system_settings.address || "Hanoi, Vietnam"}</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Account</h3>
            <ul className="space-y-3">
              {footerLinks.information.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.service.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Subscribe to get updates on new collections and exclusive offers.
            </p>

            <form className="space-y-4">
              <div className="flex relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-6 pr-10 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-gray-500 text-white placeholder-gray-400"
                />
                <Button
                  type="submit"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-6 absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <FaLongArrowAltRight />
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-sm font-medium mb-3">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              {payment.map((item, index) => (
                <div
                  key={index}
                  className="w-10 h-6 bg-white rounded flex items-center justify-center p-1"
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
