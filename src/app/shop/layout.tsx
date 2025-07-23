import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "This is shop page, one of main pages",
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
