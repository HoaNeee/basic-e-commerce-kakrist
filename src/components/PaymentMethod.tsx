import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface Props {
  onNext: (val: { method: string; status?: string }) => void;
}

const PaymentMethod = (props: Props) => {
  const { onNext } = props;
  const [paymentMethod, setPaymentMethod] = useState("cod");

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-bold my-6">Select a payment method</h3>

      <div className="">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex gap-5 items-center border-b-2 border-muted pb-4 dark:border-b-white">
            <RadioGroupItem
              value="cod"
              id="cod"
              className="h-5 w-5 [&_svg]:h-3.5 [&_svg]:w-3.5 data-[state=checked]:border-2 data-[state=checked]:border-black "
            />
            <Label htmlFor="cod" className="text-lg font-bold">
              Cash on Delivery
            </Label>
          </div>

          <div className="md:w-1/4 sm:w-1/2 w-full mt-4">
            <Button
              className="w-full py-6"
              onClick={() => {
                onNext({
                  method: paymentMethod,
                  status: "pending",
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
