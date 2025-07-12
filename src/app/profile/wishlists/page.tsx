/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CardProduct from "@/components/product/CardProduct";
import { ProductModel } from "@/models/productModel";
import { del, get } from "@/utils/requets";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const WishLists = () => {
  const [listFavoriteInfo, setListFavoriteInfo] = useState<ProductModel[]>([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      const response = await get("/favorites/info");
      setListFavoriteInfo(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveProduct = async (product_id: string) => {
    try {
      setListFavoriteInfo(
        listFavoriteInfo.filter((item) => item._id !== product_id)
      );

      const response = await del("/favorites/remove", product_id);
      toast.success(response.message, {
        description: "This product was be removed from wishlists",
        action: {
          label: "Close",
          onClick() {},
        },
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-full">
      {listFavoriteInfo.length > 0 ? (
        <div className="grid grid-cols-3 gap-5">
          {listFavoriteInfo.map((item) => (
            <CardProduct
              key={item._id}
              control
              item={item}
              onAddToCart={() => {}}
              className="xl:h-120"
              isListFavorite
              onToggleFavorite={() => handleRemoveProduct(item._id)}
            />
          ))}
        </div>
      ) : (
        <div>No data</div>
      )}
    </div>
  );
};

export default WishLists;
