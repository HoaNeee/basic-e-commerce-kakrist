/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
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
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Shipping from "@/components/home/Shipping";
import HeadContent from "@/components/HeadContent";
import CardProduct from "@/components/product/CardProduct";
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

const ProductDetail = () => {
  const { slug } = useParams();

  const [productDetail, setProductDetail] = useState<ProductModel>();
  const [variations, setVariations] = useState<VariationModel[]>();
  const [subProducts, setSubProducts] = useState<SubProductModel[]>();
  const [subProductDetail, setSubProductsDetail] = useState<SubProductDetail>();
  const [thumbnail, setThumbnail] = useState<string>();
  const [relatedProducts, setRelatedProducts] = useState<ProductModel[]>([]);
  const [optionsChoosed, setOptionsChoosed] = useState<OptionsInfo[]>([]);
  const [count, setCount] = useState(1);
  const [tabSelected, setTabSelected] = useState<any>();

  const auth = useSelector((state: RootState) => state.auth.auth);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const path = usePathname();
  const search = useSearchParams().toString();
  const router = useRouter();
  const tabInitRef = useRef<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (slug) {
      getProductDetail();
      getRelatedProducts();
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

  const getRelatedProducts = async () => {
    try {
      const response = await get(`/products/related`);
      setRelatedProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCart = async () => {
    if (!auth.isLogin) {
      console.log("need login");

      const next = encodeURIComponent(path + (search ? `?${search}` : ``));

      router.push(`/auth/login?next=${next}`);
      return;
    }

    try {
      if (productDetail?.productType === "variations") {
        if (!subProductDetail) {
          console.log("need choose at least one");
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
          thumbnail: productDetail.thumbnail,
          thumbnail_sub_product: subProductDetail.thumbnail,
          quantity: count,
          productType: "variations",
          title: productDetail.title,
          slug: productDetail.slug,
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

  return (
    <div className="w-full h-full container xl:px-4 px-2 md:px-0 mx-auto">
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
          <div className="w-full bg-[#F1F1F3] lg:h-[500px] h-[400px]">
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
              <div className="flex items-center gap-2 border-2 border-black/60 justify-between rounded-lg px-2">
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

              <Button variant={"outline"} className="h-[44px] w-[44px]">
                <FaRegHeart size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="py-10">
        <Tabs defaultValue="description">
          <TabsList
            className="flex gap-5 items-center border-b-2 w-full relative pb-2 transition-all duration-300"
            color="cyan"
            style={{}}
          >
            <div
              className="absolute h-[3px] bg-gray-300 -bottom-[2.5px] transition-all duration-300"
              style={{
                width: tabSelected
                  ? tabSelected.offsetWidth
                  : tabInitRef.current
                  ? tabInitRef.current.offsetWidth
                  : "",
                left: tabSelected
                  ? tabSelected.offsetLeft
                  : tabInitRef.current
                  ? tabInitRef.current.offsetLeft
                  : "",
                backgroundColor: "#131118",
              }}
            ></div>
            <TabsTrigger
              //data-[state=active]:border-blue-700 border-b-3 border-white
              ref={tabInitRef}
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
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:font-bold data-[state=active]:text-[15px] data-[state=active]:-translate-y-1 transition-transform duration-300"
              onClick={(e) => {
                setTabSelected(e.target);
              }}
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          <div className="min-h-25">
            <TabsContent value="description">
              <div className="w-full h-full py-5 text-sm tracking-wider">
                {productDetail ? productDetail.content : "No description"}
              </div>
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
            <TabsContent value="reviews">this is the reviews</TabsContent>
          </div>
        </Tabs>
      </div>
      <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
        <div className="w-full h-full">
          <HeadContent title="Related Products" left={<></>} />
          <div className="flex flex-wrap gap-6 w-full">
            {relatedProducts.map((item) => (
              <CardProduct key={item._id} item={item} />
            ))}
          </div>
        </div>
      </section>
      <section className="container xl:px-4 py-10 mx-auto px-2 md:px-0 w-full">
        <Shipping />
      </section>
    </div>
  );
};

export default ProductDetail;
