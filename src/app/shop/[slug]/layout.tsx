import { get } from "@/utils/requets";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const response = await get(`/products/detail/${slug}`);

  return {
    title: response.data.product.title,
    description: response.data.product.content,
  };
}

export default async function ProductDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log(slug);

  return <>{children}</>;
}
