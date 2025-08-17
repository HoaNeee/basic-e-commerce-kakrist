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
      <div className="dark:border-gray-700 p-6 border-b border-gray-200">
        <h2 className="dark:text-white text-lg font-semibold text-gray-900">
          Order Review
        </h2>
        <p className="dark:text-gray-400 mt-1 text-sm text-gray-600">
          {cartCheckout.length} item
          {cartCheckout.length !== 1 ? "s" : ""} in your order
        </p>
      </div>

      <div className={`overflow-x-auto p-2 transform min-h-40`}>
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700 border-gray-200">
              <TableHead className="dark:text-gray-400 text-gray-600">
                Product
              </TableHead>
              <TableHead className="dark:text-gray-400 text-gray-600">
                Price
              </TableHead>
              <TableHead className="dark:text-gray-400 text-gray-600">
                Qty
              </TableHead>
              <TableHead className="dark:text-gray-400 text-right text-gray-600">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartCheckout.map((item, index) => (
              <TableRow
                key={index}
                className="dark:border-gray-700 my-1 border-gray-200"
              >
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="dark:bg-gray-700 flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded-lg">
                      <img
                        src={item.thumbnail || item.thumbnail_product}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="dark:text-white line-clamp-2 font-medium text-gray-900">
                        {item.title}
                      </h3>
                      {item.productType === "variations" &&
                      item?.options_info ? (
                        <p className="dark:text-gray-400 mt-1 text-sm text-gray-500">
                          {item.options_info.map((opt) => opt.title).join(", ")}
                        </p>
                      ) : item.options ? (
                        <p className="dark:text-gray-400 mt-1 text-sm text-gray-500">
                          {item.options.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="dark:text-white font-medium text-gray-900">
                  {VND.format(item.discountedPrice ?? item.price)}
                </TableCell>
                <TableCell className="dark:text-white text-gray-900">
                  {item.quantity}
                </TableCell>
                <TableCell className="dark:text-white font-medium text-right text-gray-900">
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
