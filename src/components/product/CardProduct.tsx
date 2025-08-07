"use client";
import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { ProductModel } from "@/models/productModel";
import { Button } from "../ui/button";
import { FaRegStar, FaStar } from "react-icons/fa";
import { TbSwitchHorizontal } from "react-icons/tb";
import Link from "next/link";
import { IoEyeOutline } from "react-icons/io5";
import { VND } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { post } from "@/utils/requets";
import { mutate } from "swr";

interface Props {
  item: ProductModel;
  control?: boolean;
  className?: string;
  onAddToCart?: (item: ProductModel) => void;
  isListFavorite?: boolean;
  favorited?: boolean;
  onToggleFavorite?: () => void;
}

const CardProduct = ({
  item,
  control,
  className,
  onAddToCart,
  isListFavorite,
  favorited,
  onToggleFavorite,
}: Props) => {
  const router = useRouter();

  const discountPercentage =
    item.discountedPrice && item.price
      ? Math.round(
          ((Number(item.price) - Number(item.discountedPrice)) /
            Number(item.price)) *
            100
        )
      : 0;

  const clickProduct = async () => {
    try {
      await post("/suggestions/track", {
        action: "click",
        value: item._id,
        type_track: "product",
      });
      mutate("/suggestions");
    } catch (error) {
      console.log("Error tracking product:", error);
    }
  };

  return (
    <Card
      className={
        control
          ? cn(
              "group relative bg-white py-0 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
              className
            )
          : "lg:w-[calc(100%/4-20px)] py-0 w-[calc(100%/2-18px)] group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      }
    >
      <CardContent className="p-0 relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Link
          href={`/shop/${item.slug}`}
          className="absolute inset-0 z-10"
          onClick={() => {
            if (!isListFavorite) {
              clickProduct();
            }
          }}
        />

        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundImage: `url(${
              item.thumbnail ? item.thumbnail : "../assets/imagenotfound.png"
            })`,
          }}
        />

        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          {!isListFavorite ? (
            <Button
              variant="secondary"
              size="sm"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md border-0 relative transition-all duration-300"
              title="Add to wishlist"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite?.();
              }}
            >
              <FaStar
                className="w-4 h-4 text-yellow-500 absolute flex items-center justify-center transition-opacity duration-300"
                style={{
                  opacity: favorited ? 1 : 0,
                }}
              />
              <FaRegStar
                className="w-4 h-4 text-gray-600 absolute flex items-center justify-center transition-opacity duration-300"
                style={{
                  opacity: favorited ? 0 : 1,
                }}
              />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-red-50 shadow-md border-0"
              title="Remove from wishlist"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite?.();
              }}
            >
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md border-0"
            title="Quick view"
            onClick={(e) => {
              e.preventDefault();
              if (!isListFavorite) {
                clickProduct();
              }
              router.push(`/shop/${item.slug}`);
            }}
          >
            <IoEyeOutline className="w-4 h-4 text-gray-600" />
          </Button>

          {!isListFavorite && (
            <Button
              variant="secondary"
              size="sm"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md border-0"
              title="Compare"
              onClick={() =>
                router.push(`/shop?filter_cats=${item.categories.join(",")}`)
              }
            >
              <TbSwitchHorizontal className="w-4 h-4 text-gray-600" />
            </Button>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-20">
          <Button
            className="w-full bg-white text-black hover:bg-gray-100 font-semibold rounded-lg transition-all duration-200 shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              if (item.productType === "variations") {
                if (!isListFavorite) {
                  clickProduct();
                }
                router.push(`/shop/${item.slug}`);
              } else {
                onAddToCart?.(item);
              }
            }}
          >
            {isListFavorite ? "Move to Cart" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="p-4 space-y-3">
        <Link
          href={`/shop/${item.slug}`}
          className="block"
          onClick={() => {
            if (!isListFavorite) {
              clickProduct();
            }
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {item.supplierName}
            </span>
          </div>
          {item.review && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-3 h-3 ${
                    i < Number(item.review?.average)
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">
                ({Number(item.review?.average).toFixed(1)})
              </span>
            </div>
          )}

          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 mb-3 hover:text-blue-600 transition-colors">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            {item.productType === "simple" ? (
              <>
                {item.discountedPrice !== undefined &&
                item.discountedPrice !== null ? (
                  <>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {VND.format(Number(item.discountedPrice))}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {VND.format(Number(item.price))}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {VND.format(Number(item.price))}
                  </span>
                )}
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {VND.format(item.rangePrice?.min || 0)} -{" "}
                {VND.format(item.rangePrice?.max || 0)}
              </span>
            )}
          </div>

          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              In Stock
            </span>
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardProduct;
