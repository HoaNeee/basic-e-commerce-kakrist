/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { addAuth, removeAuth } from "@/redux/reducer/authReducer";
import { removeCart, syncCart } from "@/redux/reducer/cartReducer";
import { removeList, syncList } from "@/redux/reducer/favoriteReducer";
import { RootState } from "@/redux/store";
import { socket } from "@/socket/socket";
import { fetcher, get, post } from "@/utils/requets";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import useSWR from "swr";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { FaBars } from "react-icons/fa6";
import MenuNavMobile from "./MenuNavMobile";
import { MenuNav } from "./MenuNav";
import SearchComponent from "./SearchComponent";
import { IoIosHeartEmpty } from "react-icons/io";
import MiniCart from "./MiniCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, User } from "lucide-react";
import LOGOWHITE from "@/assets/logo-white.png";
import LOGOAPP from "@/assets/logo.png";
import { SystemSettingModel } from "@/models/settingSystem";
import { Skeleton } from "../ui/skeleton";

const routePrivate = ["/profile", "/cart"];

const HeaderClient = ({
  system_settings,
}: {
  system_settings: SystemSettingModel;
}) => {
  const [isLogouting, setIsLogouting] = useState(false);

  const auth = useSelector((state: RootState) => state.auth.auth);
  const pathName = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const setting = useSelector((state: RootState) => state.setting.setting);

  const { data, isLoading, error } = useSWR("/auth/profile", fetcher, {
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (error) {
      return () => {};
    }

    console.log("data", data);

    if (data && data.code === 200) {
      checkIsSessionLogin(data.data);
      dispatch(
        addAuth({
          ...data.data,
          isLogin: true,
        })
      );
    } else {
      if (auth.isLogin) {
        dispatch(removeAuth());
        dispatch(syncCart([]));
        dispatch(syncList([]));
      }
    }
  }, [data]);

  useEffect(() => {
    if (auth.isLogin) {
      getCart();
      getListFavorite();

      socket.on("SERVER_RETURN_CHANGE_STATUS_ORDER", (data: any) => {
        if (data.user_id === auth.user_id) {
          toast(renderNotify(data), {
            duration: 5000,
          });
        }
      });
    }

    return () => {
      socket.off("SERVER_RETURN_CHANGE_STATUS_ORDER");
    };
  }, [auth.isLogin]);

  const renderNotify = (data: any) => {
    return (
      <Link
        href={`${data.ref_link}?order_no=${data.ref_id}`}
        className="flex items-center gap-4 w-full h-full"
      >
        <div
          className={`size-13 rounded-full overflow-hidden flex items-center justify-center bg-gray-100`}
        >
          <div className="w-6 h-6">
            <img src={data.image} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-base">Notification</p>
          <p className="text-sm text-neutral-600 tracking-wider">
            {data.title}
          </p>
          <span className="text-xs text-neutral-400">Click to check!</span>
        </div>
      </Link>
    );
  };

  const getCart = async () => {
    try {
      const response = await get("/cart");
      dispatch(syncCart(response.data));
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getListFavorite = async () => {
    try {
      const response = await get("/favorites");
      const list = response?.data?.list?.products || [];
      const listBlog = response?.data?.listBlog?.blogs || [];
      console.log(response);
      dispatch(
        syncList({
          list: list,
          listBlog: listBlog,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLogouting(true);
      const response = await post("/auth/logout", {});
      toast.success(response.message, {
        duration: 1000,
      });

      // socket.disconnect();
      checkRedirect();
      sessionStorage.removeItem("logined_session");
      dispatch(removeAuth());
      dispatch(removeCart([]));
      dispatch(removeList([]));
      setIsLogouting(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const checkRedirect = () => {
    for (const route of routePrivate) {
      if (pathName.startsWith(route)) {
        window.location.href =
          "/auth/login?next=" + encodeURIComponent(pathName);
        return;
      }
    }
  };

  const checkIsSessionLogin = (data: any) => {
    if (data.has_welcome) {
      toast.success(`Welcome back! ${data.firstName} ${data.lastName}`, {
        description: "You have successfully logged in.",
        style: {
          top: "75px",
        },
      });
    }
  };

  if (isLoading) {
    if (pathName.startsWith("/auth") || pathName.startsWith("/error")) {
      return <></>;
    }
    return (
      <div className="flex items-center justify-center w-full z-40 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-20">
        <div className="container w-full py-5 flex justify-between items-center bg-white xl:px-4 md:px-0 px-2 dark:bg-black">
          <div className="items-center gap-4 md:block flex">
            <Link className="w-30 h-12 md:block hidden" href="/">
              <Image
                alt="LOGO"
                src={system_settings?.logoDark || LOGOAPP}
                width={142}
                height={58}
                priority
                className="w-full h-full"
              />
            </Link>
            <div className="md:hidden block">
              <FaBars size={20} />
            </div>
          </div>
          <div className="hidden md:block md:visible invisible">
            <MenuNav />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLogouting && (
        <div className="h-screen w-screen justify-center items-center flex flex-col fixed top-0 left-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Logging out...
            </p>
          </div>
        </div>
      )}
      <div className="container w-full py-4 flex items-center md:gap-1 bg-transparent xl:px-6 lg:px-4 md:px-3 px-4 mx-auto">
        <div className="flex items-center lg:gap-12 md:gap-8 sm:gap-6 gap-2 flex-1">
          <Link
            className="w-32 h-10 lg:block hidden transition-all duration-300 hover:scale-105"
            href="/"
          >
            <Image
              alt="LOGO"
              src={
                setting.theme === "dark"
                  ? system_settings?.logoLight || LOGOAPP
                  : system_settings?.logoDark || LOGOWHITE
              }
              priority
              width={142}
              height={58}
              className="w-full h-full object-contain"
            />
          </Link>
          <div className="lg:hidden lg:invisible flex items-center justify-center visible">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <FaBars
                    size={20}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 bg-white dark:bg-gray-900 text-black dark:text-white border-r border-gray-200 dark:border-gray-700"
              >
                <SheetHeader className="pb-6">
                  <SheetTitle asChild>
                    <Link className="w-24 h-8 block" href="/">
                      <Image
                        alt="LOGO"
                        src={
                          setting.theme === "dark"
                            ? system_settings?.logoLight || LOGOWHITE
                            : system_settings?.logoDark || LOGOAPP
                        }
                        priority
                        width={142}
                        height={58}
                        className="w-full h-full object-contain"
                      />
                    </Link>
                  </SheetTitle>
                  <SheetDescription />
                </SheetHeader>
                <MenuNavMobile />
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-10 flex-1">
            <div className="hidden lg:block">
              <MenuNav />
            </div>
            <Suspense
              fallback={
                <div className="w-full max-w-2xl">
                  <div className="relative">
                    <div className="w-full h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              }
            >
              <SearchComponent />
            </Suspense>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 relative group"
            onClick={() => {
              if (!auth.isLogin) {
                window.location.href = `/auth/login?next=${encodeURIComponent(
                  "/profile/wishlists"
                )}`;
                return;
              }
              router.push("/profile/wishlists");
            }}
          >
            <IoIosHeartEmpty className="lg:text-2xl text-xl text-gray-600 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
          </button>

          <MiniCart />

          {auth.isLogin ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 rounded-full transition-all duration-200">
                <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary/20 transition-all duration-200">
                  {auth.avatar && (
                    <AvatarImage
                      src={auth.avatar}
                      alt="avatar"
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-semibold">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 p-2" align="end">
                <DropdownMenuLabel className="font-semibold text-gray-700 dark:text-gray-200">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    router.replace("/profile");
                  }}
                  className="cursor-pointer rounded-md px-3 py-2 hover:bg-primary/5 transition-colors"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400 cursor-pointer rounded-md px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
              href="/auth/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderClient;
