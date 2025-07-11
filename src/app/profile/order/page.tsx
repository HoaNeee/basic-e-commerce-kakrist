/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BillModel } from "@/models/billModel";
import { VND } from "@/utils/formatCurrency";
import { get } from "@/utils/requets";
import React, { useEffect, useState } from "react";

const Order = () => {
  const [bills, setBills] = useState<BillModel[]>([]);

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

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-5">
        {bills && bills.length > 0 ? (
          bills.map((bill) => (
            <div key={bill._id} className="w-full pb-4 border-b-2 border-muted">
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
                    </p>
                    <p className="text-muted-foreground">
                      {bill.products[0].options.length > 0
                        ? `${bill.products[0].options.join(", ")}`
                        : ""}
                    </p>
                    <p>Qyt: {bill.products[0].quantity}</p>
                  </div>
                </div>
                <div className="font-bold">
                  {VND.format(bill.products[0].price)}
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant={"outline"} className="py-5">
                    View Order
                  </Button>
                  <Button className="py-5">Write A review</Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 mb-2 text-sm">
                <Badge className="rounded-xs bg-green-100/50 text-green-600">
                  Delivered
                </Badge>
                <p className="text-sm tracking-wider">
                  Your product has been delivered
                </p>
              </div>
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
