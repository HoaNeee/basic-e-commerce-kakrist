import React from "react";
import { BsBox } from "react-icons/bs";
import { AiOutlineDollar } from "react-icons/ai";
import { RiHeadphoneLine } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";

const Shipping = () => {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-16">
      <div className="flex flex-col gap-3 justify-center">
        <BsBox size={25} fontWeight={800} strokeWidth={1} />
        <div className="flex flex-col gap-1">
          <p className="font-bold">Free Shipping</p>
          <p className="text-sm">Free Shipping for order above</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 justify-center">
        <AiOutlineDollar size={25} fontWeight={800} strokeWidth={1} />
        <div className="flex flex-col gap-1">
          <p className="font-bold">Money Guarantee</p>
          <p className="text-sm">Within 30 days for an exchange</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 justify-center">
        <RiHeadphoneLine size={25} fontWeight={800} strokeWidth={1} />
        <div className="flex flex-col gap-1">
          <p className="font-bold">Online Support</p>
          <p className="text-sm">24 hours a day, 7 days a week</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 justify-center">
        <MdOutlinePayment size={25} fontWeight={800} strokeWidth={0} />
        <div className="flex flex-col gap-1">
          <p className="font-bold">Flexible Payment</p>
          <p className="text-sm">Pay with multiple credit,cards</p>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
