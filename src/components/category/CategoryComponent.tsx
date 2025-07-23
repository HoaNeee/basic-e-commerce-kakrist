/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { CarouselComponent } from "../CarouselComponent";
import { CategoryModel } from "@/models/categoryModel";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Props {
  categories?: CategoryModel[];
}

const CategoryComponent = (props: Props) => {
  const { categories } = props;

  const [api, setApi] = React.useState<CarouselApi>();
  const setting = useSelector((state: RootState) => state.setting.setting);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {});

    return () => {
      api.off("select", () => {});
    };
  }, [api]);

  return (
    <>
      <CarouselComponent
        api={api}
        setApi={setApi}
        opts={{
          dragFree: true,
          slidesToScroll: 2,
        }}
        headTitle="Shop by Categories"
        autoPlay
      >
        <CarouselContent className="-ml-1">
          {categories &&
            categories.map((item, index) => (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/3 sm:basis-1/2 lg:basis-1/4 flex justify-center bg-[##F0F0F2]"
              >
                <div className="p-1 w-full max-w-xs">
                  <Card className="relative rounded-md ">
                    <CardContent
                      className="flex aspect-square items-end justify-center bg-contain bg-no-repeat bg-center "
                      style={{
                        backgroundImage: `url(${item?.thumbnail})`,
                      }}
                    >
                      <div className="w-full">
                        <Button
                          variant={
                            setting.theme !== "dark" ? "outline" : undefined
                          }
                          className="w-full shadow dark:bg-white"
                          asChild
                        >
                          <Link
                            href={`/shop?filter_cats=${item._id}`}
                            className="font-medium h-full w-full inline-block py-3.5 tracking-wider dark:bg-white"
                          >
                            {item.title}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
      </CarouselComponent>
    </>
  );
};

export default CategoryComponent;
