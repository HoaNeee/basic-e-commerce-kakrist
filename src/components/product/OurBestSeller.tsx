/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import React from "react";
import HeadContent from "../HeadContent";
import { ProductModel } from "@/models/productModel";
import CardProduct from "./CardProduct";

interface Props {
  products?: ProductModel[];
}

const OurBestSeller = (props: Props) => {
  const { products } = props;

  return (
    <div className="w-full h-full">
      <HeadContent title="Our Bestseller" />
      <div className="flex flex-wrap gap-6 w-full">
        {products &&
          products.map((item) => <CardProduct key={item._id} item={item} />)}
      </div>
    </div>
  );
};

export default OurBestSeller;
