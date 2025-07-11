"use client";

import HeadContent from "@/components/HeadContent";
import {
  Settings,
  User,
  Heart,
  Package,
  MapPin,
  CreditCard,
  Bell,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs1";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  {
    name: "Personal Infomation",
    value: "/",
    icon: User,
    component: <div>Profile</div>,
  },
  {
    name: "My Order",
    value: "/order",
    icon: Package,
  },
  {
    name: "My Wishlists",
    value: "/wishlists",
    icon: Heart,
  },
  {
    name: "Manager Address",
    value: "/address",
    icon: MapPin,
  },
  {
    name: "Saved Cards",
    value: "/credit-card",
    icon: CreditCard,
  },
  {
    name: "Notifications",
    value: "/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    value: "/settings",
    icon: Settings,
  },
];

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
      <HeadContent title="My profile" left={<></>} />
      <div className="w-full">
        <Tabs
          orientation="vertical"
          value={pathName.substring(8) || "/"}
          className="w-full flex items-start gap-4 justify-center flex-row"
          onValueChange={(value) => {
            router.push(`/profile/${value}`);
          }}
        >
          <TabsList className="shrink-0 grid grid-cols-1 min-w-28 p-0 bg-background border-2 border-muted rounded-none h-full pb-6">
            <div className="py-6 px-3 border-b-2 border-muted">header</div>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="justify-start rounded-none data-[state=active]:shadow-none data-[state=active]:bg-black data-[state=active]:text-white py-4 transition-all duration-300 tracking-wider cursor-pointer px-5"
              >
                <tab.icon className="size-5 me-2" /> {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="min-h-100 w-full border rounded-md font-medium text-muted-foreground">
            {tabs.map((tab, index) => (
              <TabsContent
                key={index}
                value={tab.value}
                className="w-full h-full"
              >
                {children}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}
