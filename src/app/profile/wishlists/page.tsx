"use client";

import CardProduct from "@/components/product/CardProduct";
import { ProductModel } from "@/models/productModel";
import { get } from "@/utils/requets";
import React, { useEffect, useState } from "react";

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
              className=""
              isListFavorite
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
