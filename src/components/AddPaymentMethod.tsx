/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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
import ButtonLoading from "./ButtonLoading";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { post } from "@/utils/requets";
import { PaymentMethodModel } from "@/models/paymentMethod";

const formSchema = z.object({
  cardNumber: z
    .string()
    .min(1, {
      message: "Please enter this field!",
    })
    .max(13),
  cardName: z.string().min(1, {
    message: "Please enter this field!",
  }),
  expiryDate: z.string().transform((val: string, ctx) => {
    try {
      const error = " Expiry not correct, example: 02/29";
      if (!val) {
        throw Error("Please enter this field!");
      }
      if (!val.includes("/")) {
        throw Error(error);
      }
      const date = val.split("/");
      const month = date[0];
      const year = date[1];
      if (month.length !== 2) {
        throw Error(error);
      }
      if (year.length !== 2) {
        throw Error(error);
      }
      const newDate = new Date(`01/${val}`);
      const now = new Date();
      if (newDate.getTime() < now.getTime()) {
        throw Error("Time not correct");
      }
      return val;
    } catch (e: any) {
      ctx.addIssue({
        message: String(e.message || e),
        code: "custom",
      });

      return z.NEVER;
    }
  }),
  CVV: z
    .string()
    .min(1, {
      message: "Please enter this field!",
    })
    .max(3),
});

interface Props {
  onAddNew?: (val: PaymentMethodModel) => void;
}

const AddPaymentMethod = (props: Props) => {
  const { onAddNew } = props;

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",

      CVV: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await post("/payments/create", {
        ...values,
        method: "credit",
      });
      if (onAddNew) {
        onAddNew(response.data);
      }
    } catch (error: any) {
      toast.error(error.message, { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  function formatDate(date: Date | undefined) {
    if (!date) {
      return "";
    }
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function isValidDate(date: Date | undefined) {
    if (!date) {
      return false;
    }
    const newDate = new Date(date);
    return !isNaN(newDate.getTime());
  }

  return (
    <div className="m-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => {
              return (
                <FormItem className="md:w-1/2 w-full">
                  <FormLabel className="text-xs">Card Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="py-5"
                      placeholder="Enter card number"
                      name="cardNumber"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="cardName"
            render={({ field }) => {
              return (
                <FormItem className="md:w-1/2 w-full">
                  <FormLabel className="text-xs">Card Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="py-5"
                      placeholder="Enter card name"
                      name="cardName"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex items-center gap-4 md:flex-row flex-col md:w-1/2 w-full">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => {
                return (
                  <FormItem className="md:w-1/2 w-full">
                    <FormLabel className="text-xs">Expiry Date</FormLabel>

                    <FormControl>
                      <div className="flex gap-2 relative">
                        <Input
                          {...field}
                          className="py-5 pr-10"
                          placeholder="Example: 02/29"
                          name="expiryDate"
                        />
                        <CalendarIcon
                          size={18}
                          className="absolute top-1/2 right-2 -translate-y-1/2"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />{" "}
            <FormField
              control={form.control}
              name="CVV"
              render={({ field }) => {
                return (
                  <FormItem className="md:w-1/2 w-full">
                    <FormLabel className="text-xs">CVV</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="py-5"
                        placeholder="Enter CVV"
                        name="CVV"
                        type="password"
                        maxLength={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="w-1/4">
            <ButtonLoading
              loading={isLoading}
              className="w-full py-6"
              onClick={() => {}}
            >
              Add Card
            </ButtonLoading>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddPaymentMethod;
