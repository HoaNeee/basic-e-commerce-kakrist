import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { ProductModel } from "@/models/productModel";
import { Button } from "../ui/button";
import { FaRegStar } from "react-icons/fa";
import { TbSwitchHorizontal } from "react-icons/tb";
import Link from "next/link";
import { IoEyeOutline } from "react-icons/io5";
import { VND } from "@/utils/formatCurrency";

interface Props {
  item: ProductModel;
}

const CardProduct = ({ item }: Props) => {
  return (
    <Card className="lg:w-[calc(100%/4-20px)] w-[calc(100%/2-18px)] xl:h-[430px] lg:h-[360px] md:h-[430px] h-[360px] rounded-sm overflow-hidden border-0 shadow-none py-0 group">
      <CardContent
        className="px-0 relative w-full h-full bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            item.thumbnail ? item.thumbnail : "../assets/imagenotfound.png"
          })`,
          backgroundColor: "#F1F1F3",
        }}
      >
        {/* opacity-0 group-hover:opacity-100 */}
        <div className="absolute group-hover:right-2 -right-full top-4 flex flex-col gap-1.5 invisible group-hover:visible transition-all duration-300 z-20">
          <Button variant={"outline"} className="rounded-full h-8 w-8">
            <FaRegStar />
          </Button>
          <Button variant={"outline"} className="rounded-full h-8 w-8">
            <TbSwitchHorizontal />
          </Button>
          <Link href={`/shop/${item.slug}`}>
            <Button variant={"outline"} className="rounded-full h-8 w-8">
              <IoEyeOutline />
            </Button>
          </Link>
        </div>
        <div className="w-full absolute bottom-5 -left-full group-hover:left-0 flex justify-center invisible group-hover:visible transition-all duration-300">
          <Button className="cursor-pointer w-2/3 py-5" variant={"outline"}>
            Add to cart
          </Button>
        </div>
      </CardContent>

      <CardFooter className="px-2 pb-1">
        <div className="flex flex-col gap-1.5">
          <p className="font-bold">{item.supplierName}</p>
          <p className="font-medium text-ellipsis line-clamp-1">{item.title}</p>
          <div className="flex gap-2">
            {item.productType === "simple" ? (
              <>
                {item.discountedPrice !== undefined &&
                item.discountedPrice !== null ? (
                  <>
                    <span>{VND.format(Number(item.discountedPrice))}</span>
                    <span className="line-through text-neutral-400">
                      {VND.format(Number(item.price))}
                    </span>
                  </>
                ) : (
                  <>
                    <span>{VND.format(Number(item.price))}</span>
                  </>
                )}
              </>
            ) : (
              <>
                <span>
                  {VND.format(item.rangePrice?.min || 0)} -{" "}
                  {VND.format(item.rangePrice?.max || 0)}
                </span>
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardProduct;
