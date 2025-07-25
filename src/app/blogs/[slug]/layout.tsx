import { get } from "@/utils/requets";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const response = await get(`/blogs/detail/${slug}`);

  return {
    title: response.data.title,
    description: response.data.content,
  };
}

export default async function BlogDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
