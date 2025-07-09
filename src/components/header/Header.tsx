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
import { removeAuth } from "@/redux/reducer/authReducer";
import { del, get, post } from "@/utils/requets";
import {
  removeCart,
  removeCartItem,
  syncCart,
} from "@/redux/reducer/cartReducer";
import { Badge } from "../ui/badge";

import { GoTrash } from "react-icons/go";
import { VND } from "@/utils/formatCurrency";
// import * as Popover from "@radix-ui/react-popover";
import { ScrollArea } from "../ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import DialogConfirm from "../dialog/DialogConfirm";

const Header = () => {
  const [loading, setLoading] = useState(true);
  const [openPopoverCart, setOpenPopoverCart] = useState(false);

  const auth = useSelector((state: RootState) => state.auth.auth);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const pathName = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (auth.isLogin) {
      getCart();
    }
  }, [auth]);

  const getCart = async () => {
    try {
      const response = await get("/cart");
      dispatch(syncCart(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-full z-40 sticky top-0 bg-white">
        <div className="container w-full py-5 flex justify-between items-center bg-white xl:px-4 md:px-0 px-2">
          <div>
            <Link className="w-30 h-12 md:block hidden" href="/">
              <Image
                alt="LOGO"
                src={LOGOAPP}
                priority
                className="w-full h-full"
              />
            </Link>
            <div className="md:hidden block">
              <FaBars size={20} />
            </div>
          </div>
          <div className="hidden md:block">
            <MenuNav />
          </div>
          <div className="flex gap-4 items-center">
            <LuSearch className="lg:text-2xl text-xl" />
            <IoIosHeartEmpty className="lg:text-2xl text-xl" />
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
                    className="bg-white sm:w-[340px] w-[280px] p-0 py-3 absolute sm:-left-64 -left-48 min-h-40 text-sm shadow-2xl z-41"
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
                        <ScrollArea className="h-80 w-full">
                          <div className="mt-6 flex flex-col gap-4 px-4">
                            {cart && cart.carts.length > 0 ? (
                              cart.carts.map((item, index) => (
                                <div
                                  key={index}
                                  className="w-full h-full relative flex gap-4 items-center pb-4 border-b-2 border-muted"
                                >
                                  <div className="w-17 h-17 object-cover bg-[#F1F1F3]">
                                    <img
                                      src={item.thumbnail}
                                      alt="image"
                                      className="w-full h-full"
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
                              <div>Cart is empty!</div>
                            )}
                          </div>
                        </ScrollArea>
                        <div className="mt-6 px-4">
                          <div className="flex justify-between items-center text-base font-bold">
                            <p>Subtotal</p>
                            <p>
                              {VND.format(
                                cart.carts.reduce(
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
                            <Button className="py-6">Checkout</Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="px-4">not login</div>
                    )}
                  </PopoverContent>
                </Popover>
              ) : (
                <PiShoppingBag
                  className="lg:text-2xl text-xl cursor-pointer"
                  title="open mini cart"
                />
              )}
              {cart && cart.carts.length > 0 && (
                <Badge
                  className="absolute lg:-top-1.5 text-[10px] p-0 px-1 lg:-right-1 -right-1.5 -top-2"
                  variant={"destructive"}
                >
                  {cart.carts.reduce((value, item) => value + item.quantity, 0)}
                </Badge>
              )}
            </div>
            {auth.isLogin ? (
              <>
                <Button
                  variant={"default"}
                  onClick={async () => {
                    dispatch(removeAuth());
                    dispatch(removeCart([]));
                    await post("/auth/logout", {});
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              !loading && (
                <Link href={"/auth/login"}>
                  <Button variant={"default"}>Login</Button>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
      {openPopoverCart && (
        <div className="fixed w-full h-full top-0 bg-black opacity-20 z-40" />
      )}
    </>
  );
};

export default Header;
