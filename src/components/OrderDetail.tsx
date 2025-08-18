import { get } from "@/utils/requets";
import React, { useEffect, useState } from "react";
import ReviewOrder from "./ReviewOrder";
import { OrderModel } from "@/models/orderModel";
import { Button } from "./ui/button";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { FiCalendar, FiUser, FiX } from "react-icons/fi";
import { format } from "date-fns";
import { toast } from "sonner";
import ButtonLoading from "./ButtonLoading";
import LoadingComponent from "./LoadingComponent";

interface Props {
  order_no: string;
}

const OrderDetail = (props: Props) => {
  const { order_no } = props;

  const [order, setOrder] = useState<OrderModel>();
  const [reordering, setReordering] = useState(false);

  const router = useRouter();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await get("/orders/detail/" + order_no);
      setOrder(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-600",
          border: "border-yellow-200",
          textDeep: "text-yellow-800",
          bgDeep: "bg-yellow-100",
        };
      case "confirmed":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "border-blue-200",
          textDeep: "text-blue-800",
          bgDeep: "bg-blue-100",
        };
      case "delivered":
        return {
          bg: "bg-green-50",
          text: "text-green-600",
          border: "border-green-200",
          textDeep: "text-green-800",
          bgDeep: "bg-green-100",
        };
      case "canceled":
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          textDeep: "text-gray-800",
          bgDeep: "bg-gray-100",
        };
      case "shipping":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          textDeep: "text-red-800",
          bgDeep: "bg-red-100",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-800",
          border: "border-gray-200",
          textDeep: "text-gray-800",
          bgDeep: "bg-gray-100",
        };
    }
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  const handleReorder = async () => {
    try {
      setReordering(true);
      const response = await get(
        `/orders/reorder/get-products-and-create-cart/${order.orderNo}`
      );
      localStorage.setItem("cart_checkout", JSON.stringify(response.data));
      router.push("/cart/checkout", { scroll: true });
    } catch (error) {
      console.log(error);
      toast.error("Failed to reorder");
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      {reordering && <LoadingComponent type="superScreen" />}
      <div className="dark:bg-neutral-800 sticky top-0 z-10 px-4 py-3 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant={"outline"}
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <IoArrowBack />
              <span className="sm:inline hidden">Back</span>
            </Button>
            <h1 className="dark:text-white/80 text-lg font-semibold text-gray-900">
              Order Details - #{order_no}
            </h1>
          </div>
          {(order.status === "canceled" || order.status === "delivered") && (
            <div>
              <ButtonLoading
                typeLoading={1}
                className="py-5"
                onClick={handleReorder}
              >
                Reorder
              </ButtonLoading>
            </div>
          )}
        </div>
      </div>

      {order && (
        <div
          className={`mb-6 p-4 border rounded-lg mt-6 ${
            statusColor(order.status).border
          } ${statusColor(order.status).bg}`}
        >
          <div className="flex items-center justify-between">
            <div className={``}>
              <p
                className={`text-sm font-medium ${
                  statusColor(order.status).text
                }`}
              >
                Order Status
              </p>
              <p
                className={`text-lg font-semibold capitalize ${
                  statusColor(order.status).textDeep
                }`}
              >
                {order.status || "Processing"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <Badge
                className={`${statusColor(order.status).bgDeep} ${
                  statusColor(order.status).textDeep
                }`}
              >
                Order #{order.orderNo || "Processing"}
              </Badge>
              <span className="text-xs text-gray-600">
                {format(order.createdAt, "PP")}
              </span>
            </div>
          </div>
        </div>
      )}
      {
        <div>
          {" "}
          {order?.status === "canceled" && order.cancel && (
            <div className="bg-red-50 p-4 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2 font-medium text-red-700">
                <FiX className="w-4 h-4" />
                Order Canceled
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-3 h-3 text-red-500" />
                    <span className="text-red-600">Canceled at:</span>
                    <span className="font-medium text-red-900">
                      {format(order.cancel.canceledAt || new Date(), "PP")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUser className="w-3 h-3 text-red-500" />
                    <span className="text-red-600">Canceled by:</span>
                    <span className="font-medium text-red-900">
                      {order.cancel.canceledBy === "admin" ? "shop" : "you"}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-red-600">Reason:</span>
                  <p className="mt-1 text-red-900">
                    {order.cancel.canceledBy === "admin"
                      ? order?.cancel?.reasonCancel || "Canceled by system"
                      : order?.cancel?.reasonCancel || "No reason provided"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      }
      <div className="w-full pb-6 mx-auto">
        <ReviewOrder order={order} />
      </div>
    </div>
  );
};

export default OrderDetail;
