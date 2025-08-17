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
import { get, patch, post, postImageMulti } from "@/utils/requets";
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
import HeadContent from "@/components/HeadContent";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import PostReview from "@/components/PostReview";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductModel } from "@/models/productModel";
import Link from "next/link";

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
  const [openDialogReview, setOpenDialogReview] = useState(false);
  const [orderSelected, setOrderSelected] = useState<OrderModel | null>(null);

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

  useEffect(() => {
    if (!openDialogReview && orderSelected) {
      setOrderSelected(null);
    }
  }, [openDialogReview]);

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
    }, 500)
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
      <div key={key} className="border-muted w-full pb-4 border-b-2">
        <div className="md:items-center md:flex-row flex flex-col justify-between gap-4">
          <div className=" flex items-center gap-4">
            <Skeleton className="w-18 h-18 bg-muted" />
            <div className="flex flex-col gap-3 text-sm">
              <Skeleton className="w-40 h-3" />
              <Skeleton className="h-2.5 w-15" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          <div className="">
            <Skeleton className="w-20 h-4" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-9 md:w-30 w-full" />
            <Skeleton className="h-9 md:w-30 w-full" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Skeleton className="w-18 h-5" />
          <Skeleton className="w-38 h-3" />
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
      <div className="py-16 text-center">
        <div className="dark:bg-gray-700 flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full">
          <ClipboardList className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="dark:text-white mb-2 text-xl font-semibold text-gray-900">
          Your order is empty
        </h3>
        <p className="dark:text-gray-400 mb-6 text-gray-600">
          Add some items to your cart and checkout to get started.
        </p>
        <Button
          onClick={() => router.push("/shop")}
          className="dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white bg-gray-900"
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
      <HeadContent
        title="My Orders"
        desc="List of all your orders"
        size="large"
        className="md:hidden flex flex-col items-start mb-8"
      />
      <div className="flex items-center justify-end gap-3 mb-6">
        <div className="relative">
          <Search className="left-2 top-1/2 absolute -translate-y-1/2" />
          <Input
            className="py-6 pl-10"
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
              <Button className="w-full py-6">
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
            <div className="flex items-center justify-end gap-3 mt-6">
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
        <div className="flex flex-col w-full gap-5 mt-5">
          {Array.from({ length: 3 }).map((_, index) => renderSkeleton(index))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="flex flex-col gap-5" ref={listRef}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="border-muted w-full pb-4 border-b-2"
              id={order.orderNo}
            >
              <div className="md:items-center md:flex-row flex flex-col justify-between gap-4">
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
                        className="rounded-xs object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <p className="text-base font-bold">
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
                      <Button
                        className="py-5"
                        onClick={() => {
                          setOrderSelected(order);
                          setOpenDialogReview(true);
                        }}
                      >
                        Write A review
                      </Button>
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
                            className="hover:bg-red-500 py-5 text-white bg-red-400"
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
          <div className="py-16 text-center">
            <div className="dark:bg-gray-700 flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="dark:text-white mb-2 text-xl font-semibold text-gray-900">
              No orders found
            </h3>
            <p className="dark:text-gray-400 mb-6 text-gray-600">
              Try searching with different keywords or filters.
            </p>
          </div>
        )
      )}
      {showSkeleton && !isLoading && (
        <div className="flex flex-col w-full gap-5 mt-5">
          {Array.from({ length: 3 }).map((_, index) => renderSkeleton(index))}
        </div>
      )}
      <DialogReview
        open={openDialogReview}
        setOpen={setOpenDialogReview}
        order={orderSelected}
      />
    </div>
  );
};

interface DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: OrderModel | null;
}

interface IProductOrder extends ProductModel {
  reviewed: boolean;
}

const DialogReview = (props: DialogProps) => {
  const { open, setOpen, order } = props;

  const [showFastReview, setShowFastReview] = useState(false);
  const [products, setProducts] = useState<IProductOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (!open) {
      setProducts([]);
      setSelectedKeys([]);
      setShowFastReview(false);
    }
  }, [open]);

  useEffect(() => {
    if (order) {
      getProductInfo(order.orderNo);
    }
  }, [order]);

  const getProductInfo = async (order_no: string) => {
    try {
      setIsLoading(true);
      const response = await get(`/orders/products-info/${order_no}`);
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (data: {
    rateScore: number;
    title: string;
    content: string;
    files: File[];
  }) => {
    if (
      !order ||
      !data.title ||
      !data.content ||
      data.rateScore === 0 ||
      selectedKeys.length === 0
    ) {
      return;
    }

    try {
      setIsPosting(true);
      const payload: any = {
        star: data.rateScore,
        title: data.title,
        content: data.content,
      };

      if (data.files.length > 0) {
        const res = await postImageMulti("images", data.files);
        payload.images = res.data;
      }

      await post(`/orders/review-multi`, {
        orderNo: order.orderNo,
        data: payload,
        ids: selectedKeys,
      });

      setOpen(false);
      toast.success("Review submitted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit review");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`dark:text-white/80 max-w-9/10 py-6 pl-6 pr-2 overflow-hidden ${
          showFastReview ? "h-9/10" : "max-h-9/10"
        }`}
      >
        <DialogHeader>
          <DialogTitle>Write Review</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <div className="custom-scrollbar max-h-full overflow-hidden overflow-x-hidden overflow-y-auto">
          <div className="max-w-19/20 mb-6">
            {order?.products && order.products.length > 0 ? (
              <div className="flex flex-col gap-3 text-sm">
                {isLoading ? (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, index) => {
                      return (
                        <div className="flex items-center gap-2" key={index}>
                          <Skeleton className="w-12 h-12" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="w-full h-3" />
                            <Skeleton className="w-full h-2" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  products.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between`}
                        style={{
                          opacity: item.reviewed ? 0.7 : 1,
                          pointerEvents: item.reviewed ? "none" : "auto",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            // checked={selectedKeys.includes(item._id)}
                            onCheckedChange={(e) => {
                              if (e) {
                                selectedKeys.push(item._id);
                              } else {
                                selectedKeys.splice(
                                  selectedKeys.indexOf(item._id),
                                  1
                                );
                              }
                            }}
                          />
                          <div className="w-14 h-14 overflow-hidden bg-gray-100 rounded-sm">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="space-y-1">
                            <p>{item.title}</p>
                            <p className="text-xs text-gray-500">{item.SKU}</p>
                          </div>
                        </div>
                        <Link href={`/shop/${item.slug}#review`}>
                          <Button size={"sm"} className="text-xs">
                            {item.reviewed ? "Reviewed" : "Review"}
                          </Button>
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
            ) : null}
          </div>
          {order &&
          order.products &&
          products.some((item) => !item.reviewed) ? (
            <p
              onClick={() => setShowFastReview(!showFastReview)}
              className="hover:underline inline-block mb-4 text-sm font-medium text-blue-400 transition-all duration-300 cursor-pointer"
            >
              Fast Review
            </p>
          ) : null}
          {showFastReview ? (
            <div className="max-w-19/20 flex flex-col gap-2">
              <PostReview
                smaller
                onSubmit={(data) => {
                  handleSubmitReview(data);
                }}
                isPosting={isPosting}
              />
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Order;
