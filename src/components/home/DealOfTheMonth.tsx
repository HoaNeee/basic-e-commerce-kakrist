/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { ButtonTransition } from "../ui/button";
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
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
          Deal of the Month
        </h2>

        <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {deal?.title || "Exclusive Fashion Collection"}
        </h3>
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
            <ButtonTransition className="py-4 px-5">
              View All Products <FaLongArrowAltRight />
            </ButtonTransition>
          </Link>
        </div>
      </div>
      <div className="flex-1">
        <div className="w-full h-[480px] relative overflow-hidden rounded-lg shadow-lg">
          {deal?.thumbnail ? (
            <img
              src={deal.thumbnail}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              alt="this is image"
              className="w-full h-full object-cover"
              src={IMAGETEST}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DealOfTheMonth;
