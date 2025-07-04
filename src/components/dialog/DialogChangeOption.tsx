/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CartModel } from "@/models/cartModel";
import { toast } from "sonner";
import { get, patch } from "@/utils/requets";
import { VariationModel } from "@/models/variationModel";
import {
  OptionsInfo,
  ProductModel,
  SubProductDetail,
  SubProductModel,
} from "@/models/productModel";
import Image from "next/image";
import IMAGENOTFOUND from "../../assets/imagenotfound.png";
import { VND } from "@/utils/formatCurrency";
import ButtonLoading from "../ButtonLoading";

interface Props {
  onOK?: (val?: SubProductDetail) => void;
  items?: CartModel;
  open?: boolean;
  setOpen?: (val: boolean) => void;
  onCancel?: () => void;
  carts?: CartModel[];
}

const DialogChangeOption = (props: Props) => {
  const { onOK, items, open, setOpen, onCancel, carts } = props;

  const [productDetail, setProductDetail] = useState<ProductModel>();
  const [variations, setVariations] = useState<VariationModel[]>();
  const [subProducts, setSubProducts] = useState<SubProductModel[]>();
  const [subProductDetail, setSubProductsDetail] = useState<SubProductDetail>();
  const [thumbnail, setThumbnail] = useState<string>();
  const [optionsChoosed, setOptionsChoosed] = useState<OptionsInfo[]>([]);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (items) {
      getProductDetail(items.slug || "");
    }
  }, [items]);

  useEffect(() => {
    if (subProducts && subProducts.length > 0 && items) {
      setOptionsChoosed(items.options_info || []);
    }
  }, [subProducts]);

  useEffect(() => {
    if (optionsChoosed.length === variations?.length) {
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
    }
  }, [optionsChoosed]);

  useEffect(() => {
    if (!open && subProductDetail) {
      setProductDetail(undefined);
      setSubProductsDetail(undefined);
      setSubProducts([]);
      setVariations([]);
      setOptionsChoosed([]);
      setThumbnail(undefined);
    }
  }, [open]);

  const getProductDetail = async (slug: string) => {
    try {
      const response = await get("/products/detail/" + slug);

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
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (!items) {
    return <></>;
  }

  const renderSubproducts = (variations: VariationModel[]) => {
    return (
      variations &&
      variations.length > 0 &&
      variations.map((item) => {
        return (
          <div key={item._id} className="flex items-center gap-4" style={{}}>
            <p className="font-bold">{item.title + ": "}</p>
            {
              <div className="flex gap-2">
                {item?.options &&
                  item.options.length > 0 &&
                  item.options.map((option) => {
                    return (
                      <Button
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
                      </Button>
                    );
                  })}
              </div>
            }
          </div>
        );
      })
    );
  };

  const checkDisabled = () => {
    const subIds = carts?.map((item) => item.sub_product_id);

    if (subIds?.includes(subProductDetail?._id)) return true;

    return false;
  };

  const handleChangeSubProduct = async () => {
    if (subProductDetail?._id !== items?.sub_product_id) {
      try {
        setIsChanging(true);
        const response = await patch(
          `/cart/change-subProduct/${items?.cartItem_id}`,
          subProductDetail
        );
        if (onOK) {
          onOK(subProductDetail);
        }
        toast.success(response.message, {
          description: "Please check your cart",
          action: {
            label: "Close",
            onClick() {},
          },
        });
      } catch (error: any) {
        toast.error(error.message);
        if (onOK) {
          onOK(undefined);
        }
      } finally {
        setIsChanging(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change other option</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <div className="md:gap-0 gap-4">
          <div className="w-full p-1">
            <div className="w-full bg-[#F1F1F3] lg:h-[200px] h-[150px]">
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
            <div className="mt-3">
              <div className="h-20 w-20 bg-[#f1f1f3]">
                <img
                  src={productDetail?.thumbnail}
                  alt=""
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
          <div className="w-full px-5 py-2 relative">
            <div className="flex flex-col gap-4">
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

              <div className="mt-2 flex flex-col gap-5">
                {renderSubproducts(variations || [])}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant={"outline"} onClick={onCancel}>
            Cancel
          </Button>

          <ButtonLoading
            disabled={checkDisabled() || isChanging}
            loading={isChanging}
            onClick={handleChangeSubProduct}
            styles={{
              padding: "0 30px",
            }}
          >
            Change
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogChangeOption;
