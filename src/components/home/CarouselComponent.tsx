"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { FaLongArrowAltRight } from "react-icons/fa";

export function CarouselComponent() {
  return (
    <Carousel
      className="w-full relative"
      opts={{
        loop: true,
      }}
      plugins={
        [
          // Autoplay({
          //   delay: 4000,
          //   stopOnInteraction: true,
          // }),
        ]
      }
    >
      <CarouselContent className="relative">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <section className="container relative w-full mx-auto bg-no-repeat h-[492px] lg:h-[602px] bg-contain bg-center xl:px-4 bg-[url(../assets/promotions1.png)]">
              <div className="absolute bottom-1/3 xl:left-[22%] lg:left-[16%] left-[5%] flex flex-col gap-3 z-1">
                <h3 className="text-2xl font-semibold">Classic Exclusive</h3>
                <h2 className="text-3xl font-extrabold">
                  {"Women's Collection"}
                </h2>
                <p className="text-xl font-medium">UPTO 40% OFF</p>
                <div>
                  <Button className="py-6">
                    Shop now
                    <FaLongArrowAltRight />
                  </Button>
                </div>
              </div>
            </section>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
