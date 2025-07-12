import DialogConfirm from "@/components/dialog/DialogConfirm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { GoTrash } from "react-icons/go";

const CreditCard = () => {
  return (
    <div className="w-full h-full">
      <div className="w-1/2">
        <Button className="py-6">
          <Plus /> Add New Card
        </Button>
      </div>
      {/* <div className="w-full flex flex-col gap-6 mt-8">
        <div className="w-full pb-5 border-b-2 border-muted flex items-center justify-between">
          <div className=""></div>
          <div className="">
            <DialogConfirm onConfirm={() => {}}>
              <Button
                className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                variant={"ghost"}
              >
                <GoTrash />
                <p className="text-xs">Delete</p>
              </Button>
            </DialogConfirm>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default CreditCard;
