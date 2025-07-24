import React from "react";
import { SheetClose } from "../ui/sheet";
import { House, NotebookText, Sparkles, SquareUser, Store } from "lucide-react";
import { useRouter } from "next/navigation";

const menuItems = [
  { icon: House, label: "Home", path: "/" },
  { icon: Store, label: "Shop", path: "/shop" },
  { icon: NotebookText, label: "Blogs", path: "/blogs" },
  { icon: Sparkles, label: "Our Stories", path: "/stories" },
  { icon: SquareUser, label: "Contact Us", path: "/contact" },
];

const MenuNavMobile = () => {
  const router = useRouter();
  return (
    <SheetClose asChild>
      <div className="w-full text-center">
        <ul className="flex flex-col gap-0">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className="px-0 py-5 border-b-1 border-gray-200 dark:border-white/70 w-full active:bg-gray-100"
            >
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push(item.path)}
              >
                <item.icon className="text-gray-600 ml-4 size-5" />
                <p>{item.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SheetClose>
  );
};

export default MenuNavMobile;
