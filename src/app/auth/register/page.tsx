/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
import LoadingComponent from "@/components/LoadingComponent";
import LOGO from "../../../assets/logo.png";
import Image from "next/image";
import { post } from "@/utils/requets";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

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

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const response = await post("/auth/register", values);
      toast.success(response.message, {
        description: "You register account sccuess, login now!",
        action: {
          label: (
            <Link
              href={`/auth/login${
                next ? `?next=${encodeURIComponent(next)}` : ""
              }`}
            >
              Login
            </Link>
          ),
          onClick() {},
        },
      });
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex gap-2">
      <div className="bg-[url(../assets/auth-register.png)] bg-no-repeat bg-cover h-full md:w-5/9 md:block hidden">
        <Image alt="LOGO" src={LOGO} className="mt-5 ml-5" />
      </div>
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="mb-8">
          <h3 className="text-3xl font-bold">Create New Account</h3>
          <p className="text-neutral-400 text-sm">Please enter details</p>
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
                      <Input placeholder="Your First Name" className="py-5" />
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
                      <Input className="py-5" placeholder="Your Last Name" />
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
                        className="py-5"
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
                        className="py-5"
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
              disabled={isLoading}
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
                <LoadingComponent size={30} />
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
                <Link
                  href={`/auth/login${
                    next ? `?next=${encodeURIComponent(next)}` : ""
                  }`}
                  className="text-blue-600 italic"
                >
                  login
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
