import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "This is cart page",
};

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
