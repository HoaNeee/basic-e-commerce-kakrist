"use client";
import CardProduct from "@/components/product/CardProduct";
import { Button } from "@/components/ui/button";
import { ProductModel } from "@/models/productModel";
import { get } from "@/utils/requets";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GrAppsRounded } from "react-icons/gr";
import { RiListCheck2 } from "react-icons/ri";
import { RiArrowDownSLine } from "react-icons/ri";

const Shop = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [limit, setLimit] = useState(15);

  const params = useSearchParams();

  const filter_cats = params.get("filter_cats");

  useEffect(() => {
    getProducts();
  }, [filter_cats]);

  const getProducts = async () => {
    try {
      const response = await get(
        `/products?filter_cats=${filter_cats || ""}&page=1&limit=${limit}`
      );

      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
      <div className="flex">
        <div className="w-1/4">Filter</div>
        <div className="flex-1">
          <div className="flex tracking-wider text-sm justify-between items-center">
            <div className="flex items-center gap-3">
              <GrAppsRounded size={21} />
              <RiListCheck2 size={21} />
              <p>Showing 1-16 of 72 results</p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant={"ghost"}>
                <p>Short by latest</p>
                <RiArrowDownSLine size={18} />
              </Button>
            </div>
          </div>
          <div className="mt-4">
            {products.length > 0 ? (
              <div className="grid lg:grid-cols-3 grid-cols-2 w-full gap-8">
                {products.map((item) => (
                  <CardProduct key={item._id} item={item} control />
                ))}
              </div>
            ) : (
              <div>No data</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
