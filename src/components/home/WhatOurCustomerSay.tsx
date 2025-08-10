"use client";

import React, { useEffect, useState } from "react";

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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CarouselComponent } from "../CarouselComponent";
import { get } from "@/utils/requets";
import { ReviewModel } from "@/models/reviewModel";
import { StarIcon, User } from "lucide-react";
import { Rating, RatingButton } from "../ui/rating";

const WhatOurCustomerSay = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [reviews, setReviews] = useState<ReviewModel[]>([]);

  useEffect(() => {
    getTopReviews();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {});

    return () => {
      api.off("select", () => {});
    };
  }, [api]);

  const getTopReviews = async () => {
    try {
      const response = await get("/reviews/top-reviews?page=1&limit=5");
      setReviews(response.data.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  const renderCarouselItem = (
    item: ReviewModel | undefined,
    key: string | number
  ) => {
    return (
      <CarouselItem
        key={key}
        className="pl-1 sm:basis-1/2 lg:basis-1/3 flex justify-center"
      >
        <div className="p-1">
          <Card className="xl:w-md md:w-xs sm:w-58 w-xs gap-3">
            <CardHeader>
              {!item ? (
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <GiRoundStar
                      size={18}
                      key={idx}
                      className="text-yellow-500/80"
                    />
                  ))}
                </div>
              ) : (
                <Rating className="" readOnly defaultValue={item.star}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton
                      key={index}
                      size={18}
                      className={
                        index <= item.star - 1
                          ? "text-yellow-500/80"
                          : "text-muted-foreground"
                      }
                      //var(--muted-foreground)
                      icon={<StarIcon strokeWidth={1} />}
                      index={index}
                    />
                  ))}
                </Rating>
              )}
            </CardHeader>
            <CardContent className="flex flex-wrap w-full">
              <div className="min-h-24 max-w-full">
                <p className="text-ellipsis line-clamp-4 break-words">
                  {item?.content ||
                    `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est,
                  nesciunt? Officiis, soluta assumenda labore distinctio
                  reprehenderit, magnam debitis consectetur pariatur aliquam a
                  doloribus corporis sint fugit. Rem natus animi nesciunt!`}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-4 items-center">
                <Avatar className="size-11">
                  <AvatarImage src={item?.user?.avatar} />
                  <AvatarFallback>
                    <User size={20} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  {item?.user?.firstName && item?.user?.lastName ? (
                    <p className="font-bold">
                      {item?.user?.firstName || ""} {item?.user?.lastName || ""}
                    </p>
                  ) : (
                    <p className="font-bold">Someone</p>
                  )}
                  <span className="text-sm text-neutral-400">Customer</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </CarouselItem>
    );
  };

  return (
    <>
      <CarouselComponent
        api={api}
        setApi={setApi}
        headTitle="What Our Customer say's"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="-ml-1 gap-0">
          {reviews.length > 0
            ? reviews.map((item, index) => renderCarouselItem(item, index))
            : Array.from({ length: 10 }).map((_, index) =>
                renderCarouselItem(undefined, index)
              )}
        </CarouselContent>
      </CarouselComponent>
    </>
  );
};

export default WhatOurCustomerSay;
