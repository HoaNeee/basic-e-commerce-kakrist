import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "This is checkout page",
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
