/* eslint-disable @next/next/no-img-element */
import { CarouselPromotion } from "@/components/home/CarouselPromotion";
import CategoryComponent from "@/components/category/CategoryComponent";
import OurBestSeller from "@/components/product/OurBestSeller";
import IMAGETEST from "../assets/dayofthemonth2.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import WhatOurCustomerSay from "@/components/home/WhatOurCustomerSay";
import OurInstagramStory from "@/components/home/OurInstagramStory";
import Shipping from "@/components/home/Shipping";
import { Suspense } from "react";
import { get } from "@/utils/requets";
import { CategoryModel } from "@/models/categoryModel";

export const revalidate = 3600;

async function getCategories() {
  try {
    const res = await get("/categories");
    if (res && res.data.length > 0) {
      return res.data.filter((item: CategoryModel) => item.parent_id === "");
    }
    return [];
  } catch (error) {
    console.log(error);
  }
}

const getPromotions = async () => {
  try {
    const res = await get("/promotions?page=1&limit=5");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getBestSeller = async () => {
  try {
    const api = `/products/best-seller?page=1&limit=8`;
    const response = await get(api);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default async function Home() {
  const categories = await getCategories();
  const promotions = await getPromotions();

  const bestSellerProduct = await getBestSeller();

  return (
    <main className="w-full bg-white">
      <section className="w-full">
        <CarouselPromotion promotions={promotions} />
      </section>
      <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
        <Suspense fallback={<div className="w-full">Loading...</div>}>
          <CategoryComponent categories={categories} />
        </Suspense>
      </section>
      <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
        <OurBestSeller products={bestSellerProduct} />
      </section>
      <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
        <div className="w-full flex gap-4 md:flex-row flex-col">
          <div className="md:w-4/7 w-full flex flex-col justify-center gap-6 px-4">
            <h3 className="lg:text-4xl md:text-3xl text-xl font-medium">
              Deals of the Month
            </h3>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla
              totam error voluptates quae excepturi animi inventore non
              exercitationem. Molestias tempora quaerat dolorem assumenda dicta
              corporis dolor id cupiditate ab ea?
            </p>
            <div className="flex gap-6">
              <Card className="w-20 h-20 flex flex-col gap-1 p-0 justify-center items-center">
                <p className="text-2xl font-extrabold">120</p>
                <span className="font-semibold">Days</span>
              </Card>
              <Card className="w-20 h-20 flex flex-col gap-1 p-0 justify-center items-center">
                <p className="text-2xl font-extrabold">18</p>
                <span className="font-semibold">Hours</span>
              </Card>
              <Card className="w-20 h-20 flex flex-col gap-1 p-0 justify-center items-center">
                <p className="text-2xl font-extrabold">15</p>
                <span className="font-semibold">Mins</span>
              </Card>
              <Card className="w-20 h-20 flex flex-col gap-1 p-0 justify-center items-center">
                <p className="text-2xl font-extrabold">10</p>
                <span className="font-semibold">Secs</span>
              </Card>
            </div>
            <div>
              <Button className="py-7 px-5">
                View All Products <FaLongArrowAltRight />
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <Image
              alt="this is image"
              className="w-full h-[480px] object-cover"
              src={IMAGETEST}
            />
          </div>
        </div>
      </section>
      <section className="w-full bg-[#FAFAFB]">
        <div className="container xl:px-4 py-10 mx-auto px-2 md:px-0 w-full">
          <WhatOurCustomerSay />
        </div>
      </section>
      <section className="container xl:px-4 pb-10 pt-16 mx-auto px-2 md:px-0 w-full">
        <OurInstagramStory />
      </section>
      <section className="container xl:px-4 py-10 mx-auto px-2 md:px-0 w-full">
        <Shipping />
      </section>
    </main>
  );
}
