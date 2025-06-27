/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import HeadContent from "../HeadContent";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { FaRegStar } from "react-icons/fa";
import { TbSwitchHorizontal } from "react-icons/tb";
import { IoEyeOutline } from "react-icons/io5";

const OurBestSeller = () => {
  const arr: any[] = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="w-full h-full">
      <HeadContent title="Our Bestseller" />
      <div className="flex flex-wrap gap-6 w-full">
        {arr.map((_it, index) => (
          <Card
            key={index}
            className="lg:w-[calc(100%/4-20px)] w-[calc(100%/2-18px)] md:w-42 md:h-88 h-98 xl:h-108 rounded-sm overflow-hidden gap-4 border-0 shadow-none py-0 group"
          >
            <CardContent className="px-0 relative w-full h-full bg-no-repeat bg-cover bg-[url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D)]">
              <div className="">
                {/* opacity-0 group-hover:opacity-100 */}
                <div className="absolute group-hover:right-2 -right-full top-4 flex flex-col gap-1.5 invisible group-hover:visible transition-all duration-300 ">
                  <Button variant={"outline"} className="rounded-full h-8 w-8">
                    <FaRegStar />
                  </Button>
                  <Button variant={"outline"} className="rounded-full h-8 w-8">
                    <TbSwitchHorizontal />
                  </Button>
                  <Button variant={"outline"} className="rounded-full h-8 w-8">
                    <IoEyeOutline />
                  </Button>
                </div>
                <div className="w-full absolute bottom-5 -left-full group-hover:left-0 flex justify-center invisible group-hover:visible transition-all duration-300">
                  <Button
                    className="cursor-pointer w-2/3 py-5"
                    variant={"outline"}
                  >
                    Add to cart
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-2 pb-1">
              <div className="flex flex-col gap-1.5 text-sm ">
                <p className="font-bold">Roadstar</p>
                <p className="font-medium">Printed Cotton T-Shirt</p>
                <div className="flex gap-2">
                  <span>$38.00</span>
                  <span className="line-through text-neutral-400">$40.00</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OurBestSeller;
