import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "This is profile page",
};

export default function OrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
