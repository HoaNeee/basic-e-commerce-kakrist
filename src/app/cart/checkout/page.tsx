/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import ButtonLoading from "@/components/ButtonLoading";
import DialogCheckoutSuccess from "@/components/dialog/DialogCheckoutSuccess";
import DialogConfirm from "@/components/dialog/DialogConfirm";
import { TransactionSteps } from "@/components/TransactionSteps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
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
  }, [cart]);

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
    if (discount?.value && subTotal) {
      if (discount.type === "percent") {
        const dis = subTotal * (discount.value / 100);
        setGrandTotal(Math.max(subTotal - dis, 0));
      } else {
        setGrandTotal(Math.max(subTotal - discount.value, 0));
      }
    }
  }, [discount, subTotal]);

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
      <section className="min-h-screen bg-gray-50 dark:bg-black/90">
        <div className="mx-auto px-4 py-8 pb-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Checkout
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review your order and complete your purchase
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 relative pb-10 h-fit flex overflow-hidden">
              <div
                className={`bg-white min-w-full dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-300 transform ${
                  !isProceed ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{
                  maxHeight: !isProceed ? "1500px" : "0px",
                  pointerEvents: !isProceed ? "auto" : "none",
                  opacity: !isProceed ? 1 : 0,
                }}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Review
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {cartCheckout.length} item
                    {cartCheckout.length !== 1 ? "s" : ""} in your order
                  </p>
                </div>

                <div className={`overflow-x-auto p-2 transform`}>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200 dark:border-gray-700">
                        <TableHead className="text-gray-600 dark:text-gray-400">
                          Product
                        </TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400">
                          Price
                        </TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400">
                          Qty
                        </TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400 text-right">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartCheckout.map((item) => (
                        <TableRow
                          key={item.cartItem_id}
                          className="border-gray-200 dark:border-gray-700 my-1"
                        >
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={item.thumbnail || item.thumbnail_product}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                                  {item.title}
                                </h3>
                                {item.productType === "variations" &&
                                  item.options_info && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      {item.options_info
                                        .map((opt) => opt.title)
                                        .join(", ")}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-white font-medium">
                            {VND.format(item.discountedPrice ?? item.price)}
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-white">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right text-gray-900 dark:text-white font-medium">
                            {VND.format(
                              item.quantity *
                                (item.discountedPrice ?? item.price)
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div
                className={`bg-white pb-10 min-w-full dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-300 transform w-full ${
                  isProceed ? "-translate-x-full" : "translate-x-full"
                }`}
                style={{
                  maxHeight: isProceed ? "1500px" : "0px",
                  pointerEvents: isProceed ? "auto" : "none",
                  opacity: isProceed ? 1 : 0,
                }}
              >
                <div className="p-4 border-b h-fit border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Checkout Information
                  </h2>
                </div>
                <div className="px-4 mt-8 h-fit">
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
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm sticky top-30">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Order Summary
                  </h2>

                  {/* Subtotal */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {VND.format(subTotal)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Shipping
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        Free
                      </span>
                    </div>
                  </div>

                  {/* Discount Code */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Discount Code
                    </h3>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter code"
                        value={CODE}
                        onChange={(e) => {
                          if (errorCode) setErrorCode("");
                          setCODE(e.target.value.toUpperCase());
                        }}
                        className="flex-1 px-3 py-5"
                      />
                      <Button
                        onClick={handleCheckCode}
                        disabled={!CODE}
                        size="sm"
                        className="py-5"
                      >
                        Apply
                      </Button>
                    </div>

                    {errorCode && (
                      <p className="text-red-500 text-sm mt-2">{errorCode}</p>
                    )}

                    {discount?.title && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-800 dark:text-green-400">
                              {discount.title}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-500">
                              -
                              {VND.format(
                                discount.type === "percent"
                                  ? subTotal * (discount.value / 100)
                                  : discount.value
                              )}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDiscount(undefined);
                              setGrandTotal(subTotal);
                              setCODE("");
                            }}
                            className="text-green-600 hover:text-green-700 p-1 h-auto"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {VND.format(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {currentStep === "3" ? (
                      <ButtonLoading
                        onClick={handleSubmitOrder}
                        loading={isPosting}
                        className="w-full py-6 font-medium"
                      >
                        Place Order
                      </ButtonLoading>
                    ) : !isProceed ? (
                      <>
                        <Button
                          onClick={() => setIsProceed(true)}
                          disabled={cartCheckout.length <= 0}
                          className="w-full py-6 font-medium"
                        >
                          Proceed to Checkout
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => router.back()}
                          className="w-full border-gray-300 py-6 dark:text-white/80"
                        >
                          Back to Cart
                        </Button>
                      </>
                    ) : (
                      <DialogConfirm
                        onConfirm={() => {
                          setIsProceed(false);
                          setCurrentStep(undefined);
                        }}
                        description="Are you sure? Your progress will be lost."
                      >
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 py-6 dark:text-white/80"
                        >
                          Back to Review
                        </Button>
                      </DialogConfirm>
                    )}
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Secure SSL</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Money Back</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Fast Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
