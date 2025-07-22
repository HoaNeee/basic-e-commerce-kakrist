import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./provider";
import MainLayout from "@/layouts/MainLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home",
  description: "This page is home page",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const token = (await cookies()).get("jwt_token");
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
          <MainLayout>{children}</MainLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
