import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories",
  description: "This is stories page",
};

export default function StoriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
