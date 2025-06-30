/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { AiOutlineMinus } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { FaRegHeart } from "react-icons/fa";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { ProductModel, SubProductModel } from "@/models/productModel";
import { get } from "@/utils/requets";
import { Badge } from "@/components/ui/badge";
import IMAGENOTFOUND from "../../../assets/imagenotfound.png";
import Image from "next/image";
import { VariationModel } from "@/models/variationModel";
import { VND } from "@/utils/formatCurrency";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ProductDetail = () => {
  const { slug } = useParams();

  const [productDetail, setProductDetail] = useState<ProductModel>();
  const [variations, setVariations] = useState<VariationModel[]>();
  const [subProducts, setSubProducts] = useState<SubProductModel[]>();
  const [subProductDetail, setSubProductsDetail] = useState<SubProductModel>();
  const [thumbnail, setThumbnail] = useState<string>();
  const [optionsChoosed, setOptionsChoosed] = useState<
    {
      title: string;
      value: string;
      variation_id: string;
    }[]
  >([]);
  const [count, setCount] = useState(1);

  const auth = useSelector((state: RootState) => state.auth.auth);
  const path = usePathname();
  const search = useSearchParams().toString();
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      getProductDetail();
    }
  }, [slug]);

  useEffect(() => {
    if (optionsChoosed.length === variations?.length) {
      const key_combi = optionsChoosed
        .map((item) => item.value)
        .sort((a, b) => (a < b ? 1 : -1))
        .join("-");

      const subProduct = subProducts?.find(
        (item) => item.key_combi === key_combi
      );
      setThumbnail(subProduct?.thumbnail);
      setSubProductsDetail(subProduct);
    } else if (subProductDetail) {
      setSubProductsDetail(undefined);
      setThumbnail(productDetail?.thumbnail);
    }
  }, [optionsChoosed]);

  const getProductDetail = async () => {
    try {
      const response = await get(`/products/detail/${slug}`);
      setThumbnail(response.data.product.thumbnail);
      setProductDetail(response.data.product);
      if (response.data.product.productType === "variations") {
        setVariations(response.data.variations);

        const subProducts = response.data.subProducts.map(
          (item: SubProductModel) => {
            const key_combi = item.options
              .sort((a, b) => (a < b ? 1 : -1))
              .join("-");

            return {
              ...item,
              key_combi: key_combi,
            };
          }
        );

        setSubProducts(subProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCart = () => {
    if (!auth.accessToken) {
      console.log("need login");
      //encodeURIComponent
      const next = encodeURIComponent(path + (search ? `?${search}` : ``));

      router.push(`/auth/login?next=${next}`);
      return;
    }

    if (!subProductDetail) {
      console.log("need choose at least one");
      return;
    }

    console.log(subProductDetail);
  };

  const renderSubproducts = (variations: VariationModel[]) => {
    return (
      variations &&
      variations.length > 0 &&
      variations.map((item) => {
        return (
          <div key={item._id} className="flex items-center gap-4">
            <p className="font-bold">{item.title + ": "}</p>
            <div className="flex gap-2">
              {item?.options &&
                item.options.length > 0 &&
                item.options.map((option) => {
                  return (
                    <Badge
                      variant={
                        optionsChoosed.find(
                          (item) => item.value === option.value
                        ) !== undefined
                          ? "default"
                          : "outline"
                      }
                      className="text-sm cursor-pointer"
                      key={option.value}
                      onClick={() => {
                        const options = [...optionsChoosed];

                        const idx = options.findIndex(
                          (item) =>
                            item.variation_id === option.variation_id &&
                            item.value !== option.value
                        );

                        if (idx !== -1) {
                          options.splice(idx, 1);
                          options.push(option);
                        } else {
                          const idx = options.findIndex(
                            (item) => item.value === option.value
                          );
                          if (idx !== -1) {
                            options.splice(idx, 1);
                          } else {
                            options.push(option);
                          }
                        }

                        setOptionsChoosed(options);
                      }}
                    >
                      {option.title}
                    </Badge>
                  );
                })}
            </div>
          </div>
        );
      })
    );
  };

  return (
    <div className="w-full h-full container xl:px-4 px-2 md:px-0 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-4">
        <div className="w-full p-1">
          <div className="w-full bg-[#F1F1F3] lg:h-[555px] h-[400px]">
            {productDetail?.thumbnail ? (
              <img
                src={thumbnail}
                alt={productDetail.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                alt="product detail"
                src={IMAGENOTFOUND}
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="grid grid-cols-4 mt-3 flex-wrap gap-3">
            {productDetail?.images?.map((img, idx) => {
              return (
                <div
                  key={idx}
                  className="w-full h-full bg-[#F1F1F3] cursor-pointer"
                  onClick={() => {
                    setThumbnail(img);
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full px-5 py-2 relative">
          <div className="absolute top-0 right-0">
            {productDetail?.productType === "simple" ? (
              <>
                <Badge
                  className={`rounded-sm ${
                    Number(productDetail.stock) > 0
                      ? "text-green-600 bg-green-100/50"
                      : "text-red-600 bg-red-100/50"
                  }`}
                >
                  {Number(productDetail.stock) > 0
                    ? "In stock"
                    : "Out of stock"}
                </Badge>
              </>
            ) : (
              <>
                {subProductDetail ? (
                  <>
                    <Badge
                      className={`rounded-sm ${
                        Number(subProductDetail.stock) > 0
                          ? "text-green-600 bg-green-100/50"
                          : "text-red-600 bg-red-100/50"
                      }`}
                    >
                      {Number(subProductDetail?.stock) > 0
                        ? "In stock"
                        : "Out of stock"}
                    </Badge>
                  </>
                ) : (
                  productDetail && (
                    <>
                      <Badge
                        className={`rounded-sm ${
                          Number(productDetail.rangeStock) > 0
                            ? "text-green-600 bg-green-100/50"
                            : "text-red-600 bg-red-100/50"
                        }`}
                      >
                        {Number(productDetail.rangeStock) > 0
                          ? "In stock"
                          : "Out of stock"}
                      </Badge>
                    </>
                  )
                )}
              </>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-black">{productDetail?.supplierName}</p>
            <p className="font-medium">{productDetail?.title}</p>
            <div className="flex items-center gap-2">
              <div className="flex gap-2 text-yellow-500 items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FaStar key={index} size={20} />
                ))}
              </div>
              <p className="text-sm text-neutral-400">5.0</p>
              <p className="text-sm text-neutral-400">(121 Reviews)</p>
            </div>
            <div className="flex items-center gap-3 my-1">
              {productDetail?.productType === "simple" ? (
                <>
                  {productDetail.discountedPrice !== undefined &&
                  productDetail.discountedPrice !== null ? (
                    <>
                      <p>{VND.format(Number(productDetail.discountedPrice))}</p>
                      <p className="line-through">
                        {VND.format(Number(productDetail.price))}
                      </p>
                    </>
                  ) : (
                    <p>{VND.format(Number(productDetail.price))}</p>
                  )}
                </>
              ) : (
                <>
                  {productDetail && subProductDetail ? (
                    <p>{VND.format(Number(subProductDetail.price))}</p>
                  ) : (
                    productDetail && (
                      <p>
                        {VND.format(productDetail.rangePrice?.min || 0)} -{" "}
                        {VND.format(productDetail.rangePrice?.max || 0)}
                      </p>
                    )
                  )}
                </>
              )}
            </div>
            <p className="text-sm tracking-wider">{productDetail?.content}</p>

            <div className="mt-2 flex flex-col gap-5">
              {renderSubproducts(variations || [])}
            </div>

            <div className="flex items-center gap-3 mt-7">
              <div className="flex items-center gap-2 border-2 border-black justify-between rounded-lg py-2 px-3">
                <AiOutlineMinus
                  size={20}
                  onClick={() => {
                    if (productDetail?.productType === "variations") {
                      if (subProductDetail) {
                        if (count > 1) {
                          setCount(count - 1);
                        }
                      }
                    } else {
                      if (count > 1) {
                        setCount(count - 1);
                      }
                    }
                  }}
                  className="cursor-pointer"
                />
                <div className="w-5 text-center">{count}</div>
                <GoPlus
                  size={20}
                  onClick={() => {
                    if (productDetail?.productType === "variations") {
                      if (subProductDetail) {
                        setCount(count + 1);
                      }
                    } else {
                      setCount(count + 1);
                    }
                  }}
                  className="cursor-pointer"
                />
              </div>
              <div className="w-3/6 px-2 h-full">
                <Button
                  className="w-full py-5.5"
                  onClick={handleCart}
                  disabled={
                    productDetail?.productType === "variations"
                      ? !subProductDetail
                      : false
                  }
                >
                  Add to cart
                </Button>
              </div>

              <Button variant={"outline"} className="h-[44px] w-[44px]">
                <FaRegHeart size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
