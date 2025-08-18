/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CartModel } from "@/models/cartModel";
import { GoPlus, GoTrash } from "react-icons/go";
import { AiOutlineMinus } from "react-icons/ai";
import DialogConfirm from "./dialog/DialogConfirm";
import { VND } from "@/utils/formatCurrency";
import {
  changeQuantity,
  changeSubProduct,
  removeCartItem,
} from "@/redux/reducer/cartReducer";
import { toast } from "sonner";
import { del, patch } from "@/utils/requets";
import lodash from "lodash";
import { BiTransferAlt } from "react-icons/bi";
import DialogChangeOption from "./dialog/DialogChangeOption";
import Link from "next/link";
import { ImageOff } from "lucide-react";

interface Props {
  selection: any;
  setSelection: any;
}

export function TableCart(props: Props) {
  const { selection, setSelection } = props;

  const [itemSelected, setItemSelected] = React.useState<CartModel>();
  const [openDialogChangeOption, setOpenDialogChangeOption] =
    React.useState(false);

  React.useEffect(() => {
    if (!openDialogChangeOption && itemSelected) {
      setItemSelected(undefined);
    }
  }, [openDialogChangeOption]);

  const cart = useSelector((state: RootState) => state.cart.cart);

  const quantityRef = React.useRef(0);

  const dispatch = useDispatch();

  const handleChangeQuantity = async (cartItem_id: string) => {
    try {
      await patch(`/cart/update-quantity/${cartItem_id}`, {
        quantity: quantityRef.current,
      });
    } catch (error) {
      console.log(error);
    }
    quantityRef.current = 0;
  };

  const debounceChangeQuantity = React.useRef(
    lodash.debounce(
      (cartItem_id: string) => handleChangeQuantity(cartItem_id),
      600
    )
  ).current;

  const columns: ColumnDef<CartModel>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className=""
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "products",
      header: () => {
        return <div className="">Products</div>;
      },
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex items-center gap-3 py-2">
            <div className="w-16 h-16 bg-[#f1f1f3] dark:bg-neutral-600">
              {product.thumbnail || product.thumbnail_product ? (
                <img
                  src={product?.thumbnail || product?.thumbnail_product}
                  alt={product?.title}
                  className="w-full h-full object-cover rounded-xs"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Link
                href={"/shop/" + product?.slug}
                className="font-bold text-ellipsis line-clamp-1 hover:text-blue-400 transition-all duration-300"
              >
                {product?.title}
              </Link>
              {product.productType === "variations" &&
              product.options_info &&
              product.options_info.length > 0 ? (
                <p>
                  Options:{" "}
                  {product.options_info?.map((it) => it.title).join(", ")}
                </p>
              ) : (
                <>-</>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const item = row.original;
        if (
          item.discountedPrice !== null &&
          item.discountedPrice !== undefined
        ) {
          return (
            <div className="lowercase">{VND.format(item.discountedPrice)}</div>
          );
        }
        return (
          <div className="lowercase">{VND.format(row.getValue("price"))}</div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: () => <div className="">Quantity</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="font-medium">
            <div className="inline-flex items-center gap-2 border-2 border-black/60  rounded-lg px-2 dark:border-white/60">
              <Button
                variant={"link"}
                className=""
                style={{
                  padding: 0,
                }}
                disabled={item.quantity === 1}
                onClick={() => {
                  quantityRef.current -= 1;
                  debounceChangeQuantity(item.cartItem_id || "");
                  dispatch(
                    changeQuantity({
                      cartItem_id: item.cartItem_id,
                      quantity: -1,
                    })
                  );
                }}
              >
                <AiOutlineMinus size={20} />
              </Button>
              <div className="w-5 text-center">{row.getValue("quantity")}</div>
              <Button
                variant={"link"}
                style={{
                  padding: 0,
                }}
                onClick={() => {
                  quantityRef.current += 1;
                  debounceChangeQuantity(item.cartItem_id || "");
                  dispatch(
                    changeQuantity({
                      cartItem_id: item.cartItem_id,
                      quantity: 1,
                    })
                  );
                }}
                disabled={item.quantity >= Number(item.stock)}
              >
                <GoPlus size={20} />
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "subtotal",
      header: () => <div className="">Subtotal</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="font-medium">
            {item.discountedPrice !== undefined && item.discountedPrice !== null
              ? VND.format(item.quantity * item.discountedPrice)
              : VND.format(item.price * item.quantity)}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const items = row.original;

        return (
          <div className="flex items-center gap-4 justify-evenly">
            {items.productType === "variations" ? (
              <BiTransferAlt
                size={20}
                className="cursor-pointer"
                title="Change other options"
                onClick={() => {
                  setItemSelected(items);
                  setOpenDialogChangeOption(true);
                }}
              />
            ) : (
              <div></div>
            )}

            <DialogConfirm
              onConfirm={async () => {
                await del("/cart/delete", items.cartItem_id || "");
                dispatch(removeCartItem(items.cartItem_id));
                toast.success("Removed", {
                  description: "This item was be remove",
                  action: {
                    label: "Close",
                    onClick() {},
                  },
                  duration: 1000,
                });
              }}
            >
              <GoTrash size={18} color="red" className="cursor-pointer" />
            </DialogConfirm>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: cart.carts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setSelection,

    state: {
      rowSelection: selection,
    },
  });

  return (
    <>
      <div className="w-full">
        <div className="">
          <TableContainer className="min-h-100 max-h-109 overflow-y-auto">
            <Table className="relative">
              <TableHeader className="sticky top-0 left-0 bg-white z-20 dark:bg-neutral-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="py-5">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted bg-white/60 dark:bg-neutral-800/60"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="dark:text-white/80">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Cart is empty.{" "}
                      <Link
                        href={"/shop"}
                        className="underline hover:text-blue-400"
                      >
                        Shop now
                      </Link>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      {
        <DialogChangeOption
          open={openDialogChangeOption}
          setOpen={setOpenDialogChangeOption}
          items={itemSelected}
          onOK={(value) => {
            if (value) {
              dispatch(
                changeSubProduct({
                  cartItem_id: itemSelected?.cartItem_id,
                  subProduct: value,
                })
              );
              setOpenDialogChangeOption(false);
              setItemSelected(undefined);
            }
          }}
          onCancel={() => {
            setOpenDialogChangeOption(false);
            setItemSelected(undefined);
          }}
          carts={cart.carts}
        />
      }
    </>
  );
}
