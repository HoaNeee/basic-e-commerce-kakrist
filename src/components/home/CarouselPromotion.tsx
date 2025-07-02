"use client";

import * as React from "react";
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { FaLongArrowAltRight } from "react-icons/fa";
import { CarouselComponent } from "../CarouselComponent";
import { PromotionModel } from "@/models/promotionModel";
import { VND } from "@/utils/formatCurrency";

interface Props {
  promotions?: PromotionModel[];
}

export function CarouselPromotion(props: Props) {
  const { promotions } = props;
  return (
    <>
      <CarouselComponent
        opts={{
          loop: true,
        }}
        isBanner
        // autoPlay
      >
        <CarouselContent className="relative">
          {promotions && promotions.length > 0 ? (
            promotions.map((item, index) => (
              <CarouselItem key={index}>
                <section
                  className="container relative w-full mx-auto bg-no-repeat h-[290px] sm:h-[492px] lg:h-[602px] sm:bg-contain bg-cover bg-[#f3f3f3] sm:bg-top bg-center xl:px-4"
                  style={{
                    backgroundImage: `url(${item.thumbnail})`,
                  }}
                >
                  <div
                    className="absolute bottom-1/3 xl:left-[22%] lg:left-[16%] left-[6%] flex flex-col sm:gap-3 gap-1 z-1"
                    style={{
                      color: item.colorText,
                    }}
                  >
                    <h3 className="sm:text-2xl text-sm font-semibold">
                      {item.description}
                    </h3>
                    <h2 className="sm:text-3xl font-extrabold">{item.title}</h2>
                    <p className="sm:text-xl text-sm font-medium">
                      UPTO{" "}
                      {item.promotionType === "percent"
                        ? item.value
                        : VND.format(item.value)}
                      {item.promotionType === "percent" ? "%" : ""} OFF
                    </p>
                    <div>
                      <Button className="py-6">
                        Shop now
                        <FaLongArrowAltRight />
                      </Button>
                    </div>
                  </div>
                </section>
              </CarouselItem>
            ))
          ) : (
            <>
              <section className="container relative w-full mx-auto bg-no-repeat h-[492px] lg:h-[602px] bg-contain bg-[#f3f3f3] bg-top xl:px-4 bg-[url(../assets/promotions1.png)]">
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
            </>
          )}
        </CarouselContent>
      </CarouselComponent>
    </>
  );
}
