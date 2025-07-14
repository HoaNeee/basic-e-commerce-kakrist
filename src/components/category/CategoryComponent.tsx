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

interface Props {
  categories?: CategoryModel[];
}

const CategoryComponent = (props: Props) => {
  const { categories } = props;

  const [api, setApi] = React.useState<CarouselApi>();

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
      {/* <div className="w-full">
        <HeadContent
          title="Shop by Categories"
          styles={{
            justifyContent: "space-between",
          }}
          left={
            <div className="flex gap-3 mr-2">
              <Button variant={"outline"} onClick={() => api?.scrollPrev()}>
                <FaArrowLeftLong />
              </Button>
              <Button variant={"outline"} onClick={() => api?.scrollNext()}>
                <FaArrowRight />
              </Button>
            </div>
          }
        />

        <div className="w-full">
          <Carousel
            className="w-full"
            opts={{
              dragFree: true,
              slidesToScroll: 2,
            }}
            setApi={setApi}
          >
            <CarouselContent className="-ml-1">
              {Array.from({ length: 7 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 md:basis-1/3 sm:basis-1/2 lg:basis-1/4 flex justify-center"
                >
                  <div className="p-1 w-full max-w-xs">
                    <Card className="relative rounded-md bg-[url(https://previews.123rf.com/images/puhhha/puhhha1802/puhhha180200524/95438559-summer-fashion-look-woman-in-colorful-clothes-beautiful-female-model-in-fashionable-pink-dress-and-s.jpg)] bg-cover bg-no-repeat">
                      <CardContent className="flex aspect-square items-end justify-center">
                        <div className="w-full">
                          <Button variant={"outline"} className="w-full">
                            <span className="font-medium">Casual Wear</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div> */}
      <CarouselComponent
        api={api}
        setApi={setApi}
        opts={{
          dragFree: true,
          slidesToScroll: 2,
        }}
        headTitle="Shop by Categories"
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
                      className="flex aspect-square items-end justify-center bg-contain bg-no-repeat bg-center"
                      style={{
                        backgroundImage: `url(${item?.thumbnail})`,
                      }}
                    >
                      <div className="w-full">
                        <Button
                          variant={"outline"}
                          className="w-full shadow"
                          asChild
                        >
                          <Link
                            href={`/shop?filter_cats=${item._id}`}
                            className="font-medium h-full w-full inline-block py-3.5 tracking-wider"
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
