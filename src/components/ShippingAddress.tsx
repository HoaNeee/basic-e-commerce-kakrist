/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";

import AddShippingAddress from "./AddShippingAddress";
import { del } from "@/utils/requets";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { AddressModel } from "@/models/addressModel";
import DialogConfirm from "./dialog/DialogConfirm";
import DialogEditAddress from "./dialog/DialogEditAddress";
import { toast } from "sonner";
import { MapPinPlus, Plus } from "lucide-react";

interface Props {
  onNext: (val: AddressModel) => void;
  addressList?: AddressModel[];
  onAddNew?: (val: AddressModel) => void;
  onEdit?: (val: AddressModel) => void;
  onDelete?: (val: AddressModel) => void;
  addressCheckedProp?: AddressModel;
}

const ShippingAddress = (props: Props) => {
  const {
    onNext,
    addressList,
    onAddNew,
    onEdit,
    onDelete,
    addressCheckedProp,
  } = props;
  const [addressChecked, setAddressChecked] = useState<AddressModel>();
  const [openDialogEditAddress, setOpenDialogEditAddress] = useState(false);
  const [addressSelected, setAddressSelected] = useState<AddressModel>();

  const addNewAddressElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!addressCheckedProp) {
      const itemCheck = addressList?.find(
        (item: AddressModel) => item.isDefault
      );
      if (itemCheck) {
        setAddressChecked(itemCheck);
      }
      return () => {};
    } else {
      setAddressChecked(addressCheckedProp);
    }
  }, [addressList, addressCheckedProp]);

  const handleDeleteAddress = async (item: AddressModel) => {
    try {
      const response = await del("/address/delete", item._id);
      if (item._id === addressChecked?._id) {
        if (response.data) {
          const other: AddressModel = response.data;

          const item = addressList?.find((it) => it._id === other._id);
          if (item) {
            setAddressChecked(item);
          }
        } else {
          const item = addressList?.find((it) => it.isDefault);
          if (item) {
            setAddressChecked(item);
          }
        }
      }

      toast(response.message, {
        description: "This item was be deleted",
        action: {
          label: "Close",
          onClick() {},
        },
      });

      if (onDelete) {
        onDelete(item);
      }
    } catch (error: any) {
      toast(error.message, {
        duration: 1000,
      });
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="my-6 space-y-2">
          <p className="font-bold text-lg">Select a delivery address</p>
          <p className="text-sm text-muted-foreground dark:text-white/60">
            Choose an address where you want to receive your order. If you do
            not have an address, please add a new address.
          </p>
        </div>
        {addressList && addressList?.length > 0 ? (
          <div className="py-4 border-b-2 border-muted">
            <div className=" grid lg:grid-cols-3 sm:grid-cols-2 py-6 grid-cols-1 gap-10">
              {addressList &&
                addressList?.length > 0 &&
                addressList.map((item) => (
                  <Label
                    key={item._id}
                    className="inline-block cursor-pointer w-full"
                  >
                    <Card className="gap-3 border-0 bg-[#FAFAFB] dark:bg-neutral-800">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {item.name || "No Name"}
                        </CardTitle>
                        <CardAction>
                          <Checkbox
                            checked={
                              item._id ===
                              (addressChecked && addressChecked._id)
                            }
                            className="border-2 size-5 border-black"
                            onCheckedChange={(e) => {
                              if (e) {
                                setAddressChecked(item);
                              }
                            }}
                          />
                        </CardAction>
                      </CardHeader>
                      <CardContent className="pb-2 tracking-wider leading-5">
                        {item.houseNo}, {item?.ward?.title},{" "}
                        {item?.district?.title}, {item?.city?.title}
                      </CardContent>
                      <CardFooter className="items-center gap-4 px-8 w-full grid grid-cols-2">
                        <Button
                          variant={"ghost"}
                          className="bg-[#f1f1f3] flex items-center hover:bg-neutral-200 dark:bg-neutral-600/90 dark:hover:bg-neutral-700"
                          onClick={() => {
                            setAddressSelected(item);
                            setOpenDialogEditAddress(true);
                          }}
                        >
                          <FaRegEdit />
                          <p className="text-xs">Edit</p>
                        </Button>
                        <DialogConfirm
                          onConfirm={() => {
                            handleDeleteAddress(item);
                          }}
                          description={
                            item.isDefault ? (
                              <span>
                                This address is your default address, are you
                                sure you still want to delete it? Choose other
                                your address default or{" "}
                                <span className="font-bold text-black dark:text-white">
                                  {"'continue'"}
                                </span>{" "}
                                if you want system to resolve.
                              </span>
                            ) : (
                              ""
                            )
                          }
                        >
                          <Button
                            className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:hover:bg-red-200"
                            variant={"ghost"}
                          >
                            <GoTrash />
                            <p className="text-xs">Delete</p>
                          </Button>
                        </DialogConfirm>
                      </CardFooter>
                    </Card>
                  </Label>
                ))}
            </div>
            <div className="w-1/3 mt-6 mb-4">
              <Button
                className="py-6 w-full"
                onClick={() => {
                  if (addressChecked) {
                    onNext(addressChecked);
                  }
                }}
                disabled={!addressChecked}
              >
                Deliver Here
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-16 flex items-center justify-center">
            <div className="flex flex-col w-full h-full items-center justify-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center dark:bg-neutral-600/90 dark:text-gray-300 text-gray-500">
                <MapPinPlus className="size-10 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">
                No address found
              </h3>
              <p className="text-center text-neutral-500 text-sm">
                Please add your address to continue checkout.
              </p>

              <Button
                className="mt-4"
                onClick={() => {
                  const element = addNewAddressElement.current;
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
              >
                <Plus className="size-4" />
                Add New Address
              </Button>
            </div>
          </div>
        )}
        <div className="py-4">
          <p className="font-bold" ref={addNewAddressElement}>
            Add a new address
          </p>
          <div className="w-full py-6">
            <AddShippingAddress
              onAddNew={(value) => {
                if (value.isDefault) {
                  setAddressChecked(value);
                }
                // setAddress([value, ...address]);
                if (onAddNew) {
                  onAddNew(value);
                }
              }}
            />
          </div>
        </div>
      </div>
      <DialogEditAddress
        open={openDialogEditAddress}
        setOpen={setOpenDialogEditAddress}
        onCancel={() => {
          setOpenDialogEditAddress(false);
        }}
        onOK={(val) => {
          if (onEdit && val) {
            onEdit(val);
          }
        }}
        address={addressSelected}
      />
    </>
  );
};

export default ShippingAddress;
