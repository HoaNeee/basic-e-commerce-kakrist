"use client";

import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import HeadContent from "../HeadContent";

const CategoryComponent = () => {
  return (
    <div className="w-full">
      <HeadContent
        title="Shop by Categories"
        styles={{
          justifyContent: "space-between",
        }}
      />
      <div className="w-full">
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {Array.from({ length: 10 }).map((_, index) => (
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
          <CarouselPrevious className="-left-3" />
          <CarouselNext className="-right-3" />
        </Carousel>
      </div>
    </div>
  );
};

export default CategoryComponent;
