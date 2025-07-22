/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import ButtonLoading from "@/components/ButtonLoading";
import DialogCheckoutSuccess from "@/components/dialog/DialogCheckoutSuccess";
import DialogConfirm from "@/components/dialog/DialogConfirm";
import HeadContent from "@/components/HeadContent";
import { TransactionSteps } from "@/components/TransactionSteps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CartModel } from "@/models/cartModel";
import { syncCart } from "@/redux/reducer/cartReducer";
import { RootState } from "@/redux/store";
import { VND } from "@/utils/formatCurrency";
import { get, post } from "@/utils/requets";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Checkout = () => {
  const [cartCheckout, setCartCheckout] = useState<CartModel[]>([]);
  const [CODE, setCODE] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [discount, setDiscount] = useState<{
    value: number;
    type: string;
    title: string;
  }>();
  const [grandTotal, setGrandTotal] = useState(0);
  const [isProceed, setIsProceed] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>();
  const [infomationOrder, setInfomationOrder] = useState<any>();
  const [isPosting, setIsPosting] = useState(false);
  const [openDialogSuccess, setOpenDialogSuccess] = useState(false);
  const [subTotal, setSubTotal] = useState(0);

  const cart = useSelector((state: RootState) => state.cart.cart);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (cart) {
      if (cart.cartsCheckout && cart.cartsCheckout.length > 0) {
        setCartCheckout(cart.cartsCheckout);
      } else {
        setCartCheckout(cart.carts);
      }
    }
  }, []);

  useEffect(() => {
    if (cartCheckout) {
      const total = cartCheckout.reduce(
        (val, item) =>
          val +
          item.quantity *
            (item.discountedPrice !== undefined && item.discountedPrice !== null
              ? item.discountedPrice
              : item.price),
        0
      );
      setSubTotal(total);
      setGrandTotal(total);
    }
  }, [cartCheckout]);

  useEffect(() => {
    if (discount?.value) {
      if (discount.type === "percent") {
        const dis = subTotal * (discount.value / 100);
        setGrandTotal(Math.max(subTotal - dis, 0));
      } else {
        setGrandTotal(Math.max(subTotal - discount.value, 0));
      }
    }
  }, [discount]);

  const renderTableCell = (item: CartModel) => {
    return (
      <TableRow key={item.cartItem_id}>
        <TableCell>
          <div className="flex items-center gap-3 py-2 dark:text-white/80">
            <div className="w-16 h-16 bg-[#f1f1f3] dark:bg-neutral-700">
              <img
                src={item.thumbnail ? item.thumbnail : item.thumbnail_product}
                alt={item.title}
                className="w-full h-full object-cover rounded-xs"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <p className="font-bold text-ellipsis line-clamp-1">
                {item.title}
              </p>
              {item.productType === "variations" ? (
                <p>
                  Options: {item.options_info?.map((it) => it.title).join(", ")}
                </p>
              ) : (
                <>-</>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell>
          {item.discountedPrice !== null &&
          item.discountedPrice !== undefined ? (
            <div className="lowercase">{VND.format(item.discountedPrice)}</div>
          ) : (
            <div className="lowercase">{VND.format(item.price)}</div>
          )}
        </TableCell>
        <TableCell>{item.quantity}</TableCell>
        <TableCell>
          <div className="font-medium">
            {item.discountedPrice !== undefined && item.discountedPrice !== null
              ? VND.format(item.quantity * item.discountedPrice)
              : VND.format(item.price * item.quantity)}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const handleCheckCode = async () => {
    const code = CODE.toUpperCase();
    try {
      const response = await get(`/promotions/check-code?code=${code}`);
      setDiscount({
        value: response.data.value,
        type: response.data.promotionType,
        title: response.data.title,
      });
    } catch (error: any) {
      setErrorCode(error.message);
    }
  };

  const handleSubmitOrder = async () => {
    if (!infomationOrder) {
      return;
    }

    setIsPosting(true);

    try {
      const products = cartCheckout.map((item) => {
        return {
          product_id: item.product_id,
          sub_product_id: item.sub_product_id || null,
          title: item.title,
          thumbnail: item.thumbnail ? item.thumbnail : item.thumbnail_product,
          price:
            item.discountedPrice !== null && item.discountedPrice !== undefined
              ? item.discountedPrice
              : item.price,
          options: item?.options_info?.map((it) => it.title),
          quantity: item.quantity,
          cost: item.cost,
          SKU: item.SKU,
        };
      });

      const shippingAddress = {
        name: infomationOrder.address.name,
        phone: infomationOrder.address.phone,
        address: `${infomationOrder.address.houseNo}, ${infomationOrder.address.ward.title}, ${infomationOrder.address.district.title}, ${infomationOrder.address.city.title}`,
      };
      const paymentMethod = infomationOrder.payment.method;

      const estimatedDelivery = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); //FIX THEN

      const cartItem_ids = cartCheckout.map((item) => item.cartItem_id);

      const payload: any = {
        products,
        shippingAddress,
        paymentMethod,
        cartItem_ids,
        estimatedDelivery: estimatedDelivery.toISOString(),
      };

      if (discount) {
        payload["promotion"] = {
          promotionType: discount.type,
          value: discount.value,
          code: CODE.toUpperCase(),
        };
      }

      await post("/orders/create", payload);
      const newCart = cart.carts.filter((item) => {
        const id = cartItem_ids.find((it) => it === item.cartItem_id);

        return item.cartItem_id !== id;
      });

      dispatch(
        syncCart({
          cart_id: cart.cart_id,
          carts: newCart,
          cartCheckout: cartCheckout,
        })
      );

      setOpenDialogSuccess(true);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0 dark:text-white/80">
        <HeadContent title="Checkout" left={<></>} />
        <div className="w-full h-full flex gap-10 overflow-hidden">
          <div className="w-6/8 relative">
            <div
              className={`transition-all w-full ${
                isProceed ? "duration-300" : "duration-500"
              }`}
              style={{
                transform: isProceed ? "translateX(-200%)" : "translateX(0)",
                maxHeight: !isProceed ? "auto" : "0px",
                visibility: !isProceed ? "visible" : "hidden",
                opacity: !isProceed ? "1" : "0",
                pointerEvents: !isProceed ? "all" : "none",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Products</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartCheckout.map((item) => renderTableCell(item))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div
              className={`w-full ${
                !isProceed ? "duration-300" : "duration-500"
              }`}
              style={{
                transform: isProceed ? "translateY(0)" : "translateY(200%)",
                maxHeight: isProceed ? "2000px" : "0px",
                visibility: isProceed ? "visible" : "hidden",
                opacity: isProceed ? "1" : "0",
                pointerEvents: isProceed ? "all" : "none",
              }}
            >
              <TransactionSteps
                onNextStep={(step, val) => {
                  setCurrentStep(step);
                  setInfomationOrder({ ...infomationOrder, ...val });
                }}
                cartsCheckout={cartCheckout}
                isProceed={isProceed}
              />
            </div>
          </div>

          <div className="flex-1">
            <Card className="py-0 gap-0 rounded-xs transition-all duration-300">
              <CardHeader className="">
                <div className="flex py-4 justify-between items-center font-bold border-b-2 border-muted w-full">
                  <p>Subtotal</p>
                  <p>
                    {VND.format(
                      cartCheckout.reduce(
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
              </CardHeader>
              <CardContent className="transition-all duration-300">
                <div className="border-b-2 border-muted py-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Enter Discount Code: </Label>
                    <div className="flex items-center h-12 w-full relative">
                      <input
                        className="h-full border-2 pl-4 w-9/10 rounded-tl-lg rounded-bl-lg focus-visible:outline-ring uppercase"
                        value={CODE}
                        onChange={(e) => {
                          if (errorCode) {
                            setErrorCode("");
                          }

                          setCODE(e.target.value);
                        }}
                        name="promotionCode"
                      />
                      <div className="bg-white absolute right-0 z-20 overflow-hidden h-full">
                        <Button
                          type="submit"
                          className="h-full rounded-tl-none rounded-bl-none px-7"
                          disabled={!CODE}
                          onClick={handleCheckCode}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="min-h-4 mt-3 text-sm">
                    {errorCode ? (
                      <p className="text-red-500">{errorCode}</p>
                    ) : (
                      discount?.title && (
                        <div className="flex w-full items-center justify-between">
                          <div>
                            <p>{discount.title}</p>

                            {discount.type === "percent" ? (
                              <p>
                                -
                                {VND.format(
                                  grandTotal * (discount.value / 100)
                                )}
                              </p>
                            ) : (
                              <p>-{VND.format(discount.value)}</p>
                            )}
                          </div>
                          <Badge
                            className="cursor-pointer"
                            onClick={() => {
                              setDiscount({
                                title: "",
                                value: 0,
                                type: "",
                              });
                              setGrandTotal(subTotal);
                            }}
                          >
                            Remove
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="py-4 flex flex-col transition-all duration-500 relative">
                <div className="flex justify-between items-center font-bold w-full">
                  <p>Grand Total</p>
                  <p>{VND.format(grandTotal)}</p>
                </div>

                {currentStep === "3" && (
                  <ButtonLoading
                    className="w-full py-6 mt-4"
                    onClick={handleSubmitOrder}
                    loading={isPosting}
                  >
                    Place Order
                  </ButtonLoading>
                )}

                {!isProceed ? (
                  <div className="flex flex-col gap-1.5 w-full">
                    <Button
                      className="w-full py-6 mt-4"
                      onClick={() => setIsProceed(true)}
                      disabled={cartCheckout.length <= 0}
                    >
                      Proceed to Checkout
                    </Button>
                    <Button
                      className="w-full py-6"
                      onClick={() => {
                        router.back();
                      }}
                      variant={"outline"}
                    >
                      Return previous step
                    </Button>
                  </div>
                ) : (
                  <DialogConfirm
                    onConfirm={() => {
                      setIsProceed(false);
                      setCurrentStep(undefined);
                    }}
                    description="Are you sure about that? This change won't be saved!"
                  >
                    <Button className="w-full py-6 mt-4" variant={"outline"}>
                      Cancel proceed
                    </Button>
                  </DialogConfirm>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      <DialogCheckoutSuccess
        open={openDialogSuccess}
        setOpen={setOpenDialogSuccess}
      />
    </>
  );
};

export default Checkout;
