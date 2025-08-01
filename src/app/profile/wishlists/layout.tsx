import HeadContent from "@/components/HeadContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlists",
  description: "This is profile page",
};

export default function WishlistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeadContent
        title="My Wishlists"
        desc="List of products you have added to your wishlists"
        size="large"
        className="mb-8 md:hidden flex flex-col items-start"
      />
      {children}
    </>
  );
}
