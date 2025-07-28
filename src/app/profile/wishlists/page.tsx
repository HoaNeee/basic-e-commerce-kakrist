/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PaginationComponent from "@/components/PaginationComponent";
import CardProduct from "@/components/product/CardProduct";
import CardSkeleton from "@/components/product/CardSkeleton";
import { ProductModel } from "@/models/productModel";
import { toggleProduct } from "@/redux/reducer/favoriteReducer";
import { del, get } from "@/utils/requets";
import { HeartPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const WishLists = () => {
  const [listFavoriteInfo, setListFavoriteInfo] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);

  const limit = 9;
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "";
  const dispatch = useDispatch();

  useEffect(() => {
    getList();
  }, [searchParams]);

  const getList = async () => {
    try {
      setIsLoading(true);
      const api = `/favorites/info?page=${page || 1}&limit=${limit}`;
      const response = await get(api);
      const products = Array.isArray(response.data.products)
        ? response.data.products
        : [];
      setTotalPage(response.data.totalPage);
      setListFavoriteInfo(products);
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
      dispatch(toggleProduct(product_id));
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
            <div className="py-16 w-full flex items-center justify-center">
              <div className="flex flex-col w-full h-full">
                <div className="w-25 h-25 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center dark:bg-neutral-600/90 dark:text-gray-300">
                  <HeartPlus className="size-13" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">
                  No products in your wishlists
                </h3>
                <p className="text-center text-neutral-500">
                  You can add products to your wishlists from product detail
                  page.
                </p>
              </div>
            </div>
          )}
        </>
      )}
      {totalPage > 1 && (
        <div className="mt-8">
          <PaginationComponent totalPage={totalPage} />
        </div>
      )}
    </div>
  );
};

export default WishLists;
