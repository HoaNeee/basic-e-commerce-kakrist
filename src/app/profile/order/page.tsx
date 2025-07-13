/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import ButtonLoading from "@/components/ButtonLoading";
import DialogConfirm from "@/components/dialog/DialogConfirm";
import OrderDetail from "@/components/OrderDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BillModel } from "@/models/billModel";
import { VND } from "@/utils/formatCurrency";
import { get, patch } from "@/utils/requets";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Order = () => {
  const [bills, setBills] = useState<BillModel[]>([]);
  const [resonCancel, setResonCancel] = useState("");
  const [isUpdating, setIsUpdating] = useState<{
    bill_id: string;
    loading: boolean;
  }>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");

  useEffect(() => {
    getBills();
  }, []);

  const getBills = async () => {
    try {
      const response = await get("/bills");
      setBills(response.data.bills);
    } catch (error) {
      console.log(error);
    }
  };

  const totalBillItem = (bill: BillModel) => {
    const promotion = bill.promotion;

    const total = bill.products.reduce(
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

  const billStatus = (bill: BillModel) => {
    switch (bill.status) {
      case "completed":
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
      case "delivering":
        return (
          <div className="flex items-center gap-2 mt-4 mb-2 text-sm">
            <Badge className="rounded-xs bg-yellow-100/50 text-yellow-600">
              In Progess
            </Badge>
            <p className="text-sm tracking-wider">
              Your order has been Inprogess
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

      default:
        return (
          <div className="flex items-center gap-2 mt-4 mb-2 text-sm">
            <Badge className="rounded-xs bg-red-100/50 text-red-600">
              Initial
            </Badge>
            <p className="text-sm tracking-wider">
              Your order has been Initial
            </p>
          </div>
        );
    }
  };

  const handleCancelBill = async (bill: BillModel) => {
    try {
      setIsUpdating({
        bill_id: bill._id,
        loading: true,
      });
      await patch("/bills/change-status/" + bill._id, {
        status: "canceled",
        canceledBy: "customer",
        resonCancel: resonCancel,
      });

      toast.success("This order has been canceled", {
        action: {
          label: "Close",
          onClick() {},
        },
        position: "top-center",
      });

      const items = [...bills];
      const index = items.findIndex((item) => item._id === bill._id);
      if (index !== -1) {
        items[index].status = "canceled";
      }
      setBills(items);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating({
        bill_id: bill._id,
        loading: false,
      });
    }
  };

  return order_id ? (
    <OrderDetail order_id={order_id} />
  ) : (
    <div className="w-full h-full">
      <div className="flex flex-col gap-5">
        {bills && bills.length > 0 ? (
          bills.map((bill) => (
            <div
              key={bill._id}
              className="w-full pb-4 border-b-2 border-muted"
              style={{
                opacity: bill.status === "canceled" ? "0.7" : "1",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 bg-muted">
                    <img
                      src={bill.products[0].thumbnail}
                      alt={""}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-sm flex flex-col gap-1">
                    <p className="font-bold text-base">
                      {bill.products[0].title}
                      {bill.products.length > 1 && (
                        <span className="text-muted-foreground">
                          {" "}
                          (+{bill.products.length - 1} other products)
                        </span>
                      )}
                    </p>
                    {bill.status !== "canceled" ? (
                      <>
                        <p className="text-muted-foreground">
                          {bill.products[0].options.length > 0
                            ? `${bill.products[0].options.join(", ")}`
                            : ""}
                        </p>
                        <p>Qyt: {bill.products[0].quantity}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm tracking-wider">
                          Cancel By:{" "}
                          {bill.canceledBy === "admin" ? "Shop" : "You"}
                        </p>
                        <p className="text-sm tracking-wider">
                          Reson: {bill.resonCancel}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="font-bold">
                  {VND.format(totalBillItem(bill))}
                </div>
                {bill.status !== "canceled" && (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={"outline"}
                      className="py-5"
                      onClick={() => {
                        router.push("/profile/order?order_id=" + bill._id);
                      }}
                    >
                      View Order
                    </Button>
                    {bill.status === "completed" ? (
                      <Button className="py-5">Write A review</Button>
                    ) : (
                      bill.status !== "delivering" && (
                        <DialogConfirm
                          onConfirm={() => handleCancelBill(bill)}
                          description="Can you tell us why you want to cancel?"
                          extraContent={
                            <div className="w-full">
                              <Textarea
                                placeholder="Write something to here..."
                                className="min-h-30"
                                onChange={(e) => {
                                  setResonCancel(e.target.value);
                                }}
                              />
                            </div>
                          }
                        >
                          <ButtonLoading
                            typeLoading={1}
                            loading={
                              isUpdating?.bill_id === bill._id
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
              {billStatus(bill)}
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
