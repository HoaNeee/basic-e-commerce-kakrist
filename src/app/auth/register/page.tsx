/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Suspense, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import LOGO from "../../../assets/logo.png";
import Image from "next/image";
import { post } from "@/utils/requets";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircleIcon } from "lucide-react";

const formSchema = z.object({
  firstName: z.any(),
  lastName: z.any(),
  email: z
    .string({
      message: "Please enter this field!",
    })
    .email(),
  password: z.string().min(1, {
    message: "Please enter this field!",
  }),
  term: z.literal(true, {
    message: "Please agree our terms!",
  }),
});

const LayoutRegisterWithSuspense = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeInterval, setTimeInterval] = useState(5);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const setting = useSelector((state: RootState) => state.setting.setting);

  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setTimeInterval(timeInterval - 1);
      }, 1000);

      if (timeInterval <= 0) {
        window.location.href = `/auth/login${
          next ? `?next=${encodeURIComponent(next)}` : ""
        }`;
        clearInterval(timer);
      }
      return () => clearInterval(timer);
    }
  }, [isSuccess, next, timeInterval]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await post("/auth/register", values);
      setIsSuccess(true);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex gap-2 dark:text-white/80">
      <div className="bg-[url(../assets/auth-register.png)] bg-no-repeat bg-cover h-full md:w-5/9 md:block hidden">
        <Image alt="LOGO" src={LOGO} className="mt-5 ml-5" />
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 transition-all duration-300">
        <div className="mb-4">
          <h3 className="text-3xl font-bold">Create New Account</h3>
          <p className="text-neutral-400 text-sm">Please enter details</p>
        </div>
        <div
          className="mb-8 transition-all duration-300 ease-in-out"
          style={{
            opacity: isSuccess ? "1" : "0",
            visibility: isSuccess ? "visible" : "hidden",
            transition: "opacity 0.3s, visibility 0.3s",
            maxHeight: isSuccess ? "200px" : "0",
          }}
        >
          <Alert
            className={`${
              isSuccess ? "opacity-100 visible" : "opacity-0 invisible"
            } transition-all duration-300 bg-green-50 text-green-600`}
          >
            <CheckCircleIcon className="text-green-500" />
            <AlertTitle>Register successfully!</AlertTitle>
            <AlertDescription className="flex items-center gap-1">
              You will be redirected to the{" "}
              <a href="/auth/login" className="underline inline italic">
                login
              </a>{" "}
              page in {timeInterval} seconds.
            </AlertDescription>
          </Alert>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => {
                return (
                  <FormItem {...field}>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your First Name"
                        className={`py-5 ${setting.theme}`}
                        name="firstName"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => {
                return (
                  <FormItem {...field}>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        className={`py-5 ${setting.theme}`}
                        placeholder="Your Last Name"
                        name="lastName"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem {...field}>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        className={`py-5 ${setting.theme}`}
                        placeholder="Your Email Address"
                        name="email"
                        onChange={() => {
                          setErrorMessage("");
                        }}
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
                        className={`py-5 ${setting.theme}`}
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
              name="term"
              render={({ field }) => {
                return (
                  <FormItem {...field} className="my-3">
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">
                          I agree to the
                          <span className="font-bold">Terms & Conditions</span>
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {errorMessage && (
              <span className="text-red-600 text-sm">{errorMessage}</span>
            )}
            <Button
              disabled={isLoading || isSuccess}
              type="submit"
              className="py-6 transition-all duration-400 flex items-center justify-center relative"
            >
              <div
                className="opacity-0 transition-all duration-300 invisible"
                style={{
                  opacity: isLoading ? "1" : undefined,
                  visibility: isLoading ? "visible" : undefined,
                }}
              >
                <Spinner size={40} />
              </div>
              {
                <p
                  className="transition-all duration-300 absolute flex items-center justify-center"
                  style={{
                    marginLeft: isLoading ? "86px" : undefined,
                  }}
                >
                  Signup
                </p>
              }
            </Button>
            <div className="text-center mt-5">
              <p>
                {"Already an account? "}{" "}
                <a
                  href={`/auth/login${
                    next ? `?next=${encodeURIComponent(next)}` : ""
                  }`}
                  className="text-blue-600 italic"
                >
                  login
                </a>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const Register = () => {
  return (
    <Suspense fallback={<></>}>
      <LayoutRegisterWithSuspense />
    </Suspense>
  );
};

export default Register;
