/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import ButtonLoading from "@/components/ButtonLoading";
import DialogConfirm from "@/components/dialog/DialogConfirm";
import OrderDetail from "@/components/OrderDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OrderModel } from "@/models/orderModel";
import { VND } from "@/utils/formatCurrency";
import { get, patch } from "@/utils/requets";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Order = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [reasonCancel, setReasonCancel] = useState("");
  const [isUpdating, setIsUpdating] = useState<{
    order_no: string;
    loading: boolean;
  }>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const order_no = searchParams.get("order_no");

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const response = await get("/orders");
      setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const totalOrderItem = (order: OrderModel) => {
    const promotion = order.promotion;

    const total = order.products.reduce(
      (val, item) => val + item.price * item.quantity,
      0
    );

    if (promotion && promotion.value) {
      if (promotion.promotionType === "percent") {
        const discounted = total * (promotion?.value / 100);

        return total - discounted;
      }
      return Math.max(total - promotion.value, 0);
    }

    return total;
  };

  const orderStatus = (order: OrderModel) => {
    switch (order.status) {
      case "delivered":
        return (
          <div className="flex items-center gap-2 mt-4 mb-2 text-sm">
            <Badge className="rounded-xs bg-green-100/50 text-green-600">
              Delivered
            </Badge>
            <p className="text-sm tracking-wider">
              Your order has been delivered
            </p>
          </div>
        );
      case "shipping":
        return (
          <div className="flex items-center gap-2 mt-4 mb-2 text-sm">
            <Badge className="rounded-xs bg-red-100/50 text-red-600">
              Shipping
            </Badge>
            <p className="text-sm tracking-wider">
              Your order is being shipped
            </p>
          </div>
        );
      case "canceled":
        return (
          <div className="flex items-center gap-2 mt-4 mb-2 text-sm">
            <Badge className="rounded-xs bg-gray-100/50 text-gray-600">
              Canceled
            </Badge>
            <p className="text-sm tracking-wider">
              Your order has been Canceled
            </p>
          </div>
        );

      case "confirmed":
        return (
          <div className="flex items-center gap-2 mt-4 mb-2 text-sm">
            <Badge className="rounded-xs bg-blue-100/50 text-blue-600">
              Confirmed
            </Badge>
            <p className="text-sm tracking-wider">
              Your order has been Confirmed
            </p>
          </div>
        );

      default:
        return (
          <div className="flex items-center gap-2 mt-4 mb-2 text-sm">
            <Badge className="rounded-xs bg-yellow-100/40 text-yellow-500">
              Pending
            </Badge>
            <p className="text-sm tracking-wider">Your order is pending</p>
          </div>
        );
    }
  };

  const handleCancelOrder = async (order: OrderModel) => {
    try {
      setIsUpdating({
        order_no: order.orderNo,
        loading: true,
      });
      await patch("/orders/change-status/" + order._id, {
        status: "canceled",
        canceledBy: "customer",
        reasonCancel: reasonCancel,
      });

      toast.success("This order has been canceled", {
        action: {
          label: "Close",
          onClick() {},
        },
        position: "top-center",
      });

      const items = [...orders];
      const index = items.findIndex((item) => item._id === order._id);
      if (index !== -1) {
        items[index].status = "canceled";
        items[index].cancel = {
          reasonCancel,
          canceledBy: "customer",
          canceledAt: new Date(),
        };
      }
      setOrders(items);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating({
        order_no: order._id,
        loading: false,
      });
    }
  };

  return order_no ? (
    <OrderDetail order_no={order_no} />
  ) : (
    <div className="w-full h-full">
      <div className="flex flex-col gap-5">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="w-full pb-4 border-b-2 border-muted"
              style={{
                opacity: order.status === "canceled" ? "0.7" : "1",
              }}
              id={order.orderNo}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 bg-muted">
                    <img
                      src={order?.products[0].thumbnail}
                      alt={""}
                      className="h-full w-full object-cover rounded-xs"
                    />
                  </div>
                  <div className="text-sm flex flex-col gap-1">
                    <p className="font-bold text-base">
                      {order.products[0].title}
                      {order.products.length > 1 && (
                        <span className="text-muted-foreground">
                          {" "}
                          (+{order.products.length - 1} other products)
                        </span>
                      )}
                    </p>
                    {order.status !== "canceled" ? (
                      <>
                        <p className="text-muted-foreground">
                          {order.products[0].options.length > 0
                            ? `${order.products[0].options.join(", ")}`
                            : ""}
                        </p>
                        <p>Qyt: {order.products[0].quantity}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm tracking-wider">
                          Cancel By:{" "}
                          {order.cancel?.canceledBy === "admin"
                            ? "Shop"
                            : "You"}
                        </p>
                        <p className="text-sm tracking-wider">
                          Reason:{" "}
                          {order.cancel?.reasonCancel || "Cancel by system"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="font-bold">
                  {VND.format(totalOrderItem(order))}
                </div>
                {order.status !== "canceled" && (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={"outline"}
                      className="py-5"
                      onClick={() => {
                        router.push(
                          "/profile/orders?order_no=" + order.orderNo
                        );
                      }}
                    >
                      View Order
                    </Button>
                    {order.status === "delivered" ? (
                      <Button className="py-5">Write A review</Button>
                    ) : (
                      order.status !== "shipping" && (
                        <DialogConfirm
                          onConfirm={() => handleCancelOrder(order)}
                          description="Can you tell us why you want to cancel?"
                          extraContent={
                            <div className="w-full">
                              <Textarea
                                placeholder="Write something to here..."
                                className="min-h-30"
                                onChange={(e) => {
                                  setReasonCancel(e.target.value);
                                }}
                              />
                            </div>
                          }
                        >
                          <ButtonLoading
                            typeLoading={1}
                            loading={
                              isUpdating?.order_no === order.orderNo
                                ? isUpdating.loading
                                : false
                            }
                            className="py-5 bg-red-400 text-white hover:bg-red-500"
                          >
                            Cancel Order
                          </ButtonLoading>
                        </DialogConfirm>
                      )
                    )}
                  </div>
                )}
              </div>
              {orderStatus(order)}
            </div>
          ))
        ) : (
          <div> No data</div>
        )}
      </div>
    </div>
  );
};

export default Order;
