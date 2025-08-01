import HeadContent from "@/components/HeadContent";
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
  return (
    <>
      <HeadContent
        title="Blogs Saved"
        desc="List of blogs you have saved to read later"
        size="large"
        className="mb-8 md:hidden flex flex-col items-start"
      />
      {children}
    </>
  );
}
