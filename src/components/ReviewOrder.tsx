/* eslint-disable @next/next/no-img-element */
import { AddressModel } from "@/models/addressModel";
import { CartModel } from "@/models/cartModel";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FaRegEdit } from "react-icons/fa";
import { VND } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { OrderModel } from "@/models/orderModel";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import CardAddress from "./checkout/CardAddress";
import { toast } from "sonner";
import { patch } from "@/utils/requets";
import ButtonLoading from "./ButtonLoading";

interface Props {
  cartsCheckout?: CartModel[];
  shippingAddress?: AddressModel;
  payment?: {
    method: string;
    status?: string;
  };
  order?: OrderModel;
  addressList?: AddressModel[];
  onChangeAddress?: (address: AddressModel) => void;
}

const ReviewOrder = (props: Props) => {
  const {
    cartsCheckout,
    shippingAddress,
    payment,
    order,
    addressList,
    onChangeAddress,
  } = props;
  const [openDialogChangeAddress, setOpenDialogChangeAddress] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const estimatedDelivery = new Date().getTime() + 1000 * 60 * 60 * 24 * 3;

  const renderOrderSummary = (order: OrderModel) => {
    const subTotal = order.products.reduce(
      (val, item) => val + item.price * item.quantity,
      0
    );

    let discountValue = 0;
    if (order.promotion) {
      if (order.promotion.promotionType === "percent") {
        discountValue = subTotal * (order.promotion.value / 100);
      } else discountValue = order.promotion.value;
    }

    const granTotal = Math.max(0, subTotal - discountValue);

    return (
      <Card className="py-0 gap-0 transition-all duration-300">
        <CardHeader className="">
          <div className="flex py-4 justify-between text-lg text-muted-foreground items-center font-bold border-b-2 border-muted w-full">
            <p className="">Subtotal</p>
            <p>{VND.format(subTotal)}</p>
          </div>
        </CardHeader>
        <CardContent className="transition-all duration-300">
          <div className="border-b-2 border-muted py-4">
            <div className="space-y-2 flex items-center gap-2 text-muted-foreground">
              Promotion:{" "}
              {order.promotion ? (
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
          <div className="flex justify-between items-center font-bold w-full text-lg">
            <p>Grand Total</p>
            <p>{VND.format(granTotal)}</p>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const handleChangeAddress = async (address: AddressModel) => {
    try {
      const transaction = localStorage.getItem("transaction");
      if (!transaction) {
        return;
      }

      setIsUpdating(true);
      const transactionParsed = JSON.parse(transaction);
      const transaction_info = transactionParsed.transaction_info || {};

      await patch("/transaction/change", {
        step: "3",
        payload: {
          ...transaction_info,
          address: address,
        },
      });
      onChangeAddress?.(address);
      setOpenDialogChangeAddress(false);
      toast.success("Address changed successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to change address.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full h-full">
      <ol
        className="flex mt-6"
        style={{
          flexDirection: order ? "column-reverse" : "column",
          marginTop: order ? "" : "0px",
        }}
      >
        <li
          className="text-lg font-bold my-6"
          style={{
            order: order ? "3" : "1",
          }}
        >
          Estimated delivery:{" "}
          {format(!order ? estimatedDelivery : order.estimatedDelivery, "PP")}
        </li>
        <li className="order-2">
          {cartsCheckout && cartsCheckout.length > 0 ? (
            <div className="flex flex-col gap-4">
              {cartsCheckout.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 pb-5 border-b-2 border-muted dark:border-white/70"
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
                    {item.slug ? (
                      <Link
                        href={`/shop/${item.slug}`}
                        className="font-bold text-base hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <p className="font-bold text-base">{item.title}</p>
                    )}
                    <p>
                      {item.quantity} x{" "}
                      {item.discountedPrice !== null &&
                      item.discountedPrice !== undefined
                        ? VND.format(item.discountedPrice)
                        : VND.format(item.price)}{" "}
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
          ) : order && order.products.length > 0 ? (
            <div className="flex flex-col gap-4">
              {order.products.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 pb-5 border-b-2 border-muted dark:border-white/70"
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
                    {item.slug ? (
                      <Link
                        href={`/shop/${item.slug}`}
                        className="font-bold text-base hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <p className="font-bold text-base">{item.title}</p>
                    )}
                    <p>
                      {item.quantity} x {VND.format(item.price)}
                    </p>
                    {item.options && item.options.length > 0 ? (
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

        <li className="py-5 border-b-2 border-muted order-4 dark:border-white/70">
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
              {!order && (
                <div>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    className="bg-muted"
                    onClick={() => setOpenDialogChangeAddress(true)}
                  >
                    <FaRegEdit size={20} />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            order && (
              <div className="flex items-center justify-between">
                <div className="mt-4">
                  <p className="font-semibold">{order.shippingAddress.name}</p>
                  <p className="mt-2 tracking-wider text-sm">
                    {order.shippingAddress.address}
                  </p>
                </div>
              </div>
            )
          )}
        </li>
        <li className="py-5 border-b-2 border-muted order-5 dark:border-white/70">
          <>
            <h3 className="font-bold text-lg">Payment Method</h3>
            {payment ? (
              <div className="flex items-center justify-between">
                <div className="mt-4">
                  {payment.method === "cod" ? (
                    <div className="font-semibold">Cash on Delivering</div>
                  ) : (
                    // updating
                    <div>{payment?.method}</div>
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
                  {order?.paymentMethod === "cod" ? (
                    <div className="font-semibold">Cash on Delivering</div>
                  ) : (
                    // updateting
                    <div>{order?.paymentMethod}</div>
                  )}
                </div>
              </div>
            )}
          </>
        </li>
        {order && <li className="mb-6 order-6">{renderOrderSummary(order)}</li>}
      </ol>

      <DialogChangeAddress
        open={openDialogChangeAddress}
        setOpen={setOpenDialogChangeAddress}
        addressList={addressList}
        adddressChecked={shippingAddress}
        onSave={(address) => {
          handleChangeAddress(address);
        }}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default ReviewOrder;

const DialogChangeAddress = ({
  open,
  setOpen,
  addressList = [],
  adddressChecked,
  onSave,
  isUpdating,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  addressList?: AddressModel[];
  adddressChecked?: AddressModel;
  onSave: (address: AddressModel) => void;
  isUpdating?: boolean;
}) => {
  const [addressCheckedInDialog, setAddressCheckedInDialog] = useState<
    AddressModel | undefined
  >(undefined);

  useEffect(() => {
    return () => setOpen(false);
  }, []);

  useEffect(() => {
    if (adddressChecked && open) {
      setAddressCheckedInDialog(adddressChecked);
    } else {
      setAddressCheckedInDialog(undefined);
    }
  }, [open, adddressChecked]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 h-19/20 overflow-hidden pb-2">
        <DialogHeader className="md:p-6 p-4">
          <DialogTitle>Change Shipping Address</DialogTitle>
          <DialogDescription>
            Make change to your shipping address for this order
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 max-h-fit overflow-hidden overflow-y-auto custom-scrollbar">
          {addressList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 pl-6 pr-4">
              {addressList.map((item) => (
                <CardAddress
                  item={item}
                  key={item._id}
                  addressChecked={addressCheckedInDialog}
                  onChecked={(val) => {
                    setAddressCheckedInDialog(val);
                  }}
                  isModal
                />
              ))}
            </div>
          ) : (
            <div>No address found</div>
          )}
        </div>
        <DialogFooter className="pb-2 px-4 flex items-center gap-2 justify-end flex-row">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <ButtonLoading
            onClick={() => onSave(addressCheckedInDialog as AddressModel)}
            typeLoading={1}
            loading={isUpdating}
            disabled={
              !addressCheckedInDialog ||
              isUpdating ||
              adddressChecked?._id === addressCheckedInDialog?._id
            }
            className="p-0 px-3"
          >
            Save Changes
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
