/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/redux/store";
import { get } from "@/utils/requets";
import {
  Settings,
  User,
  Heart,
  Package,
  MapPin,
  CreditCard,
  Bell,
  Lock,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const tabs = [
  {
    name: "Change Password",
    value: "/change-password",
    icon: Lock,
  },
  {
    name: "Personal Infomation",
    value: "/",
    icon: User,
    component: <div>Profile</div>,
  },
  {
    name: "My Order",
    value: "/orders",
    icon: Package,
  },
  {
    name: "My Wishlists",
    value: "/wishlists",
    icon: Heart,
  },
  {
    name: "Manager Address",
    value: "/address",
    icon: MapPin,
  },
  {
    name: "Saved Cards",
    value: "/credit-card",
    icon: CreditCard,
  },
  {
    name: "Notifications",
    value: "/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    value: "/settings",
    icon: Settings,
  },
];

const ProfileLayout = ({ children }: { children: any }) => {
  const [loaded, setLoaded] = useState(false);
  const [isCheckRead, setIsCheckRead] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const auth = useSelector((state: RootState) => state.auth.auth);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!auth.isLogin && loaded) {
      router.replace("/");
    }
  }, [auth]);

  useEffect(() => {
    checkRead();
  }, [pathName]);

  // FIX THEN
  const checkRead = async () => {
    try {
      const response = await get("/notifications/check-read");
      setIsCheckRead(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!loaded) {
    return (
      <div className="w-full flex items-start gap-8 justify-center flex-row h-130">
        <Skeleton className="w-60 h-full" />
        <Skeleton className="flex-1 h-full" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs
        orientation="vertical"
        value={pathName.substring(8) || "/"}
        className="w-full flex items-start gap-8 justify-center flex-row"
        onValueChange={(value) => {
          router.push(`/profile/${value}`);
        }}
      >
        <TabsList className="shrink-0 grid grid-cols-1 p-0 bg-background border-2 border-muted rounded-none h-full pb-6 w-60 sticky top-30">
          <div className="py-6 px-4 border-b-2 border-muted">
            <div className="flex items-center gap-3 text-black dark:text-white/70">
              <Avatar className="h-13 w-13 bg-gray-100/40">
                {auth.avatar && <AvatarImage src={auth.avatar} alt="avatar" />}
                <AvatarFallback className="">
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
              <div className="">
                <p className="">
                  <span className="text-sm">Hello</span> 👋
                </p>
                <p className="font-bold text-wrap">
                  {auth.firstName} {auth.lastName}
                </p>
              </div>
            </div>
          </div>
          {tabs.slice(1).map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`justify-start rounded-none data-[state=active]:shadow-none data-[state=active]:bg-black dark:data-[state=active]:bg-white/90 data-[state=active]:text-white dark:data-[state=active]:text-black/80 py-4 transition-all duration-300 tracking-wider cursor-pointer px-5 ${
                pathName === "/profile/change-password" && tab.value === "/"
                  ? "bg-black text-white dark:bg-white/90 dark:text-black"
                  : ""
              }`}
              title={tab.name}
            >
              <div className="relative">
                <tab.icon className="size-5 me-2" />
                {tab.value === "/notifications" && isCheckRead && (
                  <div className="absolute -top-0.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </div>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="min-h-100 w-full">
          {tabs.map((tab, index) => (
            <TabsContent
              key={index}
              value={tab.value}
              className="w-full h-full px-4"
            >
              {tab.value === (pathName.substring(8) || "/") ? children : null}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default ProfileLayout;
