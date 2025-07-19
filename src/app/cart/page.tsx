/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MyAlertDialog from "@/components/dialog/MyAlertDialog";
import HeadContent from "@/components/HeadContent";
import { TableCart } from "@/components/TableCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CartModel } from "@/models/cartModel";
import { addCartCheckout } from "@/redux/reducer/cartReducer";
import { RootState } from "@/redux/store";
import { VND } from "@/utils/formatCurrency";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Cart = () => {
  const [rowSelection, setRowSelection] = useState<any>({});
  const [dataSelected, setDataSelected] = useState<CartModel[]>([]);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const cart = useSelector((state: RootState) => state.cart.cart);
  const auth = useSelector((state: RootState) => state.auth.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.isLogin) {
      router.replace("/");
    }
  }, [auth]);

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
  }, [rowSelection, cart.carts]);

  return (
    <>
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
              <TableCart
                selection={rowSelection}
                setSelection={setRowSelection}
              />
            </div>
            <div className="flex-1">
              <Card>
                <CardHeader className="flex justify-between items-center font-bold">
                  <p>Subtotal</p>
                  <p>
                    {VND.format(
                      dataSelected.reduce(
                        (val, item) =>
                          val +
                          item.quantity *
                            (item.discountedPrice !== undefined &&
                            item.discountedPrice !== null
                              ? item.discountedPrice
                              : item.price),
                        0
                      )
                    )}
                  </p>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full py-6"
                    onClick={() => {
                      if (dataSelected) {
                        if (dataSelected.length > 0) {
                          dispatch(addCartCheckout(dataSelected));
                          router.push("/cart/checkout");
                        } else {
                          setOpenAlertDialog(true);
                        }
                      } else {
                        setOpenAlertDialog(true);
                      }
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
      <MyAlertDialog open={openAlertDialog} setOpen={setOpenAlertDialog} />
    </>
  );
};

export default Cart;
