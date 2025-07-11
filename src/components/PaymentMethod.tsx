import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import AddPaymentMethod from "./AddPaymentMethod";
import { get } from "@/utils/requets";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { PaymentMethodModel } from "@/models/paymentMethod";
import { Button } from "./ui/button";

interface Props {
  onNext: (val: {
    method: string;
    paymentChecked?: PaymentMethodModel;
  }) => void;
}

const PaymentMethod = (props: Props) => {
  const { onNext } = props;
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [payments, setPayments] = useState<PaymentMethodModel[]>([]);
  const [paymentChecked, setPaymentChecked] = useState<PaymentMethodModel>();

  useEffect(() => {
    if (paymentMethod !== "cod") {
      getPaymentMethod(paymentMethod);
    }
  }, [paymentMethod]);

  const getPaymentMethod = async (method: string) => {
    try {
      const response = await get(`/payments?method=${method}`);
      setPayments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-bold my-6">Select a payment method</h3>
      {
        <div
          className="mb-8 transition-all duration-500"
          style={{
            maxHeight: paymentMethod !== "cod" ? "300px" : "0px",
            visibility: paymentMethod !== "cod" ? "visible" : "hidden",
          }}
        >
          <div
            className="grid md:grid-cols-3 grid-cols-2 gap-6 transition-all duration-700"
            style={{
              opacity: paymentMethod !== "cod" ? "1" : "0",
            }}
          >
            {payments.length > 0 ? (
              payments.map((item) => (
                <Label
                  key={item._id}
                  className="inline-block cursor-pointer w-full"
                >
                  <Card className="gap-3 border-0 bg-neutral-100 my-shadow pb-8">
                    <CardHeader>
                      <CardTitle className="text-base uppercase text-ellipsis line-clamp-1">
                        {item.cardName || "No Name"}
                      </CardTitle>
                      <CardAction>
                        <Checkbox
                          checked={
                            item._id === (paymentChecked && paymentChecked._id)
                          }
                          className="border-2 size-5 border-black"
                          onCheckedChange={(e) => {
                            if (e) {
                              setPaymentChecked(item);
                            }
                          }}
                        />
                      </CardAction>
                    </CardHeader>
                    <CardContent className="pb-2 tracking-wider leading-5">
                      <p className="text-lg">{item.cardNumber}</p>
                    </CardContent>
                    <CardFooter className="items-center gap-4 w-full grid grid-cols-2 text-xs">
                      {/* <Button
                  variant={"ghost"}
                  className="bg-[#f1f1f3] flex items-center hover:bg-neutral-200"
                  onClick={() => {}}
                >
                  <FaRegEdit />
                  <p className="text-xs">Edit</p>
                </Button>
                <DialogConfirm onConfirm={() => {}}>
                  <Button
                    className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                    variant={"ghost"}
                  >
                    <GoTrash />
                    <p className="text-xs">Delete</p>
                  </Button>
                </DialogConfirm> */}
                      <p>
                        Expiry Date:{" "}
                        <span className="font-semibold">{item.expiryDate}</span>
                      </p>
                      <p>CVV: ●●●</p>
                    </CardFooter>
                  </Card>
                </Label>
              ))
            ) : (
              <div>NO data</div>
            )}
          </div>
        </div>
      }
      <div className="">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex gap-5 items-center border-b-2 border-muted pb-4">
            <RadioGroupItem
              value="cod"
              id="cod"
              classNameChildren="size-2.5 left-[calc(50%-0.5px)] -translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]"
              className="size-5 data-[state=checked]:border-2 data-[state=checked]:border-black"
            />
            <Label htmlFor="cod" className="text-lg font-bold">
              Cash on Delivery
            </Label>
          </div>

          <div className="border-b-2 border-muted pb-4">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-5">
                  <RadioGroupItem
                    value="credit"
                    id="credit"
                    className="size-5 data-[state=checked]:border-2 data-[state=checked]:border-black"
                    classNameChildren="size-2.5 left-[calc(50%-0.5px)] -translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]"
                  />
                  <CollapsibleTrigger asChild>
                    <Label htmlFor="credit" className="text-lg font-bold">
                      Debit/Credit Card
                    </Label>
                  </CollapsibleTrigger>
                </div>
              </CollapsibleTrigger>
              {paymentMethod !== "cod" && (
                <CollapsibleContent className="mt-3">
                  <AddPaymentMethod
                    onAddNew={(val) => {
                      setPayments([...payments, val]);
                      if (window) {
                        window.scroll({
                          top: 0,
                          behavior: "smooth",
                        });
                      }
                    }}
                  />
                </CollapsibleContent>
              )}
            </Collapsible>
          </div>
          <div className="md:w-1/4 sm:w-1/2 w-full mt-4">
            <Button
              className="w-full py-6"
              onClick={() => {
                onNext({
                  method: paymentMethod,
                  paymentChecked: paymentChecked,
                });
              }}
            >
              Continue
            </Button>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default PaymentMethod;
