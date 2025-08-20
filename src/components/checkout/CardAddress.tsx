import { FaRegEdit } from "react-icons/fa";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import DialogConfirm from "../dialog/DialogConfirm";
import { GoTrash } from "react-icons/go";
import { AddressModel } from "@/models/addressModel";

const CardAddress = ({
  item,
  addressChecked,
  onChecked,
  onEdit,
  onDelete,
  isModal,
}: {
  item: AddressModel;
  addressChecked: AddressModel | undefined;
  onChecked: (address: AddressModel) => void;
  onEdit?: (address: AddressModel) => void;
  onDelete?: (address: AddressModel) => void;
  isModal?: boolean;
}) => {
  return (
    <Label key={item._id} className="inline-block cursor-pointer w-full">
      <Card className="gap-3 border-0 bg-[#FAFAFB] dark:bg-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg">{item.name || "No Name"}</CardTitle>
          <CardAction>
            <Checkbox
              checked={item._id === (addressChecked && addressChecked._id)}
              className="border-2 size-5 border-black"
              onCheckedChange={(e) => {
                if (e) {
                  onChecked(item);
                }
              }}
            />
          </CardAction>
        </CardHeader>
        <CardContent className="pb-2 tracking-wider leading-5">
          {item.houseNo}, {item?.ward?.title}, {item?.district?.title},{" "}
          {item?.city?.title}
        </CardContent>
        <CardFooter className="items-center gap-4 px-8 w-full grid grid-cols-2">
          <Button
            variant={"ghost"}
            className="bg-[#f1f1f3] flex items-center hover:bg-neutral-200 dark:bg-neutral-600/90 dark:hover:bg-neutral-700"
            onClick={() => {
              onEdit?.(item);
            }}
          >
            <FaRegEdit />
            <p className="text-xs">Edit</p>
          </Button>
          {!isModal && (
            <DialogConfirm
              onConfirm={() => {
                onDelete?.(item);
              }}
              description={
                item.isDefault ? (
                  <span>
                    This address is your default address, are you sure you still
                    want to delete it? Choose other your address default or{" "}
                    <span className="font-bold text-black dark:text-white">
                      {"'continue'"}
                    </span>{" "}
                    if you want system to resolve.
                  </span>
                ) : (
                  ""
                )
              }
            >
              <Button
                className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:hover:bg-red-200"
                variant={"ghost"}
              >
                <GoTrash />
                <p className="text-xs">Delete</p>
              </Button>
            </DialogConfirm>
          )}
        </CardFooter>
      </Card>
    </Label>
  );
};

export default CardAddress;
