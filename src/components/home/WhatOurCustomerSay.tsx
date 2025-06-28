"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { GiRoundStar } from "react-icons/gi";
import { Avatar, AvatarImage } from "../ui/avatar";
import { CarouselComponent } from "../CarouselComponent";

const WhatOurCustomerSay = () => {
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
          title="What Our Customer say's"
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
          <Carousel className="w-full" setApi={setApi}>
            <CarouselContent className="-ml-1 gap-0">
              {Array.from({ length: 10 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 sm:basis-1/2 lg:basis-1/3 flex justify-center"
                >
                  <div className="p-1">
                    <Card className="xl:w-sm md:w-xs sm:w-58 w-sm gap-3">
                      <CardHeader>
                        <div className="flex gap-2">
                          {Array.from({ length: 5 }).map((i, idx) => (
                            <GiRoundStar
                              size={18}
                              key={idx}
                              className="text-yellow-500/80"
                            />
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="flex items-end justify-center w-full">
                        <div>
                          <p className="text-ellipsis line-clamp-4">
                            Lorem ipsum dolor sit amet consectetur, adipisicing
                            elit. Est, nesciunt? Officiis, soluta assumenda
                            labore distinctio reprehenderit, magnam debitis
                            consectetur pariatur aliquam a doloribus corporis
                            sint fugit. Rem natus animi nesciunt!
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-4 items-center">
                          <Avatar className="size-11">
                            <AvatarImage
                              src={
                                "https://yeudialy.edu.vn/upload/2025/02/anh-anime-nam-chibi-02.webp"
                              }
                            />
                          </Avatar>
                          <div className="flex flex-col gap-1">
                            <p className="font-bold">Leslie Alexander</p>
                            <span className="text-sm text-neutral-400">
                              Model
                            </span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-3" />
            <CarouselNext className="-right-3" />
          </Carousel>
        </div>
      </div> */}
      <CarouselComponent
        api={api}
        setApi={setApi}
        headTitle="What Our Customer say's"
      >
        <CarouselContent className="-ml-1 gap-0">
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="pl-1 sm:basis-1/2 lg:basis-1/3 flex justify-center"
            >
              <div className="p-1">
                <Card className="xl:w-sm md:w-xs sm:w-58 w-xs gap-3">
                  <CardHeader>
                    <div className="flex gap-2">
                      {Array.from({ length: 5 }).map((i, idx) => (
                        <GiRoundStar
                          size={18}
                          key={idx}
                          className="text-yellow-500/80"
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-end justify-center w-full">
                    <div>
                      <p className="text-ellipsis line-clamp-4">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Est, nesciunt? Officiis, soluta assumenda labore
                        distinctio reprehenderit, magnam debitis consectetur
                        pariatur aliquam a doloribus corporis sint fugit. Rem
                        natus animi nesciunt!
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-4 items-center">
                      <Avatar className="size-11">
                        <AvatarImage
                          src={
                            "https://yeudialy.edu.vn/upload/2025/02/anh-anime-nam-chibi-02.webp"
                          }
                        />
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <p className="font-bold">Leslie Alexander</p>
                        <span className="text-sm text-neutral-400">Model</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselComponent>
    </>
  );
};

export default WhatOurCustomerSay;
