/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ButtonLoading from "@/components/ButtonLoading";
import { ChevronLeft, CircleCheckBig } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import LOGO from "../../../../assets/logo.png";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { post } from "@/utils/requets";
import DialogCheckoutSuccess from "@/components/dialog/DialogCheckoutSuccess";
import { SystemSettingContext } from "@/context/systemSettingContext";

const EnterOTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeoutOTP, setTimeoutOTP] = useState({
    minutes: 3,
    seconds: 1,
  });
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isResend, setIsResend] = useState(false);

  const { system_settings } = useContext(SystemSettingContext);

  useEffect(() => {
    const existEmailWithTime = sessionStorage.getItem("forgot_email_time");
    if (!existEmailWithTime) {
      window.location.href = "/auth/forgot-password";
    } else {
      const { email, minutes, seconds } = JSON.parse(existEmailWithTime);
      setTimeoutOTP({ minutes, seconds });
      setEmail(email);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeoutOTP((prev) => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            clearInterval(interval);
            sessionStorage.removeItem("forgot_email_time");
            return { minutes: 0, seconds: 0 };
          }
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);

    if ((timeoutOTP.minutes === 0 && timeoutOTP.seconds === 0) || dialogOpen) {
      sessionStorage.removeItem("forgot_email_time");
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timeoutOTP]);

  const cnInput = `w-10 h-10 border border-gray-300 rounded-md text-center text-base`;

  const renderResendButton = () => {
    if (timeoutOTP.minutes === 0 && timeoutOTP.seconds === 0) {
      return (
        <span className="text-neutral-400">
          Didn’t receive the code?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={handleResendOTP}
          >
            Resend
          </span>
        </span>
      );
    }
    return (
      <span className="text-neutral-600 text-sm">
        Resend after {timeoutOTP.minutes}:
        {timeoutOTP.seconds < 10
          ? `0${timeoutOTP.seconds}`
          : timeoutOTP.seconds}
      </span>
    );
  };

  const handleSubmit = async () => {
    try {
      if (!otp || otp.length < 6) {
        setErrorMessage("Please enter a valid OTP.");
        return;
      }
      setIsLoading(true);
      setErrorMessage("");
      await post("/auth/forgot-password/verify-otp", {
        email,
        otp,
      });
      sessionStorage.removeItem("forgot_email_time");
      setDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      await post("/auth/forgot-password", { email });

      sessionStorage.setItem(
        "forgot_email_time",
        JSON.stringify({
          email,
          minutes: 3,
          seconds: 0,
        })
      );
      setTimeoutOTP({ minutes: 3, seconds: 0 });
      setOtp(""); // Reset OTP input
      setIsResend(true);
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-screen flex gap-2 dark:text-white/80">
        <div className="bg-[url(../assets/bg-otp.png)] bg-no-repeat bg-cover bg-center h-full md:w-5/9 md:block hidden">
          <div
            onClick={() => (window.location.href = "/")}
            className="cursor-pointer inline-block"
          >
            {" "}
            <Image
              alt="LOGO"
              src={system_settings?.logoDark || LOGO}
              className="mt-5 ml-5"
              priority
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center px-6">
          <a
            href="/auth/forgot-password"
            className="flex items-center gap-2 mb-6 cursor-pointer"
          >
            <ChevronLeft />
            Back
          </a>
          <div className="mb-8 space-y-2">
            <h3 className="text-3xl font-bold">Enter OTP</h3>
            {isResend && (
              <p className="text-green-500 text-sm">
                OTP has been resent to your email.
              </p>
            )}
            <p className="text-neutral-400 text-sm">
              We have shared a code to your registered email address{" "}
              <span className="font-semibold text-black/60">
                {email || "example@example.com"}
              </span>
              . Please enter the code below to verify your identity and reset
              your password.
            </p>
          </div>
          <div className="lg:max-w-9/10 flex flex-col gap-0.5">
            <div className="flex items-center justify-center">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                className="py-8 "
                value={otp}
                onChange={(e) => {
                  setOtp(e);
                  setErrorMessage("");
                }}
              >
                <InputOTPGroup className="flex items-center gap-4">
                  <InputOTPSlot index={0} className={cnInput} />
                  <InputOTPSlot index={1} className={cnInput} />
                  <InputOTPSlot index={2} className={cnInput} />
                  <InputOTPSlot index={3} className={cnInput} />
                  <InputOTPSlot index={4} className={cnInput} />
                  <InputOTPSlot index={5} className={cnInput} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="h-2 my-2 mb-4">
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
            </div>
            <ButtonLoading
              onClick={handleSubmit}
              className="py-5.5 mt-4"
              typeLoading={1}
              loading={isLoading}
              disabled={isLoading}
            >
              Verify
            </ButtonLoading>

            <div className="flex items-center justify-center mt-4">
              {renderResendButton()}
            </div>
          </div>
        </div>
      </div>
      <DialogCheckoutSuccess
        open={dialogOpen}
        icon={<CircleCheckBig size={20} />}
        actionText="Back to Login"
        isChangePassword
        title="Password Changed Successfully"
        description="Your password has been changed successfully, please check your email for the confirmation."
        onAction={() => {
          window.location.href = "/auth/login";
        }}
      />
    </>
  );
};

export default EnterOTP;
