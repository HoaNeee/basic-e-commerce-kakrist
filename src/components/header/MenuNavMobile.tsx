import React from "react";
import { SheetClose } from "../ui/sheet";
import {
  Heart,
  House,
  KeyRound,
  NotebookText,
  Power,
  ShoppingCart,
  Sparkles,
  SquareUser,
  Store,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const menuItems = [
  { icon: House, label: "Home", path: "/" },
  { icon: Store, label: "Shop", path: "/shop" },
  { icon: NotebookText, label: "Blogs", path: "/blogs" },
  { icon: Sparkles, label: "Our Stories", path: "/stories" },
  { icon: SquareUser, label: "Contact Us", path: "/contact" },
];

interface Props {
  onLogout: () => void;
}

const MenuNavMobile = (props: Props) => {
  const { onLogout } = props;
  const router = useRouter();
  const pathName = usePathname();

  const auth = useSelector((state: RootState) => state.auth.auth);
  const cart = useSelector((state: RootState) => state.cart.cart);

  return (
    <SheetClose asChild>
      <div className="w-full flex-1 flex flex-col justify-between">
        <ul className="flex flex-col gap-0">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className={`px-0 py-5 border-b-1 border-gray-200 dark:border-white/70 w-full active:bg-gray-100 dark:active:bg-neutral-800 transition-all duration-300 group relative z-1 ${
                pathName.startsWith(item.path) && item.path !== "/"
                  ? "bg-gray-100 dark:bg-neutral-800"
                  : ""
              }`}
            >
              <div className="absolute -z-1 inset-0 w-full h-full group-active:bg-gray-100 dark:group-active:bg-neutral-800 group-focus:bg-gray-100 dark:group-focus:bg-neutral-800" />
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push(item.path)}
              >
                <item.icon className="text-gray-600 dark:text-white/80 ml-4 size-5" />
                <p>{item.label}</p>
              </div>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-0 py-2 pr-4 pl-2">
          <li
            className="flex items-center gap-4 cursor-pointer py-3 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 rounded-md transition-all duration-300 active:bg-gray-100 dark:active:bg-gray-800"
            onClick={() => {
              if (!auth.isLogin) {
                window.location.href = "/auth/login";
                return;
              }
              router.push("/cart");
            }}
          >
            <div className="relative">
              {cart && cart?.carts?.length > 0 && (
                <div className="absolute h-3.5 w-3.5 md:h-4 md:w-4.5 lg:-top-1.5 text-[10px] p-0 px-1 lg:-right-1 -right-2 -top-2 flex items-center justify-center bg-red-500 text-white rounded-full font-bold">
                  <span className="transition-all duration-300 ease-in-out transform translate-y-[1px]">
                    {cart?.carts?.reduce(
                      (value, item) => value + item.quantity,
                      0
                    )}
                  </span>
                </div>
              )}
              <ShoppingCart className="text-gray-600 dark:text-white/80 size-5" />{" "}
            </div>
            My Cart
          </li>
          <li
            className="flex items-center gap-4 cursor-pointer py-3 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 rounded-md transition-all duration-300 active:bg-gray-100 dark:active:bg-gray-800"
            onClick={() => {
              if (!auth.isLogin) {
                window.location.href = "/auth/login";
                return;
              }
              router.push("/profile/wishlists");
            }}
          >
            <Heart className="text-gray-600 dark:text-white/80 size-5" /> My
            Wish List
          </li>
          {auth.isLogin ? (
            <>
              <li
                className="flex items-center gap-2 cursor-pointer py-1 mt-2 px-2"
                onClick={() => router.push("/profile")}
              >
                <Avatar className="size-8">
                  <AvatarImage src={auth.avatar ? auth.avatar : ""} />
                  <AvatarFallback className="bg-gray-200 dark:bg-neutral-800">
                    <User className="text-gray-600 dark:text-white/80 size-5" />
                  </AvatarFallback>
                </Avatar>
                My Profile
              </li>
              <li
                onClick={onLogout}
                className="flex items-center gap-2 cursor-pointer py-1 hover:bg-gray-100 dark:hover:bg-gray-800 px-3.5 mt-3 rounded-md transition-all duration-300 active:bg-gray-100 dark:active:bg-gray-800 text-red-600"
              >
                <Power className="text-red-600 dark:text-red-600 size-5" />{" "}
                Logout
              </li>
            </>
          ) : (
            <li
              onClick={() => (window.location.href = "/auth/login")}
              className="flex items-center gap-2 cursor-pointer py-1 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 mt-2 rounded-md transition-all duration-300 active:bg-gray-100 dark:active:bg-gray-800"
            >
              <KeyRound className="text-gray-600 dark:text-white/80 size-5" />{" "}
              Login
            </li>
          )}
        </ul>
      </div>
    </SheetClose>
  );
};

export default MenuNavMobile;
