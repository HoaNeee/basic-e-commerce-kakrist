/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import HeadContent from "@/components/HeadContent";
import { TableDemo } from "@/components/TableDemo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CartModel } from "@/models/cartModel";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Cart = () => {
  const [rowSelection, setRowSelection] = useState<any>({});
  const [dataSelected, setDataSelected] = useState<CartModel[]>([]);

  const cart = useSelector((state: RootState) => state.cart.cart);

  useEffect(() => {
    if (rowSelection) {
      const items = [];
      for (const key in rowSelection) {
        if (rowSelection[key]) {
          items.push(cart.carts[Number(key)]);
        }
      }
      setDataSelected(items);
    }
  }, [rowSelection]);

  return (
    <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
      <div className="w-full h-full">
        <HeadContent
          left={<></>}
          title="My Cart"
          styles={{
            marginBottom: "10px",
          }}
        />
        <div className="flex pb-6 gap-4">
          <div className="w-3/4">
            <TableDemo
              selection={rowSelection}
              setSelection={setRowSelection}
            />
          </div>
          <div className="flex-1">
            <Card>
              <CardHeader className="flex justify-between items-center font-bold">
                <p>Subtotal</p>
                <p>$200.00</p>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full py-6"
                  onClick={() => {
                    console.log(dataSelected);
                  }}
                >
                  Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
