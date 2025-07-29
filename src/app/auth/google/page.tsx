/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { BASE_URL } from "@/utils/requets";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const GoogleLoginPageCallback = () => {
  const searchParams = useSearchParams();

  const code = searchParams.get("code") || "";
  const error = searchParams.get("error") || "";

  const handleCheckParams = useCallback(() => {
    if (!code && !error) {
      console.error("No code or error in URL parameters.");
      window.location.href = "/auth/login";
      return;
    }
    if (error) {
      console.error("Error during Google login:", error);
      localStorage.setItem("google_login_error", error);
      window.location.href = "/auth/login";
      return;
    }
  }, [code, error]);

  useEffect(() => {
    handleCheckParams();
    if (code) {
      handleVerifyCode(code);
    }
  }, [code, error, handleCheckParams]);

  const handleVerifyCode = async (code?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/google`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();
      if (result.code === 200) {
        localStorage.setItem("is_toast_login_success", "true");
        window.location.href = "/";
      } else {
        if (result.code === 409) {
          //dialog, show message,... -> DO THEN
          console.log(
            "Email already exists with another provider, need linking with an existing account!"
          );
        } else {
          throw Error(
            result.message || "An error occurred during Google login."
          );
        }
      }
    } catch (error: any) {
      localStorage.setItem(
        "google_login_error",
        error.message || "An error occurred"
      );
      console.log("Error during Google login:", error);
      window.location.href = "/auth/login";
    }
  };

  return <div className="min-h-screen bg-white dark:bg-black w-full"></div>;
};

export default GoogleLoginPageCallback;
