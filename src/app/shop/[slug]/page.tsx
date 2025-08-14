/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
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
import {
  OptionsInfo,
  ProductModel,
  SubProductDetail,
  SubProductModel,
} from "@/models/productModel";
import { get, post } from "@/utils/requets";
import { Badge } from "@/components/ui/badge";
import IMAGENOTFOUND from "../../../assets/imagenotfound.png";
import Image from "next/image";
import { VariationModel } from "@/models/variationModel";
import { VND } from "@/utils/formatCurrency";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Shipping from "@/components/home/Shipping";
import { addProduct } from "@/redux/reducer/cartReducer";
import { CartModel } from "@/models/cartModel";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import RatingTab from "@/components/ReviewTab";
import { Rating, RatingButton } from "@/components/ui/rating";
import { StarIcon } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import lodash from "lodash";
import {
  handleToggleFavorite,
  listFavoriteToggle,
  toggleProduct,
} from "@/redux/reducer/favoriteReducer";
import RelatedProduct from "@/components/product/RelatedProduct";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { slug } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [productDetail, setProductDetail] = useState<ProductModel>();
  const [variations, setVariations] = useState<VariationModel[]>();
  const [subProducts, setSubProducts] = useState<SubProductModel[]>();
  const [subProductDetail, setSubProductsDetail] = useState<SubProductDetail>();
  const [thumbnail, setThumbnail] = useState<string>();
  const [optionsChoosed, setOptionsChoosed] = useState<OptionsInfo[]>([]);
  const [count, setCount] = useState(1);
  const [tabSelected, setTabSelected] = useState<any>();

  const auth = useSelector((state: RootState) => state.auth.auth);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const listFavorite = useSelector((state: RootState) => state.favorite.list);
  const path = usePathname();
  const search = useSearchParams().toString();
  const tabInitRef = useRef<any>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const next = encodeURIComponent(path + (search ? `?${search}` : ``));

  useEffect(() => {
    if (slug) {
      getProductDetail();
    }
  }, [slug]);

  useEffect(() => {
    if (optionsChoosed.length === variations?.length) {
      if (subProductDetail && count !== 1) {
        setCount(1);
      }

      const key_combi = optionsChoosed
        .map((item) => item.value)
        .sort((a, b) => (a < b ? 1 : -1))
        .join("-");

      const subProduct = subProducts?.find(
        (item) => item.key_combi === key_combi
      );

      if (subProduct) {
        setThumbnail(subProduct?.thumbnail);
        setSubProductsDetail({
          ...subProduct,
          options_info: optionsChoosed,
        });
      }
    } else if (subProductDetail) {
      setSubProductsDetail(undefined);
      setThumbnail(productDetail?.thumbnail);
      if (count !== 1) {
        setCount(1);
      }
    }
  }, [optionsChoosed]);

  const getProductDetail = async () => {
    try {
      setIsLoading(true);
      const response = await get(`/products/detail/${slug}`);

      const product: ProductModel = response.data.product;

      setThumbnail(product.thumbnail);
      setProductDetail(product);

      if (product.productType === "variations") {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCart = async () => {
    if (!auth.isLogin) {
      window.location.href = `/auth/login?next=${next}`;
      return;
    }

    try {
      if (productDetail?.productType === "variations") {
        if (!subProductDetail) {
          toast.error("need choose at least one", { duration: 1000 });
          return;
        }

        if (!Number(subProductDetail.stock)) {
          toast.error("This product is out of stock", {
            description: "Plese choose other product",
            action: {
              label: "close",
              onClick: () => {},
            },
          });
          return;
        }

        const item: CartModel = {
          cart_id: cart.cart_id,
          options: subProductDetail.options,
          options_info: subProductDetail.options_info,
          product_id: subProductDetail.product_id,
          sub_product_id: subProductDetail._id,
          price: Number(subProductDetail.price),
          discountedPrice: subProductDetail.discountedPrice,
          thumbnail: subProductDetail.thumbnail,
          thumbnail_product: productDetail.thumbnail,
          quantity: count,
          productType: "variations",
          title: productDetail.title,
          slug: productDetail.slug,
          SKU: subProductDetail.SKU || "",
        };

        const response = await post(`/cart/add-product/${cart.cart_id}`, item);

        dispatch(
          addProduct({
            ...item,
            cartItem_id: response.data.cartItem.cartItem_id,
          })
        );
      } else {
        const item: CartModel = {
          cart_id: cart.cart_id,
          options: [],
          product_id: productDetail?._id,
          price: Number(productDetail?.price),
          discountedPrice: productDetail?.discountedPrice,
          thumbnail: productDetail?.thumbnail,
          quantity: count,
          productType: "simple",
          title: productDetail?.title,
          slug: productDetail?.slug,
          SKU: productDetail?.SKU || "",
        };
        const response = await post(`/cart/add-product/${cart.cart_id}`, item);

        dispatch(
          addProduct({
            ...item,
            cartItem_id: response.data.cartItem.cartItem_id,
          })
        );
      }
      toast.success("Add product to cart success", {
        description: "Click to cart to see details!",
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const renderSubproducts = (
    variations: VariationModel[],
    readOnly: boolean = false
  ) => {
    return (
      variations &&
      variations.length > 0 &&
      variations.map((item) => {
        return (
          <div key={item._id} className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="font-semibold text-gray-900 dark:text-white min-w-[50px]">
                {item.title}:
              </label>
              {!readOnly ? (
                <div className="flex flex-wrap gap-2">
                  {item?.options &&
                    item.options.length > 0 &&
                    item.options.map((option) => {
                      const isSelected =
                        optionsChoosed.find(
                          (choosed) => choosed.value === option.value
                        ) !== undefined;

                      return (
                        <Badge
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer capitalize transition-all duration-200 hover:scale-105 ${
                            isSelected
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary"
                          }`}
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
              ) : (
                <div className="text-gray-600 dark:text-gray-400">
                  {item.options.map((opt) => opt.title).join(", ")}
                </div>
              )}
            </div>
          </div>
        );
      })
    );
  };

  const handleFavorite = async () => {
    if (!auth.isLogin) {
      window.location.href = `/auth/login?next=${next}`;
      return;
    }
    try {
      if (productDetail?._id) {
        dispatch(toggleProduct(productDetail._id));
        const list = listFavoriteToggle(listFavorite, productDetail._id);
        debounceToggleFavorite(list);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const debounceToggleFavorite = React.useRef(
    lodash.debounce((list: string[]) => handleToggleFavorite(list), 1000)
  ).current;

  const renderStock = (stock: number | string) => {
    return (
      <Badge
        className={`rounded-sm ${
          Number(stock) > 0
            ? "text-green-600 bg-green-100/50 dark:bg-neutral-800"
            : "text-red-600 bg-red-100/50 dark:bg-neutral-800"
        }`}
      >
        {Number(stock) > 0 ? "In stock" : "Out of stock"}
      </Badge>
    );
  };

  if (isLoading || !productDetail) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 max-w-7xl">
          {/* Breadcrumb Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <span>/</span>
              <Skeleton className="h-4 w-12" />
              <span>/</span>
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Product Detail Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <Skeleton className="aspect-square lg:h-[600px] h-[500px] rounded-lg" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              <div className="flex justify-end">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-3/4" />
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-4 rounded" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-1/2" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-4 w-16" />
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-4 pt-6">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6">
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/shop"
                    className="hover:text-primary transition-colors"
                  >
                    Shop
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-gray-900 dark:text-white">
                  {productDetail?.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <div className="space-y-4">
            <div className="relative bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="aspect-square lg:h-[600px] h-[500px] p-4 w-full">
                {productDetail?.thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={productDetail.title}
                    className="w-full h-full object-contain object-center rounded-lg"
                  />
                ) : (
                  <Image
                    alt="product detail"
                    src={IMAGENOTFOUND}
                    className="w-full h-full object-contain rounded-lg"
                    priority
                  />
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {productDetail?.images?.map((img, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square bg-white dark:bg-gray-800 rounded-lg border-2 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md ${
                      thumbnail === img
                        ? "border-primary/30 ring-2 ring-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    onClick={() => setThumbnail(img)}
                  >
                    <img
                      src={img}
                      alt={`Product ${idx + 1}`}
                      className="h-full w-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex justify-end">
              {productDetail?.productType === "simple" ? (
                renderStock(productDetail.stock || 0)
              ) : (
                <>
                  {subProductDetail
                    ? renderStock(subProductDetail?.stock || 0)
                    : productDetail &&
                      renderStock(productDetail?.rangeStock || 0)}
                </>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-primary uppercase tracking-wider">
                {productDetail?.supplierName}
              </p>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {productDetail?.title}
              </h1>

              <div className="flex items-center gap-3">
                <Rating readOnly defaultValue={productDetail?.review?.average}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <RatingButton
                      key={idx}
                      size={18}
                      className={
                        idx < (productDetail?.review?.average || 0)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }
                      icon={
                        <StarIcon
                          strokeWidth={1}
                          fill={
                            idx < (productDetail?.review?.average || 0)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      }
                      index={idx}
                    />
                  ))}
                </Rating>
                <div className="flex gap-2 items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>{productDetail?.review?.average || 0}.0</span>
                  <span>•</span>
                  <span>
                    ({productDetail?.review?.numberPeople || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {productDetail?.productType === "simple" ? (
                  <>
                    {productDetail.discountedPrice !== undefined &&
                    productDetail.discountedPrice !== null ? (
                      <>
                        <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                          {VND.format(Number(productDetail.discountedPrice))}
                        </p>
                        <p className="text-lg text-gray-500 line-through">
                          {VND.format(Number(productDetail.price))}
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        {VND.format(Number(productDetail.price))}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {productDetail && subProductDetail ? (
                      <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        {VND.format(Number(subProductDetail.price))}
                      </p>
                    ) : (
                      productDetail && (
                        <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                          {VND.format(productDetail.rangePrice?.min || 0)} -{" "}
                          {VND.format(productDetail.rangePrice?.max || 0)}
                        </p>
                      )
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Categories:
                </span>
                <div className="flex flex-wrap gap-2">
                  {productDetail?.categories_info?.map((category) => (
                    <button
                      key={category._id}
                      onClick={() =>
                        router.push(`/shop?filter_cats=${category._id}`)
                      }
                      className="px-3 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-colors duration-200"
                    >
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400"
                dangerouslySetInnerHTML={{
                  __html: productDetail?.shortDescription || "",
                }}
              />

              {variations && variations.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {renderSubproducts(variations)}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6">
                <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-12 px-4 rounded-none border-r border-gray-300 dark:border-gray-600"
                    disabled={count === 1}
                    onClick={() => {
                      if (productDetail?.productType === "variations") {
                        if (subProductDetail && count > 1) {
                          setCount(count - 1);
                        }
                      } else {
                        if (count > 1) {
                          setCount(count - 1);
                        }
                      }
                    }}
                  >
                    <AiOutlineMinus size={16} />
                  </Button>
                  <div className="flex-1 h-12 flex items-center justify-center min-w-[60px] font-medium">
                    {count}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-12 px-4 rounded-none border-l border-gray-300 dark:border-gray-600"
                    onClick={() => {
                      if (productDetail?.productType === "variations") {
                        if (subProductDetail) {
                          setCount(count + 1);
                        }
                      } else {
                        setCount(count + 1);
                      }
                    }}
                    disabled={
                      productDetail?.productType === "simple"
                        ? count === productDetail.stock
                        : subProductDetail &&
                          count >= Number(subProductDetail?.stock)
                    }
                  >
                    <GoPlus size={16} />
                  </Button>
                </div>

                <Button
                  size="lg"
                  className="flex-1 h-12 font-semibold"
                  onClick={handleCart}
                  disabled={
                    productDetail?.productType === "variations"
                      ? !subProductDetail
                      : false
                  }
                >
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 relative"
                  onClick={handleFavorite}
                >
                  <div
                    className="transition-all duration-300 absolute inset-0 flex items-center justify-center"
                    style={{
                      opacity: listFavorite.includes(productDetail?._id || "")
                        ? "0"
                        : "1",
                    }}
                  >
                    <FaRegHeart size={20} />
                  </div>
                  <div
                    className="transition-all duration-300 absolute inset-0 flex items-center justify-center text-red-500"
                    style={{
                      opacity: listFavorite.includes(productDetail?._id || "")
                        ? "1"
                        : "0",
                    }}
                  >
                    <FaHeart size={20} />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 md:rounded-xl md:shadow-sm md:border border-gray-200 dark:border-gray-700 p-4 lg:p-8 mb-16">
          <Tabs defaultValue="reviews">
            <TabsList className="flex gap-6 items-center border-b border-gray-200 dark:border-gray-700 w-full pb-4 mb-6 relative">
              <div
                className="absolute h-0.5 bg-primary -bottom-[1px] transition-all duration-300 rounded-full"
                style={{
                  width: tabSelected
                    ? tabSelected.offsetWidth
                    : tabInitRef.current
                    ? tabInitRef.current.offsetWidth
                    : "60px",
                  left: tabSelected
                    ? tabSelected.offsetLeft
                    : tabInitRef.current
                    ? tabInitRef.current.offsetLeft
                    : "0px",
                }}
              />
              <TabsTrigger
                ref={tabInitRef}
                value="reviews"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white data-[state=active]:text-primary data-[state=active]:font-semibold transform data-[state=active]:-translate-y-0.5 translate-y-0 transition-all duration-200"
                onClick={(e) => setTabSelected(e.target)}
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white data-[state=active]:text-primary data-[state=active]:font-semibold transition-all duration-200 transform data-[state=active]:-translate-y-0.5 translate-y-0"
                onClick={(e) => setTabSelected(e.target)}
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="additional-information"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white data-[state=active]:text-primary data-[state=active]:font-semibold transition-all duration-200 transform data-[state=active]:-translate-y-0.5 translate-y-0"
                onClick={(e) => setTabSelected(e.target)}
              >
                Additional Information
              </TabsTrigger>
            </TabsList>

            <div className="min-h-[200px]">
              <TabsContent value="reviews">
                <RatingTab product={productDetail} />
              </TabsContent>
              <TabsContent value="description">
                <div
                  className="prose prose-gray dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      productDetail?.content ||
                      "<p>No description available</p>",
                  }}
                />
              </TabsContent>
              <TabsContent value="additional-information">
                {productDetail?.productType === "variations" ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-4">
                      Product Variations
                    </h3>
                    <div className="space-y-3">
                      {renderSubproducts(variations || [], true)}
                    </div>
                  </div>
                ) : (
                  <div
                    className="prose prose-gray dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        productDetail?.shortDescription ||
                        "<p>No additional information available</p>",
                    }}
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="mb-16">
          <RelatedProduct product={productDetail} />
        </div>

        <div className="mb-8">
          <Shipping />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
