/* eslint-disable @next/next/no-img-element */
import { AddressModel } from "@/models/addressModel";
import { CartModel } from "@/models/cartModel";
import { PaymentMethodModel } from "@/models/paymentMethod";
import React from "react";
import { Button } from "./ui/button";
import { FaRegEdit } from "react-icons/fa";
import { VND } from "@/utils/formatCurrency";
import { format } from "date-fns";

interface Props {
  cartsCheckout?: CartModel[];
  shippingAddress?: AddressModel;
  paymentMethod?: string;
  paymentCard?: PaymentMethodModel;
}

const ReviewOrder = (props: Props) => {
  const { cartsCheckout, shippingAddress, paymentCard, paymentMethod } = props;

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-bold my-6">
        Estimated delivery:{" "}
        {format(new Date().getTime() + 1000 * 60 * 60 * 24 * 3, "PP")}
      </h3>
      <div className="flex flex-col gap-4">
        {cartsCheckout && cartsCheckout.length > 0 ? (
          cartsCheckout.map((item, index) => (
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
          ))
        ) : (
          <div>No data</div>
        )}
      </div>

      <div className="py-5 border-b-2 border-muted">
        <h3 className="font-bold text-lg">Shipping Address</h3>
        {shippingAddress && (
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
        )}
      </div>
      <div className="py-5 border-b-2 border-muted">
        <h3 className="font-bold text-lg">Payment Method</h3>
        {paymentMethod && (
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
              <Button variant={"outline"} size={"icon"} className="bg-muted">
                <FaRegEdit size={20} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewOrder;
