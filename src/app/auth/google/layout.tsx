import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Checking...",
  description: "Redirecting to Google login...",
};

export default function CheckingLoginGoogleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense fallback={<></>}>{children}</Suspense>;
}
