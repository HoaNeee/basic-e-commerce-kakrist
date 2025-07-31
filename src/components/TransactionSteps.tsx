/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { defineStepper } from "@/components/ui/stepper";
import { RiHome4Line } from "react-icons/ri";
import { MdPayment } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import ShippingAddress from "./ShippingAddress";
import { AddressModel } from "@/models/addressModel";
import { get, patch } from "@/utils/requets";
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
import { toast } from "sonner";
import ReviewOrder from "./ReviewOrder";
import { CartModel } from "@/models/cartModel";

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

interface Props {
  onNextStep?: (step: string, val?: any) => void;
  cartsCheckout?: CartModel[];
  isProceed?: boolean;
  setIsLoading?: (val: boolean) => void;
  transactionExists?: any;
}

export function TransactionSteps(props: Props) {
  const {
    onNextStep,
    cartsCheckout,
    isProceed,
    setIsLoading,
    transactionExists,
  } = props;

  const [openDialog, setOpenDialog] = useState(false);
  const [prevStep, setPrevStep] = useState<any>();
  const [clientWidth, setClientWidth] = useState(1280);
  const [transaction_info, setTransaction_info] = useState<any>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientWidth(window.innerWidth);
      window.addEventListener("resize", onWidthChange);
    }

    return () => {
      window.removeEventListener("resize", onWidthChange);
    };
  }, []);

  useEffect(() => {
    if (transactionExists) {
      console.log(transactionExists);
      setTransaction_info(transactionExists.transaction_info);
    }
  }, [transactionExists]);

  const onWidthChange = () => {
    setClientWidth(window.innerWidth);
  };

  const handleNextStep = async (
    step: string,
    key: string,
    val: any,
    methods: any
  ) => {
    try {
      setIsLoading?.(true);
      const payload = {
        ...transaction_info,
        [key]: val,
      };

      const api = `/transaction/change?action=next`;
      const response = await patch(api, {
        step,
        payload,
      });

      toast.success(response.message || "Success!", {
        description: "Let us proceed to the next step!",
      });

      if (onNextStep) {
        onNextStep(step, { [key]: val });
      }
      methods.goTo(step);
      setTransaction_info({
        ...transaction_info,
        [key]: val,
      });
      handleSetToLocalStorage(step, {
        [key]: val,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading?.(false);
    }
  };

  const handlePreviousStep = async (prevStep: string, methods: any) => {
    try {
      setIsLoading?.(true);
      if (prevStep) {
        const object: any = {
          address: null,
          payment: null,
        };

        const current_step = methods.current.id;

        if (current_step === "3") {
          if (prevStep === "2") {
            object.address = transaction_info.address;
            object.payment = null;
          }
        }
        const api = `/transaction/change?action=next`;
        const response = await patch(api, {
          prevStep,
          payload: object,
        });

        toast.success(response.message || "Success!");
        handleSetToLocalStorage(prevStep, object);
        setTransaction_info(object);
        methods.goTo(prevStep);
        if (onNextStep) {
          onNextStep(prevStep);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading?.(false);
    }
  };

  const handleSetToLocalStorage = (step: string, value: any) => {
    const transaction = localStorage.getItem("transaction");
    if (transaction) {
      const parsedTransaction = JSON.parse(transaction);
      if (parsedTransaction && parsedTransaction._id) {
        localStorage.setItem(
          "transaction",
          JSON.stringify({
            ...parsedTransaction,
            current_step: step,
            transaction_info: {
              ...parsedTransaction.transaction_info,
              ...value,
            },
          })
        );
      }
    }
  };

  return (
    isProceed && (
      <>
        <StepperProvider
          className="space-y-4 relative dark:text-white/80"
          variant={clientWidth < 640 ? "vertical" : "horizontal"}
          initialStep={transactionExists?.current_step?.toString() || "1"}
        >
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
                    step={step.id}
                    onNextStep={(id, val) => {
                      handleNextStep(id, "address", val, methods);
                      setTransaction_info({
                        ...transaction_info,
                        address: val,
                      });
                    }}
                    transactionExist={transactionExists}
                  />
                ),
                "2": (step) => (
                  <Content
                    step={step.id}
                    onNextStep={(id, val) => {
                      handleNextStep(id, "payment", val, methods);
                    }}
                    transactionExist={transactionExists}
                  />
                ),
                "3": (step) => (
                  <Content
                    step={step.id}
                    //FIX THIS
                    onNextStep={(id, val) => {
                      if (onNextStep) {
                        onNextStep(id, val);
                      }
                      methods.goTo(id);
                    }}
                    cartsCheckout={cartsCheckout}
                    transactionExist={transactionExists}
                  />
                ),
              })}
              <Dialog
                open={openDialog}
                setOpen={setOpenDialog}
                onOK={() => {
                  handlePreviousStep(prevStep, methods);
                }}
              />
            </>
          )}
        </StepperProvider>
      </>
    )
  );
}

interface StepProps {
  step: "1" | "2" | "3";
  onNextStep: (step: "1" | "2" | "3", val?: any) => void;
  cartsCheckout?: CartModel[];
  transactionExist?: any;
}

const Content = (props: StepProps) => {
  const { step, onNextStep, cartsCheckout, transactionExist } = props;
  const [address, setAddress] = useState<AddressModel[]>([]);
  const [addressChecked, setAddressChecked] = useState<AddressModel>();
  const [payment, setPayment] = useState<{
    method: string;
    status?: string;
  }>();

  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    if (transactionExist && transactionExist.transaction_info) {
      const { address, payment } = transactionExist.transaction_info;
      if (address) {
        setAddressChecked(address);
      }
      if (payment) {
        setPayment(payment);
      }
    }
  }, [transactionExist]);

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
            transform: `translateX(-${(Number(step) - 1) * 100}%)`,
          }}
        >
          <div
            className="min-w-full transition-all duration-500"
            style={{
              visibility: step !== "1" ? "hidden" : "visible",
              height: step !== "1" ? "0px" : "auto",
              pointerEvents: step !== "1" ? "none" : "auto",
            }}
          >
            <ShippingAddress
              addressCheckedProp={addressChecked}
              addressList={address}
              onNext={(val) => {
                setAddressChecked(val);
                onNextStep("2", val);
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
          <div
            className="min-w-full max-h-fit"
            style={{
              visibility: step !== "2" ? "hidden" : "visible",
              height: step !== "2" ? "0px" : "auto",
              pointerEvents: step !== "2" ? "none" : "auto",
            }}
          >
            <PaymentMethod
              onNext={(val) => {
                if (val.method === "cod") {
                  const object = {
                    method: val.method,
                    status: val.status || "pending",
                  };
                  setPayment(object);
                  onNextStep("3", object);
                } else if (val.method === "other_method") {
                  toast.info("This feature is updating...");
                }
              }}
            />
          </div>
          <div
            className="min-w-full max-h-fit"
            style={{
              visibility: step !== "3" ? "hidden" : "visible",
              height: step !== "3" ? "0px" : "auto",
              pointerEvents: step !== "3" ? "none" : "auto",
            }}
          >
            <ReviewOrder
              cartsCheckout={cartsCheckout}
              shippingAddress={addressChecked}
              payment={payment}
            />
          </div>
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
      <AlertDialogContent className="dark:text-white/80">
        <AlertDialogHeader>
          <AlertDialogTitle className="">
            Are you absolutely sure?
          </AlertDialogTitle>
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
