"use client";

import * as React from "react";
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

export function MenuNav() {
  return (
    <NavigationMenu viewport={false} className="">
      <NavigationMenuList className="xl:gap-4 gap-2">
        <NavigationMenuItem className="">
          <NavigationMenuLink asChild>
            <Link href={"/"} className="xl:text-[16px] text-sm">
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="">
          <NavigationMenuTrigger className="lg:text-[16px] text-sm">
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent
            className="-left-40 lg:-left-60 z-999"
            style={{
              zIndex: 99,
            }}
          >
            <MegaMenu />
          </NavigationMenuContent>
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
            <Link href={"/"} className="lg:text-[16px] text-sm">
              Our Story
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={"/"} className="lg:text-[16px] text-sm">
              Blog
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={"/"} className="lg:text-[16px] text-sm">
              Contact Us
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
