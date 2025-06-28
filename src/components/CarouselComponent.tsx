"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselApi } from "@/components/ui/carousel";
import HeadContent from "./HeadContent";
import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { Button } from "./ui/button";

interface Props {
  autoPlay?: boolean;
  opts?: Partial<unknown>;
  children: React.ReactNode;
  setApi?: (api: CarouselApi) => void;
  isBanner?: boolean;
  api?: CarouselApi;
  headTitle?: string;
}

export function CarouselComponent(props: Props) {
  const { autoPlay, opts, children, setApi, isBanner, api, headTitle } = props;

  return (
    <div className="w-full">
      {!isBanner ? (
        <>
          <HeadContent
            title={headTitle}
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
        </>
      ) : (
        <></>
      )}
      <div className="w-full">
        <Carousel
          className="w-full relative"
          opts={opts}
          plugins={
            autoPlay
              ? [
                  Autoplay({
                    delay: 4000,
                    stopOnInteraction: true,
                  }),
                ]
              : undefined
          }
          setApi={setApi}
        >
          {children}
        </Carousel>
      </div>
    </div>
  );
}
