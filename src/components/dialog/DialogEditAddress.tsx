/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { AddressModel } from "@/models/addressModel";
import AddShippingAddress from "../AddShippingAddress";

interface Props {
  onOK?: (val?: AddressModel) => void;
  open?: boolean;
  setOpen?: (val: boolean) => void;
  onCancel?: () => void;
  address?: AddressModel;
}

const DialogEditAddress = (props: Props) => {
  const { onOK, open, setOpen, onCancel, address } = props;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <div className="md:gap-0 gap-4">
          <AddShippingAddress
            onAddNew={(val) => {
              if (onOK) {
                onOK(val);
              }
            }}
            address={address}
            onClose={onCancel}
            isModal
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditAddress;
