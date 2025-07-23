import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "This is login page",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
