/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryModel } from "@/models/categoryModel";
import Link from "next/link";
import React from "react";
import { NavigationMenuLink } from "../ui/navigation-menu";

interface Props {
  categories?: CategoryModel[];
}

const MegaMenu = (props: Props) => {
  const { categories } = props;

  const renderItem = (item: CategoryModel, level: number = 0) => {
    return (
      <ul
        key={item.title}
        className="inline-flex flex-col gap-1 text-sm leading-none font-medium h-max"
      >
        <NavigationMenuLink
          className={`hover:bg-gray-100 p-1.5 cursor-pointer rounded-lg block`}
          style={{
            fontWeight:
              item.children && item.children.length > 0 ? 700 : undefined,
            padding:
              item.children && item.children.length > 0 ? "9px 6px" : undefined,
          }}
          asChild
        >
          <Link
            href={`/shop?filter_cats=${item._id}`}
            className="w-full h-full"
          >
            {item.title}
          </Link>
        </NavigationMenuLink>
        {(item.children || []).length > 0 &&
          item.children?.map((it) => renderItem(it, level + 1))}
      </ul>
    );
  };

  //sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
  return categories && categories.length > 0 ? (
    <ul className="grid w-[400px] gap-2 md:w-[500px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:w-[800px] px-4 py-2">
      {categories?.map((component) =>
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
  ) : (
    <div className="w-[400px] md:w-[500px] lg:w-[800px] px-4 py-2">
      <p>No data</p>
    </div>
  );
};

export default MegaMenu;
