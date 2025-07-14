import { get } from "@/utils/requets";
import React, { useEffect, useState } from "react";
import ReviewOrder from "./ReviewOrder";
import { OrderModel } from "@/models/orderModel";
import { Button } from "./ui/button";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface Props {
  order_id: string;
}

const OrderDetail = (props: Props) => {
  const { order_id } = props;

  const [order, setOrder] = useState<OrderModel>();

  const router = useRouter();

  useEffect(() => {
    getData();
    console.log(order_id);
  }, []);

  const getData = async () => {
    try {
      const response = await get("/orders/detail/" + order_id);
      setOrder(response.data);
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
      <ReviewOrder order={order} />
    </div>
  );
};

export default OrderDetail;
