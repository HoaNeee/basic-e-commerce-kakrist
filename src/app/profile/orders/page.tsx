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
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import lodash from "lodash";
import { Skeleton } from "@/components/ui/skeleton";

const Order = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [reasonCancel, setReasonCancel] = useState("");
  const [isUpdating, setIsUpdating] = useState<{
    order_no: string;
    loading: boolean;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const listRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const order_no = searchParams.get("order_no");
  const limit = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (page !== 1) {
      handleShowMore(page);
    }
  }, [page]);

  useEffect(() => {
    if (listRef.current) {
      window.addEventListener("scroll", scrollToBottom);
    }

    return () => window.removeEventListener("scroll", scrollToBottom);
  }, [isLoading]);

  const handleShowMore = async (page: number) => {
    try {
      setIsLoading(true);
      const data = await getOrders(page);
      setOrders([...orders, ...data]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setShowSkeleton(false);
    }
  };

  const scrollToBottom = () => {
    if (
      window.scrollY + window.innerHeight - 150 >=
      listRef.current?.clientHeight
    ) {
      if (page < totalPage) {
        if (!showSkeleton) {
          setShowSkeleton(true);
        }
        debounce(page, totalPage);
      }
    }
  };

  const handleSetPage = (page: number, totalPage: number) => {
    console.log("call");
    if (page < totalPage) {
      setPage(page + 1);
    } else if (showSkeleton) {
      setShowSkeleton(false);
    }
  };

  const debounce = useRef(
    lodash.debounce((page: number, totalPage: number) => {
      handleSetPage(page, totalPage);
    }, 1000)
  ).current;

  const getOrders = async (page = 1) => {
    const api = `/orders?page=${page}&limit=${limit}`;
    const response = await get(api);
    const data = response.data.orders;
    setTotalPage(response.data.totalPage);
    return data;
  };

  const totalPriceOrderItem = (order: OrderModel) => {
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
            <Badge className="rounded-xs bg-green-100/50 text-green-600 dark:bg-green-50/20 dark:text-green-500">
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
            <Badge className="rounded-xs bg-red-100/50 text-red-600 dark:bg-red-50/20 dark:text-red-500">
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
            <Badge className="rounded-xs bg-gray-100/50 text-gray-600 dark:text-white/80 dark:bg-neutral-50/20">
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
            <Badge className="rounded-xs bg-blue-100/50 text-blue-600 dark:bg-blue-50/20 dark:text-blue-500">
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
            <Badge className="rounded-xs bg-yellow-100/40 text-yellow-500 dark:bg-yellow-50/20">
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

      const items = [...(orders || [])];
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

  const renderSkeleton = (key: number) => {
    return (
      <div key={key} className="w-full pb-4 border-b-2 border-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-18 h-18 bg-muted" />
            <div className="text-sm flex flex-col gap-3">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-2.5 w-15" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          <div className="">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-9 w-30" />
            <Skeleton className="h-9 w-30" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Skeleton className="h-5 w-18" />
          <Skeleton className="h-3 w-38" />
        </div>
      </div>
    );
  };

  return order_no ? (
    <OrderDetail order_no={order_no} />
  ) : (
    <div className="w-full h-full">
      {orders && orders.length > 0 ? (
        <div className="flex flex-col gap-5" ref={listRef}>
          {orders.map((order) => (
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
                  {VND.format(totalPriceOrderItem(order))}
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
          ))}
        </div>
      ) : (
        <div> No data</div>
      )}
      {showSkeleton && (
        <div className="flex flex-col gap-5 w-full mt-5">
          {Array.from({ length: 3 }).map((_, index) => renderSkeleton(index))}
        </div>
      )}
    </div>
  );
};

export default Order;
