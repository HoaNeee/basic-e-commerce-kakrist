import { SystemSettingModel } from "@/models/settingSystem";
import { get } from "@/utils/requets";
import { createContext, useEffect, useState } from "react";

const SystemSettingContext = createContext({
  system_settings: null as SystemSettingModel | null,
});

const SystemSettingProvider = ({ children }: { children: React.ReactNode }) => {
  const [system_settings, setSystem_settings] =
    useState<SystemSettingModel | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await get("/settings");
        setSystem_settings(res.data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SystemSettingContext.Provider value={{ system_settings }}>
      {children}
    </SystemSettingContext.Provider>
  );
};

export { SystemSettingContext, SystemSettingProvider };
