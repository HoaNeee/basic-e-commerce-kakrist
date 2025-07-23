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
  return <>{children}</>;
}
