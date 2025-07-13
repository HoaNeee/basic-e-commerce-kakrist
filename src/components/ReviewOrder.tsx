/* eslint-disable @next/next/no-img-element */
import { AddressModel } from "@/models/addressModel";
import { CartModel } from "@/models/cartModel";
import { PaymentMethodModel } from "@/models/paymentMethod";
import React from "react";
import { Button } from "./ui/button";
import { FaRegEdit } from "react-icons/fa";
import { VND } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { BillModel } from "@/models/billModel";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

interface Props {
  cartsCheckout?: CartModel[];
  shippingAddress?: AddressModel;
  paymentMethod?: string;
  paymentCard?: PaymentMethodModel;
  bill?: BillModel;
}

const ReviewOrder = (props: Props) => {
  const { cartsCheckout, shippingAddress, paymentCard, paymentMethod, bill } =
    props;

  const estimatedDelivery = new Date().getTime() + 1000 * 60 * 60 * 24 * 3;

  const renderTotal = (bill: BillModel) => {
    const subTotal = bill.products.reduce(
      (val, item) => val + item.price * item.quantity,
      0
    );

    let discountValue = 0;
    if (bill.promotion) {
      if (bill.promotion.promotionType === "percent") {
        discountValue = subTotal * (bill.promotion.value / 100);
      } else discountValue = bill.promotion.value;
    }

    const granTotal = Math.max(0, subTotal - discountValue);

    return (
      <Card className="py-0 gap-0 transition-all duration-300">
        <CardHeader className="">
          <div className="flex py-4 justify-between items-center font-bold border-b-2 border-muted w-full">
            <p>Subtotal</p>
            <p>{VND.format(subTotal)}</p>
          </div>
        </CardHeader>
        <CardContent className="transition-all duration-300">
          <div className="border-b-2 border-muted py-4">
            <div className="space-y-2 flex items-center gap-2">
              Promotion:{" "}
              {bill.promotion ? (
                <Badge className="bg-red-100/50 text-red-500 rounded-sm">
                  - {VND.format(discountValue)}
                </Badge>
              ) : (
                <p className="">Not applicable</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="py-4 flex flex-col transition-all duration-500 relative">
          <div className="flex justify-between items-center font-bold w-full">
            <p>Grand Total</p>
            <p>{VND.format(granTotal)}</p>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="w-full h-full">
      <ol
        className="flex mt-6"
        style={{
          flexDirection: bill ? "column-reverse" : "column",
          marginTop: bill ? "" : "0px",
        }}
      >
        <li
          className="text-lg font-bold my-6"
          style={{
            order: bill ? "3" : "1",
          }}
        >
          Estimated delivery:{" "}
          {format(!bill ? estimatedDelivery : bill.estimatedDelivery, "PP")}
        </li>
        <li className="order-2">
          {cartsCheckout && cartsCheckout.length > 0 ? (
            <div className="flex flex-col gap-4">
              {cartsCheckout.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 pb-5 border-b-2 border-muted"
                >
                  <div className="w-19 h-19 bg-muted">
                    <img
                      className="w-full h-full"
                      src={
                        item.thumbnail ||
                        "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"
                      }
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <p className="font-bold text-base">{item.title}</p>
                    <p>
                      {item.discountedPrice !== null &&
                      item.discountedPrice !== undefined
                        ? VND.format(item.discountedPrice)
                        : VND.format(item.price)}
                    </p>
                    {item.productType === "variations" ? (
                      <p className="text-muted-foreground">
                        options:{" "}
                        <span className="">
                          {item.options_info?.map((it) => it.title).join(", ")}
                        </span>
                      </p>
                    ) : (
                      <p className="h-0.5"></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : bill && bill.products.length > 0 ? (
            <div className="flex flex-col gap-4">
              {bill.products.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 pb-5 border-b-2 border-muted"
                >
                  <div className="w-19 h-19 bg-muted">
                    <img
                      className="w-full h-full"
                      src={
                        item.thumbnail ||
                        "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"
                      }
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <p className="font-bold text-base">{item.title}</p>
                    <p>{VND.format(item.price)}</p>
                    {item.options ? (
                      <p className="text-muted-foreground">
                        options:{" "}
                        <span className="">{item.options.join(", ")}</span>
                      </p>
                    ) : (
                      <p className="h-0.5"></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No data</div>
          )}
        </li>

        <li className="py-5 border-b-2 border-muted order-4">
          <h3 className="font-bold text-lg">Shipping Address</h3>
          {shippingAddress ? (
            <div className="flex items-center justify-between">
              <div className="mt-4">
                <p className="font-semibold">{shippingAddress.name}</p>
                <p className="mt-2 tracking-wider text-sm">
                  {shippingAddress.houseNo}, {shippingAddress.ward.title},{" "}
                  {shippingAddress.district.title}, {shippingAddress.city.title}{" "}
                </p>
              </div>
              <div>
                <Button variant={"outline"} size={"icon"} className="bg-muted">
                  <FaRegEdit size={20} />
                </Button>
              </div>
            </div>
          ) : (
            bill && (
              <div className="flex items-center justify-between">
                <div className="mt-4">
                  <p className="font-semibold">{bill.shippingAddress.name}</p>
                  <p className="mt-2 tracking-wider text-sm">
                    {bill.shippingAddress.address}
                  </p>
                </div>
                <div>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    className="bg-muted"
                  >
                    <FaRegEdit size={20} />
                  </Button>
                </div>
              </div>
            )
          )}
        </li>
        <li className="py-5 border-b-2 border-muted order-5">
          <>
            <h3 className="font-bold text-lg">Payment Method</h3>
            {paymentMethod ? (
              <div className="flex items-center justify-between">
                <div className="mt-4">
                  {paymentMethod === "cod" ? (
                    <div className="font-semibold">Cash on Delivering</div>
                  ) : (
                    // updateting
                    <div>{paymentCard?.method}</div>
                  )}
                </div>
                <div>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    className="bg-muted"
                  >
                    <FaRegEdit size={20} />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="mt-4">
                  {bill?.paymentMethod === "cod" ? (
                    <div className="font-semibold">Cash on Delivering</div>
                  ) : (
                    // updateting
                    <div>{bill?.paymentMethod}</div>
                  )}
                </div>
                <div>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    className="bg-muted"
                  >
                    <FaRegEdit size={20} />
                  </Button>
                </div>
              </div>
            )}
          </>
        </li>
        {bill && <li className="mb-6 order-6">{renderTotal(bill)}</li>}
      </ol>
    </div>
  );
};

export default ReviewOrder;
