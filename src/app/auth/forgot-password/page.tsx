/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useContext, useState } from "react";
import LOGO from "../../../assets/logo.png";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import ButtonLoading from "@/components/ButtonLoading";
import { useRouter } from "next/navigation";
import { post } from "@/utils/requets";
import { SystemSettingContext } from "@/context/systemSettingContext";

const ForgotPassword = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();
  const { system_settings } = useContext(SystemSettingContext);

  const handleCheckEmail = async (email: string) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      if (!email) {
        setErrorMessage("Email is required");
        setIsLoading(false);
        return;
      }

      const response = await post("/auth/forgot-password", { email });

      const data = response.data;
      sessionStorage.setItem(
        "forgot_email_time",
        JSON.stringify({
          email: data.email,
          minutes: Math.floor(
            (new Date(data.expiredAt).getTime() - new Date().getTime()) /
              (1000 * 60)
          ),
          seconds: Math.floor(
            ((new Date(data.expiredAt).getTime() - new Date().getTime()) %
              (1000 * 60)) /
              1000
          ),
        })
      );

      router.push("/auth/forgot-password/otp");
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-screen flex gap-2 dark:text-white/80">
        <div className="bg-[url(../assets/bg-forgot-password.png)] bg-no-repeat bg-cover bg-center h-full md:w-5/9 md:block hidden">
          <div
            onClick={() => (window.location.href = "/")}
            className="cursor-pointer inline-block"
          >
            {" "}
            <Image
              alt="LOGO"
              src={system_settings?.logoDark || LOGO}
              width={142}
              height={58}
              className="mt-5 ml-5"
              priority
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center px-6">
          <a
            href="/auth/login"
            className="flex items-center gap-2 mb-6 cursor-pointer"
          >
            <ChevronLeft />
            Back
          </a>
          <div className="mb-8 space-y-2  lg:max-w-2/3">
            <h3 className="text-3xl font-bold">Forgot Password</h3>
            <p className="text-neutral-400 text-sm">
              Enter your registered email address. we’ll send you a code to
              reset your password.
            </p>
          </div>
          <div className="lg:max-w-9/10 flex flex-col gap-0.5">
            <Label className="text-sm text-gray-500">Email address</Label>
            <Input
              type="email"
              placeholder="Email"
              className="py-5"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
            />
            <div className="h-2 mb-4 mt-2">
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
            </div>
            <ButtonLoading
              onClick={() => handleCheckEmail(email)}
              className="py-5.5 mt-4"
              typeLoading={1}
              loading={isLoading}
              disabled={isLoading}
            >
              Send OTP
            </ButtonLoading>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
