import HeadContent from "@/components/HeadContent";
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
  return (
    <>
      <HeadContent
        title="My Notifications"
        desc="List of all your notifications"
        size="large"
        className="mb-8 md:hidden flex flex-col items-start"
      />
      {children}
    </>
  );
}
