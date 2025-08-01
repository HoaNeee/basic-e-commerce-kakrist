/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import LOGOAPP from "@/assets/logo.png";
import { MenuNav } from "./MenuNav";
import { FaBars } from "react-icons/fa6";
import Link from "next/link";
import { IoIosHeartEmpty } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addAuth, removeAuth } from "@/redux/reducer/authReducer";
import { fetcher, get, post } from "@/utils/requets";
import { removeCart, syncCart } from "@/redux/reducer/cartReducer";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { removeList, syncList } from "@/redux/reducer/favoriteReducer";
import useSWR from "swr";
import LOGOWHITE from "../../assets/logo-white.png";
import { socket } from "@/socket/socket";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import MenuNavMobile from "./MenuNavMobile";
import SearchComponent from "./SearchComponent";
import MiniCart from "./MiniCart";

const routePrivate = ["/profile", "/cart"];

const Header = () => {
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

  if (isLoading) {
    if (pathName.startsWith("/auth") || pathName.startsWith("/error")) {
      return <></>;
    }
    return (
      <div className="flex items-center justify-center w-full z-40 sticky top-0 bg-white drop-shadow-md h-22 dark:bg-black">
        <div className="container w-full py-5 flex justify-between items-center bg-white xl:px-4 md:px-0 px-2 dark:bg-black"></div>
      </div>
    );
  }

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

  return (
    !pathName.startsWith("/auth") &&
    !pathName.startsWith("/error") && (
      <>
        <header className="flex items-center justify-center w-full z-40 sticky top-0 bg-white dark:bg-black dark:text-white/80 drop-shadow-md">
          {isLogouting && (
            <div className="h-screen w-screen justify-center items-center flex flex-col fixed top-0 left-0 z-50 bg-black/20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/80 mx-auto mb-4"></div>
              <p className="text-white/80">Loading...</p>
            </div>
          )}
          <div className="container w-full py-5 flex items-center gap-4 bg-white dark:bg-black dark:text-white/80 xl:px-4 md:px-0 px-2">
            <div className="flex items-center md:gap-10 gap-4 flex-1">
              <Link className="w-30 h-12 md:block hidden" href="/">
                <Image
                  alt="LOGO"
                  src={setting.theme === "dark" ? LOGOWHITE : LOGOAPP}
                  priority
                  className="w-full h-full"
                />
              </Link>
              <div className="md:hidden md:invisible flex items-center justify-center">
                <Sheet>
                  <SheetTrigger>
                    <FaBars size={20} />
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-2/3 bg-white dark:bg-black text-black dark:text-white/80"
                  >
                    <SheetHeader>
                      <SheetTitle asChild>
                        <Link className="w-20 h-9 block" href="/">
                          <Image
                            alt="LOGO"
                            src={setting.theme === "dark" ? LOGOWHITE : LOGOAPP}
                            priority
                            className="w-full h-full"
                          />
                        </Link>
                      </SheetTitle>
                      <SheetDescription />
                    </SheetHeader>

                    <MenuNavMobile />
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex items-center gap-8 flex-1">
                <div className="hidden md:block md:visible invisible">
                  <MenuNav />
                </div>
                <Suspense fallback={<></>}>
                  <SearchComponent />
                </Suspense>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <IoIosHeartEmpty
                className="lg:text-2xl text-xl cursor-pointer"
                onClick={() => {
                  if (!auth.isLogin) {
                    window.location.href = `/auth/login?next=${encodeURIComponent(
                      "/profile/wishlists"
                    )}`;
                    return;
                  }
                  router.push("/profile/wishlists");
                }}
              />

              {/* mini cart */}
              <MiniCart />
              {auth.isLogin ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none focus:ring-[2px] focus:ring-offset-2 focus:ring-primary rounded-full">
                      <Avatar className="h-9 w-9">
                        {auth.avatar && (
                          <AvatarImage src={auth.avatar} alt="avatar" />
                        )}
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          router.replace("/profile");
                        }}
                        className="cursor-pointer"
                      >
                        <User className="h-4 w-4" /> Profile
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-destructive group"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 text-destructive" />{" "}
                        <span className="group-hover:text-destructive text-destructive">
                          Logout
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div>
                  <a
                    className="inline-block py-2 px-4 rounded-md text-sm font-medium text-white bg-black hover:bg-neutral-800 transition-colors"
                    href="/auth/login"
                  >
                    Login
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>
      </>
    )
  );
};

export default Header;
