/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PaginationComponent from "@/components/PaginationComponent";
import CardProduct from "@/components/product/CardProduct";
import CardSkeleton from "@/components/product/CardSkeleton";
import { ProductModel } from "@/models/productModel";
import { del, get } from "@/utils/requets";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const WishLists = () => {
  const [listFavoriteInfo, setListFavoriteInfo] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);

  const limit = 9;
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "";

  useEffect(() => {
    getList();
  }, [searchParams]);

  const getList = async () => {
    try {
      setIsLoading(true);
      const api = `/favorites/info?page=${page || 1}&limit=${limit}`;
      const response = await get(api);
      setTotalPage(response.data.totalPage);
      setListFavoriteInfo(response.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="grid xl:grid-cols-3 grid-cols-2 gap-5">
        {Array.from({ length: limit }).map((_, index) => (
          <CardSkeleton key={index} control className="xl:h-120" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {!isLoading && (
        <>
          {listFavoriteInfo.length > 0 ? (
            <div className="grid xl:grid-cols-3 grid-cols-2 gap-5">
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
        </>
      )}
      <PaginationComponent totalPage={totalPage} />
    </div>
  );
};

export default WishLists;
