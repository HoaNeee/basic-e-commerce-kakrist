import HeadContent from "@/components/HeadContent";
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
  return (
    <>
      <HeadContent
        title="Setting"
        left={<></>}
        size="large"
        className="mb-8 md:hidden flex flex-col"
        desc="Your account settings"
      />
      {children}
    </>
  );
}
