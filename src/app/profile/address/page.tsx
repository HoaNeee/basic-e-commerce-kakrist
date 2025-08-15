/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DialogConfirm from "@/components/dialog/DialogConfirm";
import DialogEditAddress from "@/components/dialog/DialogEditAddress";
import LoadingComponent from "@/components/LoadingComponent";
import { Button } from "@/components/ui/button";
import { AddressModel } from "@/models/addressModel";
import { del, get } from "@/utils/requets";
import { MapPinPlus, PhoneCall, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { toast } from "sonner";

const Address = () => {
  const [address, setAddress] = useState<AddressModel[]>([]);
  const [openDialogAddress, setOpenDialogAddress] = useState(false);
  const [openDialogEditAddress, setOpenDialogEditAddress] = useState(false);
  const [addressSelected, setAddressSelected] = useState<AddressModel>();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLoaded(true);
    getAddress();
  }, []);

  useEffect(() => {
    if (!openDialogEditAddress && addressSelected) {
      setAddressSelected(undefined);
    }
  }, [openDialogEditAddress]);

  const getAddress = async () => {
    try {
      setLoading(true);
      const response = await get("/address");
      setAddress(response.data.address);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (item: AddressModel) => {
    try {
      setIsUpdating(true);
      const response = await del("/address/delete", item._id);

      if (response.data) {
        const other: AddressModel = response.data;

        const index = address?.findIndex((it) => it._id === other._id);
        if (index !== -1) {
          address[index].isDefault = true;
        }
      }
      setAddress(address.filter((it) => it._id !== item._id));

      toast(response.message, {
        description: "This item was be deleted",
        action: {
          label: "Close",
          onClick() {},
        },
      });
    } catch (error: any) {
      toast(error.message, {
        duration: 1000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!loaded || loading) {
    return (
      <div className="w-full h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-muted animate-pulse flex items-center justify-between w-full pb-5 border-b-2"
          >
            <div className="text-sm space-y-1.5">
              <div className="dark:bg-neutral-600/90 w-3/4 h-6 bg-gray-200 rounded"></div>
              <div className="dark:bg-neutral-600/90 w-full h-4 bg-gray-200 rounded"></div>
              <div className="dark:bg-neutral-600/90 w-1/2 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="dark:bg-neutral-600/90 w-full h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full">
        {address && address.length > 0 && (
          <div className="w-1/2">
            <Button className="py-6" onClick={() => setOpenDialogAddress(true)}>
              <Plus /> Add New Address
            </Button>
          </div>
        )}

        <div className="flex flex-col w-full gap-6 mt-8">
          {isUpdating && <LoadingComponent type="superScreen" />}
          {address && address.length > 0 ? (
            address.map((item) => (
              <div
                key={item._id}
                className="border-muted flex items-center justify-between w-full pb-5 border-b-2"
              >
                <div className="text-sm space-y-1.5">
                  <p className="text-base font-bold">
                    {item.name}{" "}
                    {item.isDefault ? (
                      <span className="text-muted-foreground">(default)</span>
                    ) : (
                      ""
                    )}
                  </p>
                  <p className="tracking-wider">
                    {item.houseNo}, {item.ward.title}, {item.district.title},{" "}
                    {item.city.title}{" "}
                  </p>
                  <p className="flex items-center gap-3">
                    <PhoneCall size={18} />
                    {item.phone}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
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
                    onConfirm={() => handleDeleteAddress(item)}
                    description={
                      item.isDefault ? (
                        <span>
                          This address is your default address, are you sure you
                          still want to delete it? Choose other your address
                          default or{" "}
                          <span className="dark:text-white font-bold text-black">
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
                      className="hover:bg-red-200 hover:text-red-700 dark:hover:bg-red-200 text-red-600 bg-red-100"
                      variant={"ghost"}
                    >
                      <GoTrash />
                      <p className="text-xs">Delete</p>
                    </Button>
                  </DialogConfirm>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="w-25 h-25 dark:bg-neutral-600/90 dark:text-gray-300 flex items-center justify-center mx-auto mb-4 text-gray-500 bg-gray-100 rounded-full">
                  <MapPinPlus className="size-13 mx-auto" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-center">
                  No address found
                </h3>
                <p className="text-neutral-500 text-center">
                  You can add your address to make checkout faster or here.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setOpenDialogAddress(true)}
                >
                  <Plus className="size-4" />
                  Add New Address
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <DialogEditAddress
        open={openDialogAddress}
        setOpen={setOpenDialogAddress}
        onCancel={() => setOpenDialogAddress(false)}
        onOK={(val) => {
          const items = [...address];
          if (val) {
            if (val?.isDefault) {
              for (const item of items) {
                item.isDefault = false;
              }
            }
            items.push(val);
            setAddress(items);
          }
        }}
        setIsUpdating={setIsUpdating}
      />

      <DialogEditAddress
        open={openDialogEditAddress}
        setOpen={setOpenDialogEditAddress}
        onCancel={() => {
          setAddressSelected(undefined);
          setOpenDialogEditAddress(false);
        }}
        onOK={(val) => {
          if (val) {
            const items = [...address];
            const index = items.findIndex((adr) => adr._id === val._id);
            const exist = items.find(
              (it) => it.isDefault && it._id !== val._id
            );
            if (val.isDefault && exist) {
              for (const item of items) {
                item.isDefault = false;
              }
            }

            if (index !== -1) {
              items[index] = {
                ...items[index],
                ...val,
              };
              setAddress(items);
            }
          }
        }}
        address={addressSelected}
        setIsUpdating={setIsUpdating}
      />
    </>
  );
};

export default Address;
