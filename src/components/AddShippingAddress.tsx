/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { patch, post } from "@/utils/requets";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";
import { AddressModel } from "@/models/addressModel";
import { DialogClose, DialogFooter } from "./ui/dialog";
import ButtonLoading from "./ButtonLoading";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter this field!",
  }),
  phone: z.string().min(1, {
    message: "Please enter this field!",
  }),
  houseNo: z.string().min(1, {
    message: "Please enter this field!",
  }),
  city: z.string({
    message: "Please select your city",
  }),
  district: z.string({
    message: "Please select your district",
  }),
  ward: z.string({
    message: "Please select your ward",
  }),
  isDefault: z.any(),
});

interface SelectModel {
  title: string;
  value: string;
}

interface Props {
  onAddNew?: (val: AddressModel) => void;
  address?: AddressModel;
  onClose?: () => void;
  isModal?: boolean;
  setIsUpdatingProp?: (val: boolean) => void;
}

const AddShippingAddress = ({
  onAddNew,
  address,
  onClose,
  isModal,
  setIsUpdatingProp,
}: Props) => {
  const [dataSelect, setDataSelect] = useState<{
    cities: SelectModel[];
    districts?: SelectModel[];
    wards?: SelectModel[];
  }>();
  const [valueChoosed, setValueChoosed] = useState<{
    city?: SelectModel;
    district?: SelectModel;
    ward?: SelectModel;
  }>();
  const [isUpdating, setIsUpdating] = useState(false);

  const auth = useSelector((state: RootState) => state.auth.auth);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: address
      ? {
          name: address.name,
          phone: address?.phone,
          houseNo: address?.houseNo,
          city: address?.city?.value,
          district: address?.district?.value,
          ward: address?.ward?.value,
          isDefault: address?.isDefault,
        }
      : {
          name:
            auth.firstName && auth.lastName
              ? `${auth.firstName} ${auth.lastName}`
              : "",
          phone: auth.phone ? auth.phone : "",
          city: undefined,
          district: undefined,
          ward: undefined,
          houseNo: "",
          isDefault: false,
        },
  });

  useEffect(() => {
    fetchCity();
  }, []);

  const fetchCity = async () => {
    const res = await getDataAddress("provinces");

    const data = res?.data?.map((item: any) => {
      return {
        title: item.name,
        value: item.id,
      };
    });

    if (address && address?.district?.value && address?.ward?.value) {
      const promiseAll = await Promise.all([
        await getDataAddress(`districts/${address.city.value}`),
        await getDataAddress(`wards/${address.district.value}`),
      ]);
      const [districts, wards] = promiseAll;
      setDataSelect({
        cities: [...data],
        districts: districts.data.map((item: any) => {
          return {
            title: item.name,
            value: item.id,
          };
        }),
        wards: wards.data.map((item: any) => {
          return {
            title: item.name,
            value: item.id,
          };
        }),
      });
      setValueChoosed({
        city: address.city,
        district: address.district,
        ward: address.ward,
      });
    } else {
      setDataSelect({
        cities: [...data],
      });
    }
  };

  const getDataAddress = async (keyUrl: string) => {
    try {
      const res = await fetch(
        `https://open.oapi.vn/location/${keyUrl}?page=0&size=100`
      );
      const result = await res.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema> | any) => {
    const payload = {
      ...values,
      ...valueChoosed,
    };

    payload.isDefault = payload.isDefault || false;

    setIsUpdating(true);
    setIsUpdatingProp?.(true);
    try {
      if (address) {
        const response = await patch("/address/edit/" + address?._id, payload);
        toast.success(response.message, {
          description: "Updated address success",
          action: {
            label: "Close",
            onClick() {},
          },
          position: "top-center",
        });
        if (onClose) {
          onClose();
        }
        if (onAddNew) {
          onAddNew({
            ...address,
            ...values,
            ...valueChoosed,
          });
        }

        return;
      }
      const response = await post("/address/create", payload);

      form.resetField("name");
      form.resetField("phone");
      form.resetField("houseNo");

      if (onClose) {
        onClose();
      }

      toast.success(response.message, {
        description: "Created new address success",
        action: {
          label: "Close",
          onClick() {},
        },
        position: "top-center",
      });

      if (!isModal) {
        window.scroll({
          top: 0,
          behavior: "smooth",
        });
      }
      if (onAddNew) {
        onAddNew(response.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
      setIsUpdatingProp?.(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-6"
        >
          <div className="md:grid-cols-2 grid items-center w-full grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="py-5"
                        placeholder="Your Name"
                        name="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Mobile phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="py-5"
                        placeholder="Your Phone"
                        name="phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <FormField
            control={form.control}
            name="houseNo"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-sm">House No</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="py-5"
                      placeholder="Your House No"
                      name="houseNo"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={async (e) => {
                    try {
                      const res = await getDataAddress("districts/" + e);
                      const data = res?.data?.map((item: any) => {
                        return {
                          title: item.name,
                          value: item.id,
                        };
                      });

                      setDataSelect({
                        cities: [...(dataSelect?.cities || [])],
                        districts: [...data],
                      });
                      field.onChange(e);

                      const item = dataSelect?.cities.find(
                        (it) => it.value === e
                      );

                      setValueChoosed({
                        city: {
                          title: item?.title || "",
                          value: e,
                        },
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  defaultValue={field.value}
                  name="city"
                >
                  <FormControl>
                    <SelectTrigger className="w-full py-5">
                      <SelectValue placeholder="Select a your city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-78">
                    {dataSelect &&
                      dataSelect?.cities &&
                      dataSelect.cities.map((item, index) => (
                        <SelectItem value={item.value} key={index}>
                          {item.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {dataSelect &&
            dataSelect?.districts &&
            dataSelect?.districts.length > 0 && (
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>District</FormLabel>
                    <Select
                      onValueChange={async (e) => {
                        try {
                          const res = await getDataAddress("wards/" + e);
                          const data = res?.data?.map((item: any) => {
                            return {
                              title: item.name,
                              value: item.id,
                            };
                          });

                          setDataSelect({
                            cities: [...(dataSelect?.cities || [])],
                            districts: [...(dataSelect?.districts || [])],
                            wards: [...data],
                          });
                          field.onChange(e);

                          const item = dataSelect?.districts?.find(
                            (it) => it.value === e
                          );

                          setValueChoosed({
                            city: {
                              ...(valueChoosed?.city || {
                                title: "",
                                value: "",
                              }),
                            },
                            district: {
                              title: item?.title || "",
                              value: e,
                            },
                          });
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                      defaultValue={field.value}
                      name="district"
                      disabled={
                        !dataSelect?.districts ||
                        dataSelect?.districts?.length <= 0
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full py-5">
                          <SelectValue placeholder="Select a your district" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {dataSelect?.districts?.map((item, index) => (
                          <SelectItem value={item.value} key={index}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          {dataSelect && dataSelect?.wards && dataSelect?.wards?.length > 0 && (
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Ward</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      const item = dataSelect?.wards?.find(
                        (it) => it.value === e
                      );

                      setValueChoosed({
                        city: {
                          ...(valueChoosed?.city || { title: "", value: "" }),
                        },
                        district: {
                          ...(valueChoosed?.district || {
                            title: "",
                            value: "",
                          }),
                        },
                        ward: {
                          title: item?.title || "",
                          value: e,
                        },
                      });
                      field.onChange(e);
                    }}
                    defaultValue={field.value}
                    name="ward"
                    disabled={
                      !dataSelect?.wards || dataSelect?.wards?.length <= 0
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full py-5">
                        <SelectValue placeholder="Select a your ward" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dataSelect?.wards?.map((item, index) => (
                        <SelectItem value={item.value} key={index}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => {
              return (
                <FormItem {...field} className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      defaultChecked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>
                    Use as my default address {!isModal && "and select it"}
                  </FormLabel>
                </FormItem>
              );
            }}
          />

          {!address && !isModal ? (
            <div className="sm:w-1/3 w-1/2">
              <ButtonLoading
                loading={isUpdating}
                type="submit"
                typeLoading={1}
                className="w-full"
              >
                Add new address
              </ButtonLoading>
            </div>
          ) : (
            (isModal || address) && (
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"outline"} type="button">
                    Cancel
                  </Button>
                </DialogClose>

                <ButtonLoading
                  loading={isUpdating}
                  onClick={() => {}}
                  styles={{
                    padding: "0 30px",
                  }}
                >
                  Save
                </ButtonLoading>
              </DialogFooter>
            )
          )}
        </form>
      </Form>
    </div>
  );
};

export default AddShippingAddress;
