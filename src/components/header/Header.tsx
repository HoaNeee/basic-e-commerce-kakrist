/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import LOGOAPP from "@/assets/logo.png";
import { MenuNav } from "./MenuNav";
import { LuSearch } from "react-icons/lu";
import { FaBars } from "react-icons/fa6";
import Link from "next/link";
import { IoIosHeartEmpty } from "react-icons/io";
import { PiShoppingBag } from "react-icons/pi";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addAuth, removeAuth } from "@/redux/reducer/authReducer";
import { del, fetcher, get, post } from "@/utils/requets";
import {
  removeCart,
  removeCartItem,
  syncCart,
} from "@/redux/reducer/cartReducer";
import { Badge } from "../ui/badge";

import { GoTrash } from "react-icons/go";
import { VND } from "@/utils/formatCurrency";
import { ScrollArea } from "../ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import DialogConfirm from "../dialog/DialogConfirm";
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
import { PopoverClose } from "@radix-ui/react-popover";
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

const Header = () => {
  const [openPopoverCart, setOpenPopoverCart] = useState(false);

  const auth = useSelector((state: RootState) => state.auth.auth);
  const cart = useSelector((state: RootState) => state.cart.cart);
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

    if (data && data.code === 200) {
      console.log(data);
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
      dispatch(syncList(list));
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    if (pathName.startsWith("/auth")) {
      return <></>;
    }
    return (
      <div className="flex items-center justify-center w-full z-40 sticky top-0 bg-white drop-shadow-md h-22 dark:bg-black">
        <div className="container w-full py-5 flex justify-between items-center bg-white xl:px-4 md:px-0 px-2 dark:bg-black"></div>
      </div>
    );
  }

  return (
    !pathName.startsWith("/auth") && (
      <>
        <div className="flex items-center justify-center w-full z-40 sticky top-0 bg-white dark:bg-black dark:text-white/80 drop-shadow-md">
          <div className="container w-full py-5 flex justify-between items-center bg-white dark:bg-black dark:text-white/80 xl:px-4 md:px-0 px-2">
            <div>
              <Link className="w-30 h-12 md:block hidden" href="/">
                <Image
                  alt="LOGO"
                  src={setting.theme === "dark" ? LOGOWHITE : LOGOAPP}
                  priority
                  className="w-full h-full"
                />
              </Link>
              <div className="md:hidden">
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
            </div>
            <div className="hidden md:block">
              <MenuNav />
            </div>
            <div className="flex gap-4 items-center">
              <LuSearch className="lg:text-2xl text-xl" onClick={() => {}} />
              <IoIosHeartEmpty
                className="lg:text-2xl text-xl cursor-pointer"
                onClick={() => {
                  router.push("/profile/wishlists");
                }}
              />
              <div className="relative">
                {!pathName.includes("/cart") ? (
                  <Popover
                    open={openPopoverCart}
                    onOpenChange={setOpenPopoverCart}
                    modal
                  >
                    <PopoverTrigger asChild>
                      <PiShoppingBag
                        className="lg:text-2xl text-xl cursor-pointer"
                        title="open mini cart"
                      />
                    </PopoverTrigger>

                    <PopoverContent
                      sideOffset={10}
                      className="bg-white dark:bg-black dark:text-white/80 sm:w-[340px] w-[280px] p-0 py-3 absolute sm:-left-64 -left-60 min-h-40 text-sm shadow-2xl z-41"
                    >
                      {auth.isLogin ? (
                        <>
                          <p className="pt-2 px-4">
                            You have{" "}
                            {cart.carts.reduce(
                              (value, item) => value + item.quantity,
                              0
                            )}{" "}
                            items in your cart
                          </p>
                          <ScrollArea
                            className={`${
                              cart.carts && cart.carts?.length > 0 ? "h-80" : ""
                            } w-full`}
                          >
                            <div className="mt-6 flex flex-col gap-4 px-4">
                              {cart && cart.carts?.length > 0 ? (
                                cart.carts.map((item, index) => (
                                  <div
                                    key={index}
                                    className="w-full h-full relative flex gap-4 items-center pb-4 border-b-2 border-muted"
                                  >
                                    <div className="w-17 h-17 object-cover bg-[#F1F1F3]">
                                      <img
                                        src={
                                          item.thumbnail
                                            ? item.thumbnail
                                            : item.thumbnail_product
                                        }
                                        alt="image"
                                        className="w-full h-full object-cover rounded-xs"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1 items-start justify-self-start">
                                      <p className="text-ellipsis line-clamp-1">
                                        {item.title}
                                      </p>
                                      <p className="font-bold text-base">
                                        {item.quantity} x{" "}
                                        {item.discountedPrice !== null &&
                                        item.discountedPrice !== undefined
                                          ? VND.format(item.discountedPrice)
                                          : VND.format(item.price)}
                                      </p>
                                      {item.productType === "variations" ? (
                                        <p>
                                          Options:{" "}
                                          {item.options_info
                                            ?.map((it) => it.title)
                                            .join(", ")}
                                        </p>
                                      ) : (
                                        <div className="h-2"></div>
                                      )}
                                    </div>
                                    <div className="absolute bottom-4 right-0">
                                      <DialogConfirm
                                        onConfirm={async () => {
                                          try {
                                            await del(
                                              "/cart/delete",
                                              item.cartItem_id || ""
                                            );
                                            toast.success("Success", {
                                              description:
                                                "This item was be remove",
                                              action: {
                                                label: "Close",
                                                onClick: () => {},
                                              },
                                              duration: 1000,
                                            });
                                            dispatch(
                                              removeCartItem(item.cartItem_id)
                                            );
                                          } catch (error: any) {
                                            toast.error(error.message);
                                          }
                                        }}
                                      >
                                        <GoTrash
                                          size={18}
                                          color="red"
                                          className="cursor-pointer"
                                          title="remove this item"
                                          onClick={() => {}}
                                        />
                                      </DialogConfirm>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="">
                                  Cart is empty.{" "}
                                  <Link
                                    href={"/shop"}
                                    className="underline hover:text-blue-400"
                                  >
                                    Shop now
                                  </Link>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                          <div className="mt-6 px-4">
                            <div className="flex justify-between items-center text-base font-bold">
                              <p>Subtotal</p>
                              <p>
                                {VND.format(
                                  cart?.carts.reduce(
                                    (val, item) =>
                                      val +
                                      item.quantity *
                                        (item.discountedPrice !== undefined &&
                                        item.discountedPrice !== null
                                          ? item.discountedPrice
                                          : item.price),
                                    0
                                  )
                                )}
                              </p>
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                              <PopoverClose asChild>
                                <Button
                                  variant={"outline"}
                                  className="py-6"
                                  onClick={() => {
                                    router.push("/cart");
                                    setOpenPopoverCart(false);
                                  }}
                                >
                                  View Cart
                                </Button>
                              </PopoverClose>
                              <PopoverClose asChild>
                                <Button
                                  className="py-6"
                                  onClick={() => {
                                    router.push("/cart/checkout");
                                  }}
                                  disabled={cart.carts.length <= 0}
                                >
                                  Checkout
                                </Button>
                              </PopoverClose>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="px-4 flex w-full h-40 items-center justify-center">
                          <div className="text-muted-foreground text-base">
                            Please{" "}
                            <Link
                              href={`/auth/login?next=${encodeURIComponent(
                                "/cart"
                              )}`}
                              className="italic underline text-blue-400"
                            >
                              login
                            </Link>{" "}
                            to view your cart.
                          </div>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                ) : (
                  <PiShoppingBag
                    className="lg:text-2xl text-xl cursor-pointer"
                    title="open mini cart"
                  />
                )}
                {cart && cart?.carts?.length > 0 && (
                  <Badge
                    className="absolute lg:-top-1.5 text-[10px] p-0 px-1 lg:-right-1 -right-1.5 -top-2"
                    variant={"destructive"}
                  >
                    {cart.carts.reduce(
                      (value, item) => value + item.quantity,
                      0
                    )}
                  </Badge>
                )}
              </div>
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
                        className="text-destructive"
                        onClick={async () => {
                          try {
                            const response = await post("/auth/logout", {});
                            toast.success(response.message, {
                              duration: 1000,
                            });
                            dispatch(removeAuth());
                            dispatch(removeCart([]));
                            dispatch(removeList([]));
                          } catch (error: any) {
                            toast.error(error.message);
                          }
                        }}
                      >
                        <LogOut className="h-4 w-4 text-destructive" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link href={"/auth/login"}>
                  <Button variant={"default"}>Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {openPopoverCart && (
          <div className="fixed w-full h-full top-0 bg-black opacity-20 z-40" />
        )}
      </>
    )
  );
};

export default Header;
