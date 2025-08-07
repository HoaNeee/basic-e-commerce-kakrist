/* eslint-disable @typescript-eslint/no-explicit-any */
import { SystemSettingModel } from "@/models/settingSystem";
import HeaderClient from "./HeaderClient";

const Header = ({
  system_settings,
}: {
  system_settings: SystemSettingModel;
}) => {
  return (
    <>
      <header className="flex items-center justify-center w-full z-40 sticky top-0 bg-white dark:bg-black dark:text-white/80 drop-shadow-md">
        <HeaderClient system_settings={system_settings} />
      </header>
    </>
  );
};

export default Header;
