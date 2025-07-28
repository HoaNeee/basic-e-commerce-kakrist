/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { get, post } from "@/utils/requets";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CardProduct from "./product/CardProduct";
import CardBlog from "./blog/CardBlog";
import CardSkeleton from "./product/CardSkeleton";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ProductModel } from "@/models/productModel";
import { CartModel } from "@/models/cartModel";
import { addProduct } from "@/redux/reducer/cartReducer";
import { toast } from "sonner";
import {
  handleToggleFavorite,
  listFavoriteToggle,
  toggleProduct,
} from "@/redux/reducer/favoriteReducer";
import lodash from "lodash";

const SearchResultComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchResult, setSearchResult] = useState<any[]>([]);

  const listFavorites = useSelector((state: RootState) => state.favorite.list);
  const auth = useSelector((state: RootState) => state.auth.auth);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const next = encodeURIComponent(
    `/search?keyword=${encodeURIComponent(keyword)}`
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `${keyword || "Search"} - Search Results`;
      handleSearch(keyword);
    }
  }, [keyword]);

  const handleSearch = async (keyword: string) => {
    try {
      setIsLoading(true);
      const api = `/search?keyword=${encodeURIComponent(keyword)}`;
      const response = await get(api);
      setSearchResult(response.data || []);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleCart = async (product: ProductModel) => {
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

  const handleFavorite = async (product_id: string) => {
    try {
      if (!auth.isLogin) {
        window.location.href = "/auth/login?next=" + next;
        return;
      }
      dispatch(toggleProduct(product_id));
      const list = listFavoriteToggle(listFavorites, product_id);
      debounceToggleFavorite(list);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const debounceToggleFavorite = React.useRef(
    lodash.debounce((list: string[]) => handleToggleFavorite(list), 1000)
  ).current;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 mt-12">
        <Skeleton className="w-1/3 h-8" />
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8`}>
          {Array.from({ length: 10 }).map((_, index) => {
            return <CardSkeleton key={index} control />;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white dark:bg-black dark:text-white/80 p-6 min-h-screen">
      {searchResult.length > 0 &&
      searchResult.some((item) => item.data.length > 0) ? (
        <div className="w-fulll h-full">
          <div className="flex flex-col gap-10">
            {searchResult.map((result, index) => {
              return (
                <div key={index}>
                  {result?.data?.length > 0 && (
                    <>
                      <h1 className="font-bold text-2xl leading-tight mb-6 capitalize">
                        {result.type}
                      </h1>
                      <div
                        className={` ${
                          result.type === "products"
                            ? "flex flex-wrap gap-6 w-full"
                            : "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        }`}
                      >
                        {result.data.map((item: any) => {
                          if (result.type === "products") {
                            return (
                              <CardProduct
                                item={item}
                                key={item._id}
                                onAddToCart={() => handleCart(item)}
                                onToggleFavorite={() =>
                                  handleFavorite(String(item._id))
                                }
                                favorited={listFavorites.includes(
                                  String(item._id)
                                )}
                              />
                            );
                          }

                          return <CardBlog blog={item} key={item._id} />;
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-full h-full py-16 flex items-center justify-center flex-col">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
            <SearchIcon className="size-12 text-gray-500 dark:text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold">
            No results found for {`"${keyword}"`}
          </h2>
          <p className="text-gray-500">Try searching for something else.</p>

          <div className="mt-6 relative">
            <Input
              type="text"
              placeholder="Example: shoes, blog, etc."
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-80 pr-10"
              disabled
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 size-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultComponent;
