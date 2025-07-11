/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ButtonLoading from "@/components/ButtonLoading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/redux/store";
import { ScanEye, Trash2, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { BiEdit } from "react-icons/bi";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GrMap } from "react-icons/gr";
import { get, patch, postImage } from "@/utils/requets";
import { AddressModel } from "@/models/addressModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { addAuth } from "@/redux/reducer/authReducer";
import { RiImageEditLine } from "react-icons/ri";

const formSchema = z.object({
  firstName: z.any(),
  lastName: z.any(),
  email: z
    .string({
      message: "Please enter this field!",
    })
    .email(),
  phone: z.string().min(1, {
    message: "Please enter this field!",
  }),
});

const Profile = () => {
  // const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [addressDefault, setAddressDefault] = useState<AddressModel>();
  const [avatar, setAvatar] = useState<File>();
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);

  const auth = useSelector((state: RootState) => state.auth.auth);
  const dispatch = useDispatch();
  const inpFileRef = useRef<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: auth.isLogin
      ? {
          firstName: auth.firstName || "",
          lastName: auth.lastName || "",
          email: auth.email || "",
          phone: auth.phone
            ? auth.phone
            : addressDefault
            ? addressDefault.phone
            : "",
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        },
  });

  useEffect(() => {
    getAddressDefault();
  }, []);

  useEffect(() => {
    if (auth.isLogin) {
      form.setValue("firstName", auth.firstName);
      form.setValue("lastName", auth.lastName);
      form.setValue("email", auth.email);
      form.setValue("phone", auth.phone);
    }
  }, [auth]);

  const getAddressDefault = async () => {
    try {
      const response = await get("/address/default");
      if (response.data) {
        setAddressDefault(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema> | any) => {
    try {
      setIsUpdating(true);
      const data: any = {};
      for (const key in values) {
        data[`${key}`] = values[key] || "";
      }

      if (avatar) {
        const responseUrl = await postImage("thumbnail", avatar);
        if (responseUrl.data) {
          data.avatar = responseUrl.data;
        }
      }

      data.firstName = data.firstName ?? auth.firstName ?? "";
      data.lastName = data.lastName ?? auth.lastName ?? "";

      const response = await patch("/auth/profile/edit", data);
      toast.success(response.message, {
        position: "top-center",
        action: {
          label: "Close",
          onClick() {},
        },
      });
      dispatch(
        addAuth({
          ...auth,
          ...data,
        })
      );
      if (inpFileRef.current) {
        inpFileRef.current.value = "";
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setIsUpdating(true);
      const response = await patch("/auth/profile/edit", { avatar: "" });
      toast.success(response.message, {
        position: "top-center",
        duration: 1500,
      });
      const data = {
        ...auth,
        avatar: "",
      };
      dispatch(addAuth(data));
      if (inpFileRef.current) {
        inpFileRef.current.value = "";
      }
      if (avatar) {
        setAvatar(undefined);
      }
      setOpenDialogConfirm(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="relative">
              <input
                ref={inpFileRef}
                type="file"
                accept="image/*"
                hidden
                id="avatar-picker"
                onChange={(e) => {
                  if (e.target.files) {
                    setAvatar(e.target.files[0]);
                  }
                }}
              />
              <Avatar className="w-17 h-17">
                {
                  <AvatarImage
                    src={
                      avatar
                        ? URL.createObjectURL(avatar)
                        : auth.avatar
                        ? auth.avatar
                        : undefined
                    }
                    alt="avatar"
                  />
                }
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant={"default"}
                      size={"sm"}
                      className="h-6 w-6 rounded-sm flex items-center justify-center relative"
                    >
                      <div className="absolute w-full h-full justify-center items-center flex">
                        <BiEdit size={12} className="size-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className="">Avatar</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled={!auth.avatar}>
                      <ScanEye />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Label htmlFor="avatar-picker" className="w-full h-full">
                        <RiImageEditLine />
                        {!auth.avatar ? "Add" : "Change"} Image
                      </Label>
                    </DropdownMenuItem>
                    {auth.avatar && (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setOpenDialogConfirm(true)}
                      >
                        <Trash2 className="text-destructive" />
                        Remove
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="">
              <ButtonLoading
                onClick={() => {}}
                typeLoading={1}
                loading={isUpdating}
              >
                <FiEdit className="size-5" />
                <p>Edit Profile</p>
              </ButtonLoading>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-0">
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full gap-0.5">
                      <FormLabel className="tracking-wider text-xs">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="py-5"
                          placeholder="Your First Name"
                          {...field}
                          name="firstName"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full gap-0.5">
                      <FormLabel className="tracking-wider text-xs">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="py-5"
                          placeholder="Your Last Name"
                          name="lastName"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex gap-4 items-center mt-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full gap-0.5">
                      <FormLabel className="tracking-wider text-xs">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="py-5"
                          placeholder="Your Phone Number"
                          name="phone"
                          type="text"
                        />
                      </FormControl>
                      <div className="h-3 mt-1">
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full gap-0.5">
                      <FormLabel className="tracking-wider text-xs">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="py-5"
                          placeholder="Your Email Address"
                          name="email"
                        />
                      </FormControl>
                      <div className="h-3 mt-1">
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex flex-col gap-0.5 mt-3">
              <Label className="text-xs tracking-wider">Address</Label>
              <div className="flex items-center relative">
                <Input
                  placeholder="Your address default"
                  className="py-5 pr-10"
                  disabled
                  defaultValue={
                    addressDefault
                      ? `${addressDefault?.houseNo}, ${addressDefault.ward.title}, ${addressDefault.district.title}, ${addressDefault.city.title}`
                      : ""
                  }
                />
                <GrMap
                  className="absolute top-1/2 right-3 -translate-y-1/2 size-5 cursor-pointer"
                  title="Change address default"
                  onClick={() => {
                    console.log("change");
                  }}
                />
              </div>
            </div>
          </div>{" "}
        </form>
      </Form>

      <AlertDialog onOpenChange={setOpenDialogConfirm} open={openDialogConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Are you absolutely sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {
                "This action cannot be undone. This will permanently delete your data from our servers."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <ButtonLoading
              typeLoading={1}
              onClick={handleDeleteImage}
              className="py-4"
              loading={isUpdating}
            >
              Continue
            </ButtonLoading>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
