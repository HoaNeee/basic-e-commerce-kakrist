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
          <div key={item._id} className="flex items-center gap-4" style={{}}>
            <p className="font-bold">{item.title + ": "}</p>
            {!readOnly ? (
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
                        className="text-sm cursor-pointer capitalize"
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
              <div className="text-sm tracking-wider">
                {item.options.map((opt) => opt.title).join(", ")}
              </div>
            )}
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
      <div className="w-full h-full container xl:px-4 px-2 md:px-0 mx-auto ">
        <div className="w-full my-12 grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-4">
          <div className="w-full p-1 mb-2">
            <div className="w-full bg-[#F1F1F3] lg:h-[500px] h-[400px]">
              <Image
                alt="product detail"
                src={IMAGENOTFOUND}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="grid grid-cols-4 mt-3 flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-full lg:h-40 md:h-30 h-20" />
              ))}
            </div>
          </div>
          <div className="w-full h-full flex flex-col gap-4">
            <Skeleton className="h-7 w-30" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-42 mt-1" />
            <Skeleton className="h-5 w-36 my-1" />
            <Skeleton className="h-5 w-full md:w-1/2 my-1" />
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-full" />
              <Skeleton className="h-2.5 w-full" />
              <Skeleton className="h-2.5 w-2/3" />
            </div>
            <Skeleton className="h-7 w-1/2 my-1" />
            <Skeleton className="h-7 w-1/2 my-1" />
            <Skeleton className="h-11 w-2/3 my-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full container xl:px-4 px-2 md:px-0 mx-auto dark:text-white/80">
      <div className="w-full my-6">
        <Breadcrumb>
          <BreadcrumbList className="">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={"/"}>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={"/shop"}>Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{productDetail?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-4">
        <div className="w-full p-1">
          <div className="w-full bg-[#F1F1F3] dark:bg-neutral-600 lg:h-[500px] h-[400px]">
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
                priority
              />
            )}
          </div>
          {isLoading && (
            <div className="grid grid-cols-4 mt-3 flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-full lg:h-40 md:h-30 h-20" />
              ))}
            </div>
          )}
          {!isLoading && (
            <div className="grid grid-cols-4 mt-3 flex-wrap gap-3">
              {productDetail?.images?.map((img, idx) => {
                return (
                  <div
                    key={idx}
                    className="w-full md:h-40 h-25 bg-[#F1F1F3] dark:bg-neutral-600 cursor-pointer overflow-hidden"
                    onClick={() => {
                      setThumbnail(img);
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-contain hover:scale-105 transition-all duration-300"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="w-full px-5 py-2 relative">
          {isLoading && (
            <div className="w-full h-full flex flex-col gap-4">
              <Skeleton className="h-7 w-30" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-42 mt-1" />
              <Skeleton className="h-5 w-36 my-1" />
              <Skeleton className="h-5 md:w-1/2 w-full my-1" />
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="h-2.5 w-2/3" />
              </div>
              <Skeleton className="h-7 w-1/2 my-1" />
              <Skeleton className="h-7 w-1/2 my-1" />
              <Skeleton className="h-11 w-2/3 my-1" />
            </div>
          )}
          {!isLoading && (
            <div className="absolute top-0 right-0">
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
          )}
          {!isLoading && (
            <div className="flex flex-col gap-4">
              <p className="text-2xl font-black">
                {productDetail?.supplierName}
              </p>
              <p className="font-medium">{productDetail?.title}</p>
              <div className="flex items-center gap-2">
                <Rating
                  className="mt-1"
                  readOnly
                  defaultValue={productDetail?.review?.average}
                >
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <RatingButton
                      key={idx}
                      size={20}
                      className={
                        idx < (productDetail?.review?.average || 0)
                          ? "text-yellow-500 fill-current"
                          : "text-muted-foreground"
                      }
                      icon={
                        <StarIcon
                          strokeWidth={1}
                          fill={
                            idx < (productDetail?.review?.average || 0)
                              ? ""
                              : "white"
                          }
                        />
                      }
                      index={idx}
                    />
                  ))}
                </Rating>
                <div className="mt-1 flex gap-2 items-center">
                  <p className="text-sm text-neutral-400">
                    {productDetail?.review?.average || 0}.0
                  </p>
                  <p className="text-sm text-neutral-400">
                    ({productDetail?.review?.numberPeople || 0} Reviews)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 my-1">
                {productDetail?.productType === "simple" ? (
                  <>
                    {productDetail.discountedPrice !== undefined &&
                    productDetail.discountedPrice !== null ? (
                      <>
                        <p>
                          {VND.format(Number(productDetail.discountedPrice))}
                        </p>
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
              <div className="text-sm flex items-center gap-2">
                <p className="">Categories:</p>
                <div className="flex items-center gap-2 xl:flex-nowrap flex-wrap">
                  {productDetail?.categories_info?.map((category) => (
                    <p
                      onClick={() =>
                        router.push(`/shop?filter_cats=${category._id}`)
                      }
                      className="p-1 text-xs bg-gray-50 border border-gray-200 rounded-sm dark:bg-neutral-700 dark:border-neutral-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-600 transition-all duration-300"
                      key={category._id}
                    >
                      {category.title}
                    </p>
                  ))}
                </div>
              </div>
              <div
                className="text-sm tracking-wider"
                dangerouslySetInnerHTML={{
                  __html: productDetail?.shortDescription || "",
                }}
              />

              <div className="mt-2 flex flex-col gap-5">
                {renderSubproducts(variations || [])}
              </div>

              <div className="flex items-center gap-3 mt-7">
                <div className="flex items-center gap-2 border-2 border-black/60 justify-between rounded-lg px-2 dark:border-white/60">
                  <Button
                    variant={"link"}
                    className=""
                    style={{
                      padding: 0,
                    }}
                    disabled={count === 1}
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
                  >
                    <AiOutlineMinus size={20} />
                  </Button>
                  <div className="w-5 text-center">{count}</div>
                  <Button
                    variant={"link"}
                    style={{
                      padding: 0,
                    }}
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
                    <GoPlus size={20} />
                  </Button>
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

                <Button
                  variant={"outline"}
                  className="h-[44px] w-[44px] relative"
                  onClick={async () => {
                    await handleFavorite();
                  }}
                >
                  <div
                    className="transition-all duration-300 absolute w-full h-full flex items-center justify-center"
                    style={{
                      opacity: listFavorite.includes(productDetail?._id || "")
                        ? "0"
                        : "1",
                    }}
                  >
                    <FaRegHeart size={22} className="size-5" />
                  </div>
                  <div
                    className="transition-all duration-300 w-full h-full flex items-center justify-center text-red-500"
                    style={{
                      opacity: !listFavorite.includes(productDetail?._id || "")
                        ? "0"
                        : "1",
                    }}
                  >
                    <FaHeart size={20} className="size-5" />
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="py-10">
        <Tabs defaultValue="reviews">
          <TabsList
            className="flex gap-5 items-center border-b-2 w-full relative pb-2 transition-all duration-300"
            color="cyan"
            style={{}}
          >
            <div
              className="absolute h-[3px] bg-[#131118] dark:bg-gray-300 -bottom-[2.5px] transition-all duration-300"
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
            ></div>
            <TabsTrigger
              ref={tabInitRef}
              value="reviews"
              className="data-[state=active]:font-bold data-[state=active]:text-[15px] data-[state=active]:-translate-y-1 transition-transform duration-300"
              onClick={(e) => {
                setTabSelected(e.target);
              }}
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="description"
              className="data-[state=active]:font-bold data-[state=active]:text-[15px] data-[state=active]:-translate-y-1 transition-transform duration-300"
              onClick={(e) => {
                setTabSelected(e.target);
              }}
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="additional-information"
              className="data-[state=active]:font-bold data-[state=active]:text-[15px] data-[state=active]:-translate-y-1 transition-transform duration-300"
              onClick={(e) => {
                setTabSelected(e.target);
              }}
            >
              Additional Information
            </TabsTrigger>
          </TabsList>
          <div className="min-h-25">
            <TabsContent value="reviews">
              <RatingTab product={productDetail} />
            </TabsContent>
            <TabsContent value="description">
              <div
                className="w-full h-full py-5 text-sm tracking-wider"
                dangerouslySetInnerHTML={{
                  __html: productDetail?.content || "No description",
                }}
              />
            </TabsContent>
            <TabsContent value="additional-information">
              {productDetail?.productType === "variations" ? (
                <div className="w-full h-full py-5 flex flex-col gap-2 border-b-2">
                  {renderSubproducts(variations || [], true)}
                </div>
              ) : (
                <div className="w-full h-full py-5 flex flex-col gap-2 text-sm tracking-wider">
                  {productDetail?.shortDescription || "No more information"}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
        <RelatedProduct product={productDetail} />
      </section>
      <section className="container xl:px-4 py-10 mx-auto px-2 md:px-0 w-full">
        <Shipping />
      </section>
    </div>
  );
};

export default ProductDetail;
