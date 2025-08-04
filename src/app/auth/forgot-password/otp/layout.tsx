import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enter OTP",
  description: "This is enter OTP page, part of authentication flow",
};

export default function EnterOTPLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
