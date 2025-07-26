/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import React from "react";
import HeadContent from "../HeadContent";
import { ProductModel } from "@/models/productModel";
import CardProduct from "./CardProduct";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  handleToggleFavorite,
  listFavoriteToggle,
  toggleProduct,
} from "@/redux/reducer/favoriteReducer";
import lodash from "lodash";
import { toast } from "sonner";

interface Props {
  products?: ProductModel[];
}

const OurBestSeller = (props: Props) => {
  const { products } = props;

  const listFavorite = useSelector((state: RootState) => state.favorite.list);
  const auth = useSelector((state: RootState) => state.auth.auth);

  const dispatch = useDispatch();

  const handleFavorite = async (product_id: string) => {
    if (!auth.isLogin) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      dispatch(toggleProduct(product_id));
      const list = listFavoriteToggle(listFavorite, product_id);
      debounceToggleFavorite(list);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const debounceToggleFavorite = React.useRef(
    lodash.debounce((list: string[]) => handleToggleFavorite(list), 500)
  ).current;

  return (
    <div className="w-full h-full">
      <HeadContent title="Our Bestseller" />
      <div className="flex flex-wrap gap-6 w-full">
        {products &&
          products.map((item) => (
            <CardProduct
              key={item._id}
              item={item}
              favorited={listFavorite.includes(item._id)}
              onToggleFavorite={() => handleFavorite(item._id)}
            />
          ))}
      </div>
    </div>
  );
};

export default OurBestSeller;
