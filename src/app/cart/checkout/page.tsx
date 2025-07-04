/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

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
import { RootState } from "@/redux/store";
import { VND } from "@/utils/formatCurrency";
import { get } from "@/utils/requets";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Checkout = () => {
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [cartCheckout, setCartCheckout] = useState<CartModel[]>([]);
  const [CODE, setCODE] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [discount, setDiscount] = useState<{
    value: number;
    type: string;
    title: string;
  }>();
  const [grandTotal, setGrandTotal] = useState(0);
  const [isProceed, setIsProceed] = useState(true);

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
      setGrandTotal(total);
    }
  }, [cartCheckout]);

  useEffect(() => {
    if (discount?.value) {
      if (discount.type === "percent") {
        const dis = grandTotal * (discount.value / 100);

        setGrandTotal(Math.max(grandTotal - dis, 0));
      } else {
        setGrandTotal(Math.max(grandTotal - discount.value, 0));
      }
    }
  }, [discount]);

  const renderTableCell = (item: CartModel) => {
    return (
      <TableRow key={item.cartItem_id}>
        <TableCell>
          <div className="flex items-center gap-3 py-2">
            <div className="w-16 h-16 bg-[#f1f1f3]">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-contain"
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

  return (
    <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
      <HeadContent title="Checkout" left={<></>} />
      <div className="w-full h-full flex gap-10">
        <div className="w-6/8">
          {!isProceed ? (
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
          ) : (
            <div>
              <TransactionSteps />
            </div>
          )}
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
                              -{VND.format(grandTotal * (discount.value / 100))}
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
                            setGrandTotal(
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
                            );
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
            <CardFooter
              className="py-4 flex flex-col transition-all duration-500 relative"
              style={{
                height: isProceed ? "60px" : "120px",
              }}
            >
              <div className="flex justify-between items-center font-bold w-full">
                <p>Grand Total</p>
                <p>{VND.format(grandTotal)}</p>
              </div>
              {!isProceed && (
                <Button
                  className="w-full py-6 mt-4"
                  onClick={() => setIsProceed(true)}
                >
                  Proceed to Checkout
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
