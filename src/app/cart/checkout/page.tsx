"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import ButtonLoading from "@/components/ButtonLoading";
import DialogCheckoutSuccess from "@/components/dialog/DialogCheckoutSuccess";
import DialogConfirm from "@/components/dialog/DialogConfirm";
import { TransactionSteps } from "@/components/TransactionSteps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartModel } from "@/models/cartModel";
import { syncCart } from "@/redux/reducer/cartReducer";
import { RootState } from "@/redux/store";
import { VND } from "@/utils/formatCurrency";
import { get, patch, post } from "@/utils/requets";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import TableOverview from "@/components/checkout/TableOverview";
import TagEndTime from "@/components/checkout/TagEndTime";

interface ITransaction {
  _id: string;
  user_id: string;
  cart_items: string[];
  transaction_info: {
    address: Record<string, any>;
    payment: {
      method: string;
      status: "pending" | "completed" | "canceled";
    };
  };
  current_step: number;
  status: string;
  expireAt: string;
  createdAt: string;
  updatedAt: string;
  cart_items_info?: CartModel[];
}

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
  const [informationOrder, setInformationOrder] = useState<any>();
  const [isPosting, setIsPosting] = useState(false);
  const [openDialogSuccess, setOpenDialogSuccess] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [endTimeTransaction, setEndTimeTransaction] = useState<Date>();
  const [transactionExist, setTransactionExist] = useState<ITransaction>();
  const [loaded, setLoaded] = useState(false);

  const cart = useSelector((state: RootState) => state.cart.cart);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoaded(true);
    handleCheckExistTransaction();
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentStep]);

  useEffect(() => {
    if (cart) {
      if (cart.cartsCheckout && cart.cartsCheckout.length > 0) {
        setCartCheckout(cart.cartsCheckout);
      } else {
        const cartCheckout = localStorage.getItem("cart_checkout");
        if (cartCheckout) {
          const parsedCart = JSON.parse(cartCheckout) as CartModel[];
          if (parsedCart && parsedCart.length > 0) {
            setCartCheckout(parsedCart);
          } else {
            setCartCheckout([]);
          }
        }
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
    if (!informationOrder) {
      return;
    }

    //maybe dont need beause we have transaction of user

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
          slug: item.slug,
        };
      });

      const shippingAddress = {
        name: informationOrder.address.name,
        phone: informationOrder.address.phone,
        address: `${informationOrder.address.houseNo}, ${informationOrder.address.ward.title}, ${informationOrder.address.district.title}, ${informationOrder.address.city.title}`,
      };
      const paymentMethod = informationOrder.payment.method;

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
      await patch("/transaction/change?action=complete", {});

      dispatch(
        syncCart({
          cart_id: cart.cart_id,
          carts: newCart,
          cartCheckout: cartCheckout,
        })
      );
      localStorage.removeItem("cart_checkout");
      localStorage.removeItem("transaction");
      toast.success("Your order has been placed successfully!");
      setEndTimeTransaction(undefined);
      setOpenDialogSuccess(true);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsPosting(false);
    }
  };

  const handleToProceed = async () => {
    try {
      setIsLoading(true);
      const response = await post("/transaction/start", {
        cart_items: cartCheckout.map((item) => item.cartItem_id),
        transaction_info: null,
        current_step: 1,
      });
      setIsProceed(true);
      setCurrentStep("1");
      toast.warning(response.message, {
        description: "Please complete your order within 10 minutes.",
      });
      setEndTimeTransaction(new Date(new Date().getTime() + 1000 * 60 * 10));
      localStorage.setItem("transaction", JSON.stringify(response.data));
      setInformationOrder({});
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTransaction = async () => {
    try {
      setIsLoading(true);
      const api = `/transaction/change?action=cancel`;
      const response = await patch(api, {});
      setIsProceed(false);
      setCurrentStep("0");
      setInformationOrder({});
      setEndTimeTransaction(undefined);
      localStorage.removeItem("transaction");
      toast.success(response.message, {
        description: "Your transaction has been cancelled",
      });
      if (transactionExist) {
        setTransactionExist(undefined);
      }
      console.log(response);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoading = () => {
    return (
      <div className="z-99 bg-black/30 fixed inset-0 top-0 left-0 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin border-white/80 dark:border-neutral-300 w-12 h-12 border-b-2 rounded-full"></div>
        <p className="text-white/80 dark:text-gray-400">Loading...</p>
      </div>
    );
  };

  const handleCheckExistTransaction = () => {
    const transaction = sessionStorage.getItem("transaction");
    const toast_transaction_exists = sessionStorage.getItem(
      "toast_transaction_exists"
    );
    if (toast_transaction_exists) {
      toast.warning("You have an existing transaction.", {
        description: "Please complete or cancel it before starting a new one.",
        duration: 5000,
      });
      sessionStorage.removeItem("toast_transaction_exists");
    }
    if (transaction) {
      const parsedTransaction = JSON.parse(transaction) as ITransaction;
      if (parsedTransaction && parsedTransaction._id) {
        setTransactionExist(parsedTransaction);
        const cart = localStorage.getItem("cart_checkout");
        const parsedCart = cart ? JSON.parse(cart) : [];
        setCartCheckout(parsedCart);
        setIsProceed(true);
        setCurrentStep(parsedTransaction.current_step.toString());
        setEndTimeTransaction(new Date(parsedTransaction.expireAt));
        setInformationOrder(parsedTransaction.transaction_info);
      }
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin dark:border-gray-400 w-12 h-12 mx-auto mb-4 border-b-2 border-gray-900 rounded-full"></div>
          <p className="dark:text-gray-400 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (cartCheckout.length <= 0 && !isProceed && loaded) {
    return (
      <div className="min-h-100 flex items-center justify-center py-12 text-center">
        You are accessing unauthorized{" "}
      </div>
    );
  }

  return (
    <>
      <section className="bg-gray-50 dark:bg-black/90 min-h-screen">
        <TagEndTime
          isProceed={isProceed}
          onCancel={handleCancelTransaction}
          currentEndTime={endTimeTransaction}
        />
        {isLoading && renderLoading()}
        <div className="px-4 py-8 pb-12 mx-auto">
          <div className="mb-8">
            <h1 className="dark:text-white mb-2 text-3xl font-bold text-gray-900">
              Checkout
            </h1>
            <p className="dark:text-gray-400 text-gray-600">
              Review your order and complete your purchase
            </p>
          </div>

          <div className="lg:flex-row flex flex-col gap-8">
            <div className="lg:w-2/3 h-fit relative flex pb-10 overflow-hidden">
              <TableOverview
                cartCheckout={cartCheckout}
                isProceed={isProceed}
              />
              <div
                className={`bg-white pb-10 min-w-full dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-300 transform w-full ${
                  isProceed ? "-translate-x-full" : "translate-x-full"
                }`}
                style={{
                  maxHeight: isProceed ? "1600px" : "0px",
                  pointerEvents: isProceed ? "auto" : "none",
                  opacity: isProceed ? 1 : 0,
                }}
              >
                <div className="h-fit dark:border-gray-700 p-4 border-b border-gray-200">
                  <h2 className="dark:text-white text-lg font-semibold text-gray-900">
                    Checkout Information
                  </h2>
                </div>
                <div className="h-fit px-4 mt-8">
                  <TransactionSteps
                    transactionExists={transactionExist || undefined}
                    onNextStep={async (step, val) => {
                      setCurrentStep(step);
                      setInformationOrder({ ...informationOrder, ...val });
                    }}
                    cartsCheckout={cartCheckout}
                    isProceed={isProceed}
                    setIsLoading={setIsLoading}
                  />
                </div>
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="dark:bg-gray-800 top-30 sticky bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="dark:text-white mb-6 text-lg font-semibold text-gray-900">
                    Order Summary
                  </h2>

                  <div className="mb-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="dark:text-gray-400 text-gray-600">
                        Subtotal
                      </span>
                      <span className="dark:text-white font-medium text-gray-900">
                        {VND.format(subTotal)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="dark:text-gray-400 text-gray-600">
                        Shipping
                      </span>
                      <span className="dark:text-white font-medium text-gray-900">
                        Free
                      </span>
                    </div>
                  </div>

                  <div className="dark:border-gray-700 pt-6 mb-6 border-t border-gray-200">
                    <h3 className="dark:text-white mb-3 text-sm font-medium text-gray-900">
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
                      <p className="mt-2 text-sm text-red-500">{errorCode}</p>
                    )}

                    {discount?.title && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 mt-3 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="dark:text-green-400 text-sm font-medium text-green-800">
                              {discount.title}
                            </p>
                            <p className="dark:text-green-500 text-sm text-green-600">
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
                            className="hover:text-green-700 h-auto p-1 text-green-600"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="dark:border-gray-700 pt-6 mb-6 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="dark:text-white text-lg font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="dark:text-white text-lg font-semibold text-gray-900">
                        {VND.format(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentStep === "3" ? (
                      <ButtonLoading
                        onClick={handleSubmitOrder}
                        loading={isPosting}
                        className="w-full py-6 font-medium"
                      >
                        Place Order
                      </ButtonLoading>
                    ) : (
                      !isProceed && (
                        <>
                          <Button
                            onClick={() => {
                              handleToProceed();
                            }}
                            disabled={cartCheckout.length <= 0 || isLoading}
                            className="w-full py-6 font-medium"
                          >
                            Proceed to Checkout
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              router.replace("/cart");
                              localStorage.removeItem("cart_checkout");
                            }}
                            className="dark:text-white/80 w-full py-6 border-gray-300"
                          >
                            Back to Cart
                          </Button>
                        </>
                      )
                    )}
                    {isProceed && (
                      <DialogConfirm
                        onConfirm={() => {
                          handleCancelTransaction();
                        }}
                        description="Are you sure? Your progress will be lost."
                      >
                        <Button
                          variant="outline"
                          className="dark:text-white/80 w-full py-6 border-gray-300"
                          disabled={isLoading}
                        >
                          Cancel Checkout
                        </Button>
                      </DialogConfirm>
                    )}
                  </div>

                  <div className="dark:border-gray-700 pt-6 mt-6 border-t border-gray-200">
                    <div className="dark:text-gray-400 flex items-center justify-center gap-4 text-xs text-gray-500">
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
