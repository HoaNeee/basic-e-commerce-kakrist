/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import Link from "next/link";
import React from "react";

interface TNav {
  title: string;
  href?: string;
  children?: TNav[];
}

const components: TNav[] = [
  {
    title: "Men",
    href: "/docs/primitives/alert-dialog",
    children: [
      {
        title: "T-Shirts",
        href: "/",
        children: [
          {
            title: "T-Shirts-1",
            href: "/",
            children: [],
          },
        ],
      },
      {
        title: "Casual Shirts",
        href: "/",
        children: [],
      },
      {
        title: "Formal Shirts",
        href: "/",
        children: [],
      },
      {
        title: "Jackets",
        href: "/",
        children: [],
      },
      {
        title: "Blazers & Coats",
        href: "/",
        children: [],
      },
    ],
  },
  {
    title: "Women",
    href: "/docs/primitives/hover-card",
    children: [
      {
        title: "Kurtas & Suits",
        href: "/",
        children: [],
      },
      {
        title: "Sarees",
        href: "/",
        children: [],
      },
      {
        title: "Ethnic Wear",
        href: "/",
        children: [],
      },
      {
        title: "Lehenga Cholis",
        href: "/",
        children: [],
      },
      {
        title: "Jackets",
        href: "/",
        children: [],
      },
    ],
  },
  {
    title: "Footwear",
    href: "/docs/primitives/progress",
    children: [
      {
        title: "Flats",
        href: "/",
        children: [],
      },
      {
        title: "Casual Shoes",
        href: "/",
        children: [],
      },
      {
        title: "Heels",
        href: "/",
        children: [],
      },
      {
        title: "Boots",
        href: "/",
        children: [],
      },
      {
        title: "Sports Shose & Floaters",
        href: "/",
        children: [],
      },
    ],
  },
  {
    title: "Kid",
    href: "/docs/primitives/scroll-area",
    children: [
      {
        title: "T-Shirts",
        href: "/",
        children: [],
      },
      {
        title: "Shirts",
        href: "/",
        children: [],
      },
      {
        title: "Jeans",
        href: "/",
        children: [],
      },
      {
        title: "Trouser",
        href: "/",
        children: [],
      },
      {
        title: "Party Wear",
        href: "/",
        children: [],
      },
      {
        title: "Innerwear & Thermal",
        href: "/",
        children: [],
      },
      {
        title: "Track Pants",
        href: "/",
        children: [],
      },
      {
        title: "Value Pack",
        href: "/",
        children: [],
      },
    ],
  },
  {
    title: "Indian & Festive Wear",
    href: "/docs/primitives/tabs",
    children: [
      {
        title: "Kurtas & Kurta Sets",
        href: "/",
        children: [],
      },
      {
        title: "Serwanis",
        href: "/",
        children: [],
      },
    ],
  },
  {
    title: "Western Wear",
    href: "/docs/primitives/tooltip",
    children: [
      {
        title: "Dresses",
        href: "/",
        children: [],
      },
      {
        title: "Jumpsuits",
        href: "/",
        children: [],
      },
    ],
  },
  {
    title: "Product Features",
    href: "/docs/primitives/tooltip",
    children: [
      {
        title: "360 Product Viewer",
        href: "/docs/primitives/tooltip",
        children: [],
      },
      {
        title: "Product With Video",
        href: "/docs/primitives/tooltip",
        children: [],
      },
    ],
  },
];

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href?: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href || "/"}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

const renderItem = (item: TNav, level: number = 0) => {
  return (
    <ul
      key={item.title}
      className="flex flex-col gap-1 text-sm leading-none font-medium"
      style={{}}
    >
      <li
        className={`hover:bg-gray-100 p-1.5 cursor-pointer rounded-lg block`}
        style={{
          fontWeight:
            item.children && item.children.length > 0 ? 700 : undefined,
          padding:
            item.children && item.children.length > 0 ? "9px 6px" : undefined,
        }}
      >
        {item.title}
      </li>
      {(item.children || []).length > 0 &&
        item.children?.map((it) => renderItem(it, level + 1))}
    </ul>
  );
};

const MegaMenu = () => {
  return (
    <ul className="grid w-[400px] gap-2 md:w-[500px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:w-[800px] px-4 py-2">
      {components.map((component) =>
        // <NavigationMenuLink
        //   key={component.title}
        //   title={component.title}
        //   href={component.href}
        // >
        //   {Number((component?.children || []).length) > 0 &&
        //     component.children?.map((item) => (
        //       <p key={item.title}>{item.title}</p>
        //     ))}
        // </NavigationMenuLink>
        renderItem(component)
      )}
    </ul>
  );
};

export default MegaMenu;
