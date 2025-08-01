import HeadContent from "@/components/HeadContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Address",
  description: "This is profile page",
};

export default function AddressLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeadContent
        title="My Address"
        desc="List of your address for delivery"
        size="large"
        className="mb-8 md:hidden flex flex-col items-start"
      />
      {children}
    </>
  );
}
