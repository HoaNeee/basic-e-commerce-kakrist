import HeadContent from "@/components/HeadContent";
import ProfileLayout from "@/layouts/ProfileLayout";

export default async function Profile({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
      <HeadContent title="My profile" left={<></>} />
      <ProfileLayout>{children}</ProfileLayout>
    </section>
  );
}
