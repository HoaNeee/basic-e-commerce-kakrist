"use client";

import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import { toast } from "sonner";

const GoogleLogin = () => {
  useEffect(() => {
    const error = localStorage.getItem("google_login_error");
    if (error) {
      console.log("Login google: " + error);
      toast.error("Google login failed", {
        description: "Please try again or use a different login method.",
      });
      localStorage.removeItem("google_login_error");
    }
  }, []);

  const handleLoginWithGoogle = async () => {
    const endpont = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      redirect_uri: `https://shop.kakrist.site/auth/google`,
      response_type: "code",
      scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      access_type: "offline",
      prompt: "consent",
    });
    const url = `${endpont}?${params.toString()}`;
    window.location.href = url;
  };

  return (
    <Button
      type="button"
      variant={"outline"}
      onClick={() => {
        handleLoginWithGoogle();
      }}
      className="py-6"
      id="google-login-button"
    >
      <FcGoogle size={22} className="size-6" />
      Login with Google
    </Button>
  );
};

export default GoogleLogin;
