/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { RootState } from "@/redux/store";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { PiShoppingBag } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "../ui/scroll-area";
import { VND } from "@/utils/formatCurrency";
import DialogConfirm from "../dialog/DialogConfirm";
import { del } from "@/utils/requets";
import { toast } from "sonner";
import { removeCartItem } from "@/redux/reducer/cartReducer";
import { GoTrash } from "react-icons/go";
import Link from "next/link";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";

const MiniCart = () => {
  const [openPopoverCart, setOpenPopoverCart] = useState(false);
  const auth = useSelector((state: RootState) => state.auth.auth);
  const cart = useSelector((state: RootState) => state.cart.cart);

  const pathName = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <>
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
              className="bg-white dark:bg-black dark:text-white/80 sm:w-[340px] w-[280px] p-0 py-3 absolute sm:-left-64 -left-60 min-h-40 rounded-sm text-sm shadow-2xl z-41"
            >
              {auth.isLogin ? (
                <>
                  <p className="pt-2 px-4">
                    You have{" "}
                    {cart?.carts?.reduce(
                      (value, item) => value + item.quantity,
                      0
                    )}{" "}
                    items in your cart
                  </p>
                  <ScrollArea
                    className={`${
                      cart?.carts && cart.carts?.length > 0 ? "h-80" : ""
                    } w-full`}
                  >
                    <div className="mt-6 flex flex-col gap-4 px-4">
                      {cart && cart?.carts?.length > 0 ? (
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
                              <Link
                                href={`/shop/${item.slug}`}
                                className="text-ellipsis line-clamp-1 transition-all hover:text-blue-500"
                                onClick={() => setOpenPopoverCart(false)}
                              >
                                {item.title}
                              </Link>
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
                                      description: "This item was be remove",
                                      action: {
                                        label: "Close",
                                        onClick: () => {},
                                      },
                                      duration: 1000,
                                    });
                                    dispatch(removeCartItem(item.cartItem_id));
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
                          <PopoverClose asChild>
                            <Link
                              href="/shop"
                              className="text-blue-500 underline"
                            >
                              Go to shop
                            </Link>
                          </PopoverClose>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="mt-6 px-4">
                    <div className="flex justify-between items-center text-base font-bold">
                      <p>Subtotal</p>
                      <p>
                        {VND.format(
                          cart?.carts?.reduce(
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
                            localStorage.setItem(
                              "cart_checkout",
                              JSON.stringify(cart)
                            );
                            router.push("/cart/checkout");
                          }}
                          disabled={cart?.carts?.length <= 0}
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
                    <PopoverClose>
                      <a
                        href={`/auth/login?next=${encodeURIComponent("/cart")}`}
                        onClick={() => {
                          setOpenPopoverCart(false);
                        }}
                        className="italic underline text-blue-400"
                      >
                        login
                      </a>
                    </PopoverClose>{" "}
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
          <div className="absolute h-3.5 w-3.5 md:h-4 md:w-4.5 lg:-top-1.5 text-[10px] p-0 px-1 lg:-right-1 -right-2 -top-2 flex items-center justify-center bg-red-500 text-white rounded-full font-bold">
            <span className="transition-all duration-300 ease-in-out transform translate-y-[1px]">
              {cart?.carts?.reduce((value, item) => value + item.quantity, 0)}
            </span>
          </div>
        )}
      </div>{" "}
      {openPopoverCart && (
        <div className="fixed w-screen h-screen left-0 top-0 bg-black opacity-20 z-40" />
      )}
    </>
  );
};

export default MiniCart;
