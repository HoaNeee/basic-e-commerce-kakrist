/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ButtonLoading from "@/components/ButtonLoading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { patch } from "@/utils/requets";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const password = e.target[0].value;
      const newPassword = e.target[1].value;
      const confirmPassword = e.target[2].value;

      if (!password || !newPassword || !confirmPassword) {
        throw Error("Please enter these field.");
      }

      if (newPassword !== confirmPassword) {
        throw Error("Your confirm password do not match.");
      }

      const payload = {
        password,
        newPassword,
        confirmPassword,
      };

      const api = "/auth/profile/change-password";
      const response = await patch(api, payload);
      toast.success(response.message, {
        description: "Your password was be changed",
        action: {
          label: "Close",
          onClick() {},
        },
      });

      router.replace("/profile");
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={"/profile"}>Profile</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Change Password</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mt-6">
        <form onSubmit={handleSubmit} className="flex flex-col max-w-1/2 gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Current Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your current password"
              className="py-5"
              onChange={() => {
                setErrorMessage("");
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              placeholder="Enter your new password"
              className="py-5"
              onChange={() => {
                setErrorMessage("");
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Enter password"
              className="py-5"
              onChange={() => {
                setErrorMessage("");
              }}
            />
          </div>
          <div className="h-4">
            {errorMessage && (
              <p className="text-red-600 text-sm tracking-wider">
                {errorMessage}
              </p>
            )}
          </div>
          <div className="w-1/3">
            <ButtonLoading
              loading={isLoading}
              className="w-full"
              typeLoading={1}
            >
              Save
            </ButtonLoading>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
