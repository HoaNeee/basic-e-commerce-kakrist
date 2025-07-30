/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { VND } from "@/utils/formatCurrency";
import { CartModel } from "@/models/cartModel";

interface Props {
  isProceed?: boolean;
  cartCheckout: CartModel[];
}

const TableOverview = (props: Props) => {
  const { isProceed, cartCheckout } = props;

  return (
    <div
      className={`bg-white min-w-full dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-300 transform ${
        !isProceed ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        maxHeight: !isProceed ? "1500px" : "0px",
        pointerEvents: !isProceed ? "auto" : "none",
        opacity: !isProceed ? 1 : 0,
      }}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Order Review
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {cartCheckout.length} item
          {cartCheckout.length !== 1 ? "s" : ""} in your order
        </p>
      </div>

      <div className={`overflow-x-auto p-2 transform min-h-40`}>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-700">
              <TableHead className="text-gray-600 dark:text-gray-400">
                Product
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">
                Price
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">
                Qty
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400 text-right">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartCheckout.map((item) => (
              <TableRow
                key={item.cartItem_id}
                className="border-gray-200 dark:border-gray-700 my-1"
              >
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.thumbnail || item.thumbnail_product}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                        {item.title}
                      </h3>
                      {item.productType === "variations" &&
                        item.options_info && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.options_info
                              .map((opt) => opt.title)
                              .join(", ")}
                          </p>
                        )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-900 dark:text-white font-medium">
                  {VND.format(item.discountedPrice ?? item.price)}
                </TableCell>
                <TableCell className="text-gray-900 dark:text-white">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-right text-gray-900 dark:text-white font-medium">
                  {VND.format(
                    item.quantity * (item.discountedPrice ?? item.price)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableOverview;
