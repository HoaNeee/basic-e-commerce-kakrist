import { get } from "@/utils/requets";
import React, { useEffect, useState } from "react";
import ReviewOrder from "./ReviewOrder";
import { BillModel } from "@/models/billModel";
import { Button } from "./ui/button";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface Props {
  order_id: string;
}

const OrderDetail = (props: Props) => {
  const { order_id } = props;

  const [bill, setBill] = useState<BillModel>();

  const router = useRouter();

  useEffect(() => {
    getData();
    console.log(order_id);
  }, []);

  const getData = async () => {
    try {
      const response = await get("/bills/detail/" + order_id);
      setBill(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full">
      <div>
        <Button variant={"outline"} onClick={() => router.back()}>
          <IoArrowBack />
        </Button>
      </div>
      <ReviewOrder bill={bill} />
    </div>
  );
};

export default OrderDetail;
