import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setting",
  description: "This is profile page",
};

export default function SettingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
