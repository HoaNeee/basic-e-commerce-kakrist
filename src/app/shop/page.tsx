"use client";
import { Rating, RatingButton } from "@/components/ui/rating";
import { Spinner } from "@/components/ui/spinner";
import React from "react";

const Shop = () => {
  return (
    <div>
      <Spinner />
      <Rating
        onValueChange={(e) => {
          console.log(e);
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => {
          return <RatingButton key={index} />;
        })}
      </Rating>
    </div>
  );
};

export default Shop;
