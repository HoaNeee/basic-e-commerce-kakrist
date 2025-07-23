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
  return <>{children}</>;
}
