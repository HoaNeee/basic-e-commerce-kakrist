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

interface Props {
  order_no: string;
}

const OrderDetail = (props: Props) => {
  const { order_no } = props;

  const [order, setOrder] = useState<OrderModel>();

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
      <div className="text-gray-500 min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="sticky top-0 z-10 bg-white dark:bg-neutral-800 shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant={"outline"}
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <IoArrowBack />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white/80">
              Order Details - #{order_no}
            </h1>
          </div>
          {order.status === "canceled" && (
            <div>
              <Button className="py-5">Reorder</Button>
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

            <div className="flex flex-col gap-1 items-end">
              <Badge
                className={`${statusColor(order.status).bgDeep} ${
                  statusColor(order.status).textDeep
                }`}
              >
                Order #{order.orderNo || "Processing"}
              </Badge>
              <span className="text-gray-600 text-xs">
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
                <FiX className="w-4 h-4" />
                Order Canceled
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-3 h-3 text-red-500" />
                    <span className="text-red-600">Canceled at:</span>
                    <span className="text-red-900 font-medium">
                      {format(order.cancel.canceledAt || new Date(), "PP")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUser className="w-3 h-3 text-red-500" />
                    <span className="text-red-600">Canceled by:</span>
                    <span className="text-red-900 font-medium">
                      {order.cancel.canceledBy === "admin" ? "shop" : "you"}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-red-600">Reason:</span>
                  <p className="text-red-900 mt-1">
                    {order.cancel.reasonCancel || "Canceled by system"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      }
      <div className="w-full mx-auto pb-6">
        <ReviewOrder order={order} />
      </div>
    </div>
  );
};

export default OrderDetail;
