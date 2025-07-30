/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MyAlertDialog from "@/components/dialog/MyAlertDialog";
import { TableCart } from "@/components/TableCart";
import { Button } from "@/components/ui/button";
import { CartModel } from "@/models/cartModel";
import { addCartCheckout } from "@/redux/reducer/cartReducer";
import { RootState } from "@/redux/store";
import { VND } from "@/utils/formatCurrency";
import { get } from "@/utils/requets";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Cart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState<any>({});
  const [dataSelected, setDataSelected] = useState<CartModel[]>([]);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const cart = useSelector((state: RootState) => state.cart.cart);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    checkTransactionExist();
  }, []);

  useEffect(() => {
    if (rowSelection) {
      const items = [];
      for (const key in rowSelection) {
        if (rowSelection[key]) {
          items.push(cart.carts[Number(key)]);
        }
      }
      setDataSelected(items);
    }
  }, [rowSelection, cart.carts]);

  const totalAmount = dataSelected.reduce(
    (val, item) =>
      val +
      item.quantity *
        (item.discountedPrice !== undefined && item.discountedPrice !== null
          ? item.discountedPrice
          : item.price),
    0
  );

  const handleCheckout = () => {
    if (dataSelected && dataSelected.length > 0) {
      localStorage.setItem("cart_checkout", JSON.stringify(dataSelected));
      dispatch(addCartCheckout(dataSelected));
      router.push("/cart/checkout", { scroll: true });
    } else {
      setOpenAlertDialog(true);
    }
  };

  const checkTransactionExist = async () => {
    try {
      setIsLoading(true);
      const response = await get("/transaction/detail");

      if (response && response.data) {
        window.location.href = "/cart/checkout";
        localStorage.setItem("transaction", JSON.stringify(response.data));
        localStorage.setItem(
          "cart_checkout",
          JSON.stringify(response.data.cart_items_info)
        );
        localStorage.setItem("toast_transaction_exists", "true");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-gray-50 dark:bg-black/90 py-8">
        <div className="mx-auto container xl:px-4 px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {cart.carts.length} item{cart.carts.length !== 1 ? "s" : ""} in
              your cart
            </p>
          </div>

          {cart.carts.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.39.39-.39 1.023 0 1.414L6.414 17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add some items to your cart to get started.
              </p>
              <Button
                onClick={() => router.push("/shop")}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="w-full h-full p-2">
                  <TableCart
                    selection={rowSelection}
                    setSelection={setRowSelection}
                  />
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm sticky top-4">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Cart Summary
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Items selected:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {dataSelected.length}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Subtotal:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {VND.format(totalAmount)}
                        </span>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            Total:
                          </span>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {VND.format(totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleCheckout}
                        disabled={dataSelected.length === 0}
                        className="w-full py-6 disabled:cursor-not-allowed"
                      >
                        Go to Checkout ({dataSelected.length} item
                        {dataSelected.length !== 1 ? "s" : ""})
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => router.push("/shop")}
                        className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-6"
                      >
                        Continue Shopping
                      </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Secure checkout</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Free shipping</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <MyAlertDialog open={openAlertDialog} setOpen={setOpenAlertDialog} />
    </>
  );
};

export default Cart;
