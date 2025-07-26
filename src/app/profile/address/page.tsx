/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DialogConfirm from "@/components/dialog/DialogConfirm";
import DialogEditAddress from "@/components/dialog/DialogEditAddress";
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
      const response = await del("/address/delete", item._id);

      if (response.data) {
        const other: AddressModel = response.data;

        const index = address?.findIndex((it) => it._id === other._id);
        if (index !== -1) {
          address[index].isDefault = true;
        }
        setAddress(address.filter((it) => it._id !== item._id));
      }

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
    }
  };

  if (!loaded || loading) {
    return (
      <div className="w-full h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="w-full pb-5 border-b-2 border-muted flex items-center justify-between animate-pulse"
          >
            <div className="text-sm space-y-1.5">
              <div className="h-6 bg-gray-200 dark:bg-neutral-600/90 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-neutral-600/90 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-neutral-600/90 rounded w-1/2"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-8 bg-gray-200 dark:bg-neutral-600/90 rounded w-full"></div>
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
        <div className="w-full flex flex-col gap-6 mt-8">
          {address && address.length > 0 ? (
            address.map((item) => (
              <div
                key={item._id}
                className="w-full pb-5 border-b-2 border-muted flex items-center justify-between"
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
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 flex items-center justify-center">
              <div className="flex flex-col w-full h-full items-center justify-center">
                <div className="w-25 h-25 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center dark:bg-neutral-600/90 dark:text-gray-300">
                  <MapPinPlus className="size-13 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">
                  No address found
                </h3>
                <p className="text-center text-neutral-500">
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
      />

      <DialogEditAddress
        open={openDialogEditAddress}
        setOpen={setOpenDialogEditAddress}
        onCancel={() => {
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
      />
    </>
  );
};

export default Address;
