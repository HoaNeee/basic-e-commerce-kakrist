import { Suspense } from "react";

export default function OrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>{children}</Suspense>
    </>
  );
}
