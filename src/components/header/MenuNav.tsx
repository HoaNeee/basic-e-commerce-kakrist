"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import MegaMenu from "./MegaMenu";
import { get } from "@/utils/requets";
import { createTree } from "@/utils/createTree";
import { CategoryModel } from "@/models/categoryModel";

export function MenuNav() {
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await get("/categories");
      setCategories(createTree(response.data, "", "_id"));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <NavigationMenu viewport={false} className="">
      <NavigationMenuList className="xl:gap-4 lg:gap-2 gap-0">
        <NavigationMenuItem className="">
          <NavigationMenuLink asChild>
            <Link href={"/"} className="lg:text-[16px] text-sm">
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="">
          <NavigationMenuTrigger className="lg:text-[16px] text-sm">
            <NavigationMenuLink asChild>
              <Link href={"/shop"} className="lg:text-[16px] text-sm">
                Shop
              </Link>
            </NavigationMenuLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent
            className="-left-40 lg:-left-60 z-999"
            style={{
              zIndex: 99,
            }}
          >
            <MegaMenu categories={categories} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={"/blogs"} className="lg:text-[16px] text-sm">
              Blog
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/docs" className="lg:text-[16px] text-sm">
              Docs
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={"/stories"} className="lg:text-[16px] text-sm">
              Our Story
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={"/contact"} className="lg:text-[16px] text-sm">
              Contact Us
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
