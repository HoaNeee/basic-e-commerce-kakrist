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
} from "@/components/ui/navigation-menu";
import MegaMenu from "./MegaMenu";
import { get } from "@/utils/requets";
import { createTree } from "@/utils/createTree";
import { CategoryModel } from "@/models/categoryModel";
import { usePathname } from "next/navigation";

export function MenuNav() {
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  const pathName = usePathname();

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
    <NavigationMenu className="" viewport={false}>
      <NavigationMenuList className="xl:gap-4 lg:gap-2 gap-0">
        <NavigationMenuItem className={``}>
          <NavigationMenuLink asChild>
            <Link href={"/"} className={`lg:text-base text-sm`}>
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className={``}>
          <NavigationMenuTrigger
            className={`${
              pathName.startsWith("/shop")
                ? "bg-neutral-100 dark:bg-neutral-800"
                : ""
            }`}
          >
            <NavigationMenuLink asChild className={``}>
              <Link
                href={"/shop"}
                className="lg:text-base text-sm hover:bg-transparent data-[active=true]:bg-transparent focus:bg-transparent focus-visible:bg-transparent"
              >
                Shop
              </Link>
            </NavigationMenuLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent
            className="-left-30 lg:-left-50 z-999"
            style={{
              zIndex: 99,
            }}
          >
            <MegaMenu categories={categories} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={`${
              pathName.startsWith("/blogs")
                ? "bg-neutral-100 dark:bg-neutral-800"
                : ""
            }`}
          >
            <Link href={"/blogs"} className="lg:text-base text-sm">
              Blog
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={`${
              pathName.startsWith("/stories")
                ? "bg-neutral-100 dark:bg-neutral-800"
                : ""
            }`}
          >
            <Link href={"/stories"} className="lg:text-base text-sm">
              Our Story
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={`${
              pathName.startsWith("/contact")
                ? "bg-neutral-100 dark:bg-neutral-800"
                : ""
            }`}
          >
            <Link href={"/contact"} className="lg:text-base text-sm">
              Contact Us
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
