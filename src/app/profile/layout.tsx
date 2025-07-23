import HeadContent from "@/components/HeadContent";
import ProfileLayout from "@/layouts/ProfileLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "This is profile page",
};

export default function Profile({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0 dark:text-white/70">
      <HeadContent title="My profile" left={<></>} />
      <ProfileLayout>{children}</ProfileLayout>
    </section>
  );
}
