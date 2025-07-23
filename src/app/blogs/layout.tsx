import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description: "This is blogs page",
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
