/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";

import { defineStepper } from "@/components/ui/stepper";
import { RiHome4Line } from "react-icons/ri";
import { MdPayment } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import ShippingAddress from "./ShippingAddress";
import { AddressModel } from "@/models/addressModel";
import { get } from "@/utils/requets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import PaymentMethod from "./PaymentMethod";

const {
  StepperProvider,

  StepperNavigation,
  StepperPanel,
  StepperStep,
  StepperTitle,
} = defineStepper(
  {
    id: "1",
    title: "Address",
    icon: <RiHome4Line className="size-6" />,
  },
  {
    id: "2",
    title: "Payment",
    icon: <MdPayment className="size-6" />,
  },
  {
    id: "3",
    title: "Review",
    icon: <VscPreview className="size-6" />,
  }
);

export function TransactionSteps() {
  const [openDialog, setOpenDialog] = useState(false);
  const [prevStep, setPrevStep] = useState<any>();
  return (
    <>
      <StepperProvider className="space-y-4 relative" variant="horizontal">
        {({ methods }) => (
          <>
            <StepperNavigation>
              {methods.all.map((step) => (
                <StepperStep
                  key={step.id}
                  of={step.id}
                  onClick={() => {
                    const current = methods.current;
                    if (current.id > step.id) {
                      setPrevStep(step.id);
                      setOpenDialog(true);
                    }

                    // console.log(step)
                  }}
                  icon={<div className="">{step.icon}</div>}
                >
                  <StepperTitle>{step.title}</StepperTitle>
                </StepperStep>
              ))}
            </StepperNavigation>
            {methods.switch({
              "1": (step) => (
                <Content
                  id={step.id}
                  onNextStep={(id) => {
                    methods.goTo(id);
                  }}
                />
              ),
              "2": (step) => <Content id={step.id} />,
              "3": (step) => <Content id={step.id} />,
            })}
            <Dialog
              open={openDialog}
              setOpen={setOpenDialog}
              onOK={() => {
                if (prevStep) {
                  methods.goTo(prevStep);
                }
              }}
            />
          </>
        )}
      </StepperProvider>
    </>
  );
}

interface StepProps {
  id: "1" | "2" | "3";
  onNextStep?: (id: "1" | "2" | "3") => void;
}

const Content = (props: StepProps) => {
  const { id, onNextStep } = props;
  const [address, setAddress] = useState<AddressModel[]>([]);
  const [addressChecked, setAddressChecked] = useState<AddressModel>();

  useEffect(() => {
    getAddress();
  }, []);

  const getAddress = async () => {
    try {
      const response = await get("/address");
      setAddress(response.data.address);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StepperPanel className="min-h-[200px] overflow-hidden">
      {
        <div
          className="w-full relative flex flex-nowrap transition-all duration-300 max-h-fit"
          style={{
            transform: `translateX(-${(Number(id) - 1) * 100}%)`,
          }}
        >
          <div
            className="min-w-full transition-all duration-500"
            style={{
              visibility: id !== "1" ? "hidden" : "visible",
              height: id !== "1" ? "0px" : "auto",
            }}
          >
            <ShippingAddress
              addressCheckedProp={addressChecked}
              addressList={address}
              onNext={(val) => {
                setAddressChecked(val);
                if (onNextStep) {
                  onNextStep("2");
                }
              }}
              onAddNew={(val) => {
                setAddress([val, ...address]);
              }}
              onDelete={(val) => {
                setAddress(address.filter((it) => it._id !== val._id));
              }}
              onEdit={(val) => {
                const items = [...address];
                const index = items.findIndex((item) => item._id === val?._id);

                if (index !== -1 && val) {
                  items[index] = {
                    ...val,
                  };
                  setAddress(items);
                }
              }}
            />
          </div>
          <div className="min-w-full max-h-fit">
            <PaymentMethod />
          </div>
          <div className="min-w-full bg-red-500">Reviews</div>
        </div>
      }
    </StepperPanel>
  );
};

const Dialog = ({
  open,
  setOpen,
  onOK,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  onOK: () => void;
}) => {
  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {
              "This action cannot be undone. Your change won't be save and you can't return current step."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onOK}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
