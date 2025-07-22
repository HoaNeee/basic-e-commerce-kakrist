import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import { AiFillWarning } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";

interface Props {
  open?: boolean;
  setOpen: (val: boolean) => void;
  title?: string;
  description?: string;
  type?: "warning" | "error" | "success";
}

const MyAlertDialog = (props: Props) => {
  const { open, setOpen, title, description, type } = props;

  const typeIcon = (type = "warning") => {
    switch (type) {
      case "error":
        return <MdError size={20} />;
      case "success":
        return <FaCheckCircle size={20} />;
      case "warning":
        return <AiFillWarning size={20} />;
      default:
        return <AiFillWarning size={20} />;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen} defaultOpen={false}>
      <AlertDialogContent className="dark:text-white/80">
        <AlertDialogHeader className="">
          <AlertDialogTitle>
            <div className="flex gap-2 items-center">
              {typeIcon(type)}
              <p>{title || "Warning"}</p>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription className="">
            {description || "No products selected!"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="">
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MyAlertDialog;
