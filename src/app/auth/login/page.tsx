/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Suspense, useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import LOGOWHITE from "../../../assets/logo-white.png";
import Image from "next/image";
import Link from "next/link";
import { post } from "@/utils/requets";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import LoadingComponent from "@/components/LoadingComponent";
import GoogleLogin from "@/components/GoogleLogin";
import { SystemSettingContext } from "@/context/systemSettingContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const formSchema = z.object({
  email: z
    .string({
      message: "Please enter this field!",
    })
    .email(),
  password: z.string().min(1, {
    message: "Please enter this field!",
  }),
  isRemmember: z.any(),
});

const LayoutLoginWithSuspense = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { system_settings } = useContext(SystemSettingContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isRemmember: false,
    },
  });

  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const setting = useSelector((state: RootState) => state.setting.setting);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await post("/auth/login", values);
      window.location.href = next ?? "/";
      sessionStorage.setItem("is_toast_login_success", "true");
    } catch (error: any) {
      toast.error(error.message, {
        description: "Login failed!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark:text-white/80 flex w-full h-screen gap-2">
      <div className="bg-[url(../assets/auth-login.jpg)] bg-no-repeat bg-cover h-full md:w-5/9 md:block hidden">
        <div
          onClick={() => (window.location.href = "/")}
          className="inline-block cursor-pointer"
        >
          {" "}
          <Image
            alt="LOGO"
            src={system_settings?.logoLight || LOGOWHITE}
            className="mt-5 ml-5"
            priority
            width={142}
            height={58}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center flex-1 px-6">
        <div className="mb-8">
          <h3 className="text-3xl font-bold">Welcome 👋</h3>
          <p className="text-neutral-400 text-sm">Please login here</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem {...field}>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        className={`py-5 ${setting?.theme} dark:autofill:text-white`}
                        placeholder="Your Email Address"
                        name="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem {...field}>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className={`py-5 ${setting?.theme}  dark:autofill:text-white`}
                        placeholder="Your Password"
                        name="password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="isRemmember"
              render={({ field }) => {
                return (
                  <FormItem {...field}>
                    <FormControl>
                      <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-2">
                          <Checkbox id="remember" />
                          <Label htmlFor="remember">Remember me</Label>
                        </div>
                        <Link
                          href={"/auth/forgot-password"}
                          className="text-sm italic font-medium"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <Button
              disabled={isLoading}
              type="submit"
              className="duration-400 relative flex items-center justify-center py-6 transition-all"
            >
              <div
                className="invisible transition-all duration-300 opacity-0"
                style={{
                  opacity: isLoading ? "1" : undefined,
                  visibility: isLoading ? "visible" : undefined,
                }}
              >
                <Spinner size={40} />
              </div>
              {
                <p
                  className="absolute flex items-center justify-center transition-all duration-300"
                  style={{
                    marginLeft: isLoading ? "86px" : undefined,
                  }}
                >
                  Login
                </p>
              }
            </Button>

            <GoogleLogin />

            <div className="mt-5 text-center">
              <p>
                {"Don't have an account? "}{" "}
                <a
                  href={`/auth/register${
                    next ? `?next=${encodeURIComponent(next)}` : ""
                  }`}
                  className="italic text-blue-600"
                >
                  register
                </a>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <Suspense fallback={<LoadingComponent type="screen" />}>
      <LayoutLoginWithSuspense />
    </Suspense>
  );
};

export default Login;
