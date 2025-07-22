/* eslint-disable @next/next/no-img-element */
import { CarouselPromotion } from "@/components/home/CarouselPromotion";
import CategoryComponent from "@/components/category/CategoryComponent";
import OurBestSeller from "@/components/product/OurBestSeller";

import WhatOurCustomerSay from "@/components/home/WhatOurCustomerSay";
import OurInstagramStory from "@/components/home/OurInstagramStory";
import Shipping from "@/components/home/Shipping";
import { Suspense } from "react";
import { get } from "@/utils/requets";
import { CategoryModel } from "@/models/categoryModel";
import DealOfTheMonth from "@/components/home/DealOfTheMonth";

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
    <main className="w-full bg-white dark:bg-black dark:text-white/80">
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
        <DealOfTheMonth />
      </section>
      <section className="w-full bg-[#FAFAFB] dark:text-white/80 dark:bg-neutral-600">
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
