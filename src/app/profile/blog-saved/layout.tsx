import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Blog Saved",
  description: "This is profile page",
};

export default function BlogSavedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
