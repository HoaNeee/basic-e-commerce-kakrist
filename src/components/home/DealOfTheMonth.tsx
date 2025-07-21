/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FaLongArrowAltRight } from "react-icons/fa";
import Image from "next/image";
import IMAGETEST from "../../assets/dayofthemonth2.png";
import { get } from "@/utils/requets";
import { PromotionModel } from "@/models/promotionModel";
import {
  type Duration,
  intervalToDuration,
  formatDistanceToNowStrict,
} from "date-fns";
import Link from "next/link";

const DealOfTheMonth = () => {
  const [deal, setDeal] = useState<PromotionModel>();
  const [endAt, setEndAt] = useState(
    new Date(`1/1/${new Date().getFullYear() + 1}`)
  );
  const [intervalToDate, setIntervalToDate] = useState<Duration>();

  useEffect(() => {
    const interval = setInterval(() => {
      const intervalCurrent = intervalToDuration({
        start: new Date(),
        end: endAt,
      });
      setIntervalToDate(intervalCurrent);
    }, 1000);

    if (endAt.getTime() < new Date().getTime()) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [intervalToDate]);

  useEffect(() => {
    getDeal();
  }, []);

  const getDeal = async () => {
    try {
      const api = "/promotions/deal-of-month";
      const response = await get(api);
      setDeal(response.data);
      if (response.data.endAt) {
        setEndAt(response.data.endAt);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const add0toNumber = (num: number) => {
    if (num < 10) {
      return `0${num}`;
    }
    return num;
  };

  const renderTime = (interval?: Duration) => {
    if (!interval) return;
    const days = formatDistanceToNowStrict(endAt, {
      unit: "day",
    }).split(" ")[0];

    return (
      <div className="flex gap-6">
        <Card className="w-20 h-20 flex flex-col gap-1 p-0 justify-center items-center">
          <p className="text-2xl font-extrabold">{days}</p>
          <span className="font-semibold">Days</span>
        </Card>
        <Card className="w-20 h-20 flex flex-col gap-1 p-0 justify-center items-center">
          <p className="text-2xl font-extrabold">
            {add0toNumber(interval.hours || 0) || "00"}
          </p>
          <span className="font-semibold">Hours</span>
        </Card>
        <Card className="w-20 h-20 flex flex-col gap-1 p-0 justify-center items-center">
          <p className="text-2xl font-extrabold">
            {add0toNumber(interval?.minutes || 0) || "00"}
          </p>
          <span className="font-semibold">Mins</span>
        </Card>
        <Card className="w-20 h-20 flex flex-col gap-1 p-0 justify-center items-center">
          <p className="text-2xl font-extrabold">
            {add0toNumber(interval?.seconds || 0) || "00"}
          </p>
          <span className="font-semibold">Secs</span>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full flex gap-4 md:flex-row flex-col">
      <div className="md:w-4/7 w-full flex flex-col justify-center gap-6 px-4">
        <h3 className="lg:text-4xl md:text-3xl text-xl font-medium">
          Deals of the Month
        </h3>
        <p className="font-bold text-xl">{deal?.title}</p>
        <p>
          {`${deal?.description}, ` +
            `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla totam
          error voluptates quae excepturi animi inventore non exercitationem.
          Molestias tempora quaerat dolorem assumenda dicta corporis dolor id
          cupiditate ab ea?`}
        </p>
        {renderTime(intervalToDate)}
        <div>
          <Link href={"/shop"}>
            <Button className="py-7 px-5">
              View All Products <FaLongArrowAltRight />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1">
        {deal?.thumbnail ? (
          <img
            src={deal.thumbnail}
            alt={deal.title}
            className="w-full h-[480px] object-cover"
          />
        ) : (
          <Image
            alt="this is image"
            className="w-full h-[480px] object-cover"
            src={IMAGETEST}
          />
        )}
      </div>
    </div>
  );
};

export default DealOfTheMonth;
