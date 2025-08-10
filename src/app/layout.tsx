import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./provider";
import MainLayout from "@/layouts/MainLayout";
import { get } from "@/utils/requets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const getSetting = async () => {
  try {
    const res = await get(`/settings`);
    return res.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};

export const generateMetadata = async (): Promise<Metadata> => {
  const setting = await getSetting();
  return {
    title: "Home",
    description:
      setting?.description || "This is a basic e-commerce application",
    keywords: setting?.keywords || "e-commerce, shop, online store",
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const system_settings = await getSetting();

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: ` 
                  const theme = (localStorage.getItem('theme') ?? 'light');
                  if(document){
                    if(!document.documentElement.classList.contains(theme) && theme === 'dark'){
                      document.documentElement.classList.add(theme)
                    }
                  };
                `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <MainLayout system_settings={system_settings}>{children}</MainLayout>
        </ReduxProvider>
      </body>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
    </html>
  );
}
