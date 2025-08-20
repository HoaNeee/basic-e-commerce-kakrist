import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ShoppingBagIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open?: boolean;
  setOpen?: (val: boolean) => void;
  title?: string;
  description?: string;
  actionText?: string;
  isChangePassword?: boolean;
  icon?: React.ReactNode;
  onAction?: () => void;
}

const DialogCheckoutSuccess = (props: Props) => {
  const {
    open,
    setOpen,
    title,
    description,
    actionText,
    isChangePassword,
    icon,
    onAction,
  } = props;

  const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={setOpen} defaultOpen={false}>
      <AlertDialogContent className="dark:text-white/80">
        <AlertDialogHeader className="items-center justify-center max-w-sm mx-auto">
          <div className="text-white h-14 w-14 flex items-center justify-center rounded-full bg-[#131118] my-checkout-success my-5">
            <div className="w-full h-full absolute justify-center flex items-center bg-[#131118] rounded-full">
              {icon || <ShoppingBagIcon size={20} />}
            </div>
            <div className="circle-1" />
            <div className="circle-2" />
          </div>
          <AlertDialogTitle>
            <p>{title || "Your Order is confirmed"}</p>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center tracking-wider leading-5.5">
            {description ||
              "Thanks for shopping! your order hasn't shipped yet, but we will send you and email when it done."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="">
          <div className="flex flex-col w-full gap-3 px-4">
            <AlertDialogAction
              className="py-6"
              onClick={
                onAction
                  ? onAction
                  : () => {
                      router.replace("/profile/orders", { scroll: true });
                    }
              }
            >
              {actionText || "View Order"}
            </AlertDialogAction>
            {!isChangePassword && (
              <AlertDialogCancel
                className="py-6"
                onClick={() => {
                  router.replace("/");
                }}
              >
                Back to Home
              </AlertDialogCancel>
            )}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogCheckoutSuccess;
