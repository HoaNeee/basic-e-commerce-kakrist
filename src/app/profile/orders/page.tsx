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
import { ClipboardList, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VscSettings } from "react-icons/vsc";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const listRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const order_no = searchParams.get("order_no");
  const limit = 5;

  useEffect(() => {
    setLoaded(true);
    const fetchData = async () => {
      try {
        setShowSkeleton(true);
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setShowSkeleton(false);
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
    if (!order_no) {
      if (listRef.current) {
        window.addEventListener("scroll", scrollToBottom);
      }
    }

    return () => window.removeEventListener("scroll", scrollToBottom);
  }, [showSkeleton, isLoading, order_no]);

  useEffect(() => {
    if (keyword || statusFilter) {
      setIsFilter(true);
    } else {
      setTimeout(() => {
        setIsFilter(false);
      }, 1000);
    }
  }, [keyword, statusFilter]);

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

  const handleShowMore = async (page: number) => {
    try {
      const data = await getOrders(page, keyword, statusFilter);
      setOrders([...orders, ...data]);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSkeleton(false);
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

  const debounceSearch = useRef(
    lodash.debounce(async (keyword: string, status = "") => {
      await handleSearchAndFilter(keyword, status);
    }, 1000)
  ).current;

  const getOrders = async (page = 1, keyword = "", status = "") => {
    const api = `/orders?page=${page}&limit=${limit}&keyword=${keyword}&status=${status}`;
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
    let statusClass = "";
    let statusText = "";

    switch (order.status) {
      case "delivered":
        statusClass =
          "rounded-xs bg-green-100/50 text-green-600 dark:bg-green-50/20 dark:text-green-500 shadow";
        statusText = "Your order has been delivered";
        break;
      case "shipping":
        statusClass =
          "rounded-xs bg-red-100/50 text-red-600 dark:bg-red-50/20 dark:text-red-500 shadow";
        statusText = "Your order is being shipped";
        break;

      case "canceled":
        statusClass =
          "rounded-xs bg-gray-100/50 text-gray-600 dark:text-white/80 dark:bg-neutral-50/20 shadow";
        statusText = "Your order has been Canceled";
        break;

      case "confirmed":
        statusClass =
          "rounded-xs bg-blue-100/50 text-blue-600 dark:bg-blue-50/20 dark:text-blue-500 shadow";
        statusText = "Your order has been Confirmed";
        break;

      default:
        statusClass =
          "rounded-xs bg-yellow-100/40 text-yellow-500 dark:bg-yellow-50/20 shadow";
        statusText = "Your order is pending";
    }

    return (
      <div className="flex items-center gap-2 mt-4 mb-2 text-sm">
        <Badge className={`capitalize ${statusClass}`}>{order.status}</Badge>
        <p className="text-sm tracking-wider">{statusText}</p>
      </div>
    );
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
        <div className="flex md:items-center justify-between md:flex-row flex-col gap-4">
          <div className="flex items-center gap-4 ">
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
            <Skeleton className="h-9 md:w-30 w-full" />
            <Skeleton className="h-9 md:w-30 w-full" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Skeleton className="h-5 w-18" />
          <Skeleton className="h-3 w-38" />
        </div>
      </div>
    );
  };

  const handleSearchAndFilter = async (keyword = "", status = "") => {
    try {
      setIsLoading(true);

      if (page !== 1) {
        setPage(1);
      }

      const data = await getOrders(1, keyword, status);
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (
    loaded &&
    orders &&
    orders.length === 0 &&
    !keyword &&
    !statusFilter &&
    !showSkeleton &&
    !isLoading &&
    !isFilter
  ) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
          <ClipboardList className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Your order is empty
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Add some items to your cart and checkout to get started.
        </p>
        <Button
          onClick={() => router.push("/shop")}
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
        >
          Shop
        </Button>
      </div>
    );
  }

  return order_no ? (
    <OrderDetail order_no={order_no} />
  ) : (
    <div className="w-full h-full">
      <div className="flex items-center gap-3 justify-end mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2" />
          <Input
            className="pl-10 py-6"
            placeholder="Search..."
            name="key-search-order"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              debounceSearch(e.target.value, statusFilter);
            }}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <div className="w-25">
              <Button className="py-6 w-full">
                Filter
                <VscSettings />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <h3 className="mb-4 font-semibold">Filter</h3>
            <div className="flex items-center gap-4">
              <Label htmlFor="select-status">Status: </Label>
              <Select
                value={statusFilter}
                onValueChange={(e) => {
                  setStatusFilter(e);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent id="select-status" className="w-full">
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end items-center gap-3 mt-6">
              <Button
                variant={"outline"}
                onClick={async () => {
                  if (statusFilter) {
                    setStatusFilter("");
                    await handleSearchAndFilter(keyword, "");
                  }
                }}
              >
                Clear
              </Button>
              <Button
                onClick={async () => {
                  handleSearchAndFilter(keyword, statusFilter);
                }}
              >
                Done
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-5 w-full mt-5">
          {Array.from({ length: 3 }).map((_, index) => renderSkeleton(index))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="flex flex-col gap-5" ref={listRef}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="w-full pb-4 border-b-2 border-muted"
              id={order.orderNo}
            >
              <div className="flex md:items-center justify-between md:flex-row flex-col gap-4">
                <div
                  className={`flex items-center gap-4 ${
                    order.status === "canceled" ? "text-gray-500" : ""
                  }`}
                >
                  <div className="md:max-w-full max-w-2/9">
                    <div className="w-18 h-18 bg-muted">
                      <img
                        src={order?.products[0].thumbnail}
                        alt={""}
                        className="h-full w-full object-cover rounded-xs"
                      />
                    </div>
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
                <div
                  className={`font-bold md:text-lg leading-tight ${
                    order.status === "canceled" ? "text-gray-500" : ""
                  }`}
                >
                  {VND.format(totalPriceOrderItem(order))}
                </div>
                {
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
                      order.status !== "shipping" &&
                      order.status !== "canceled" && (
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
                }
              </div>

              {orderStatus(order)}
            </div>
          ))}
        </div>
      ) : (
        !showSkeleton && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try searching with different keywords or filters.
            </p>
          </div>
        )
      )}
      {showSkeleton && !isLoading && (
        <div className="flex flex-col gap-5 w-full mt-5">
          {Array.from({ length: 3 }).map((_, index) => renderSkeleton(index))}
        </div>
      )}
    </div>
  );
};

export default Order;
