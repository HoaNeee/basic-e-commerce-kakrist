import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "This is contact page",
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
