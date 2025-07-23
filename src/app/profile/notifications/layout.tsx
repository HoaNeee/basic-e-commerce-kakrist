import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "This is profile page",
};

export default function NotificationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
