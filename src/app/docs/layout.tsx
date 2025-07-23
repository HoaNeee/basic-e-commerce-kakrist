import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description: "This is document page",
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
