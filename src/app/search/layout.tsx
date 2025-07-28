import { Suspense } from "react";

export const generateMetadata = () => {
  return {
    title: "Search Results",
    description: "Search for products, blogs, and more",
  };
};

export default function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-white dark:bg-black"></div>}
    >
      {children}
    </Suspense>
  );
}
