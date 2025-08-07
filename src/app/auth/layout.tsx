"use client";

import { SystemSettingProvider } from "@/context/systemSettingContext";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SystemSettingProvider>{children}</SystemSettingProvider>;
}
