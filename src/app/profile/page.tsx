import HeadContent from "@/components/HeadContent";
import React from "react";
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

const tabs = [
  {
    name: "Personal Infomation",
    value: "profile",
    icon: User,
    component: <div>Profile</div>,
  },
  {
    name: "My Order",
    value: "my-order",
    icon: Package,
    component: <div>Profile</div>,
  },
  {
    name: "My Wishlists",
    value: "wishlists",
    icon: Heart,
    component: <div>Profile</div>,
  },
  {
    name: "Manager Address",
    value: "address",
    icon: MapPin,
    component: <div>Profile</div>,
  },
  {
    name: "Saved Cards",
    value: "credit-card",
    icon: CreditCard,
    component: <div>Profile</div>,
  },
  {
    name: "Notifications",
    value: "notifications",
    icon: Bell,
    component: <div>Profile</div>,
  },
  {
    name: "Settings",
    value: "settings",
    icon: Settings,
    component: <div>Profile</div>,
  },
];

const Profile = () => {
  return (
    <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
      <HeadContent title="My profile" left={<></>} />
      <div className="w-full">
        {" "}
        <Tabs
          orientation="vertical"
          defaultValue={tabs[0].value}
          className="w-full flex items-start gap-4 justify-center flex-row"
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
                {tab.component}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Profile;
