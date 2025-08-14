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
import { CartModel } from "@/models/cartModel";
import { addProduct } from "@/redux/reducer/cartReducer";
import { post } from "@/utils/requets";

interface Props {
  products?: ProductModel[];
}

const OurBestSeller = (props: Props) => {
  const { products } = props;

  const listFavorite = useSelector((state: RootState) => state.favorite.list);
  const auth = useSelector((state: RootState) => state.auth.auth);
  const cart = useSelector((state: RootState) => state.cart.cart);

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

  const handleCart = async (product: ProductModel) => {
    const next = `/shop/${product.slug}`;

    if (!auth.isLogin) {
      window.location.href = `/auth/login?next=${next}`;
      return;
    }

    try {
      const cartItem: CartModel = {
        cart_id: cart.cart_id,
        options: [],
        product_id: product?._id,
        price: Number(product?.price),
        discountedPrice: product?.discountedPrice,
        thumbnail: product?.thumbnail,
        quantity: 1,
        productType: "simple",
        title: product?.title,
        slug: product?.slug,
        SKU: product?.SKU || "",
      };
      const response = await post(
        `/cart/add-product/${cart.cart_id}`,
        cartItem
      );

      dispatch(
        addProduct({
          ...cartItem,
          cartItem_id: response.data.cartItem.cartItem_id,
        })
      );

      toast.success("Add product to cart success", {
        description: "Click to cart to see details!",
        action: {
          label: "Close",
          onClick: () => {},
        },
        duration: 1000,
      });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

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
              onAddToCart={() => {
                if (!auth.isLogin) {
                  window.location.href = `/auth/login?next=/shop/${item.slug}`;
                  return;
                }
                handleCart(item);
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default OurBestSeller;
