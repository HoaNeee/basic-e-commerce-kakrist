import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "This is forgot password page, part of authentication flow",
};

export default function ForgotPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
