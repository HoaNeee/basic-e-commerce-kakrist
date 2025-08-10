import { SystemSettingModel } from "@/models/settingSystem";
import HeaderClient from "./HeaderClient";
import { HeaderGradient } from "./HeaderAnimations";

const Header = ({
  system_settings,
}: {
  system_settings: SystemSettingModel;
}) => {
  return (
    <>
      <header className="flex items-center justify-center w-full z-40 sticky top-0 border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
        <HeaderGradient>
          <HeaderClient system_settings={system_settings} />
        </HeaderGradient>
      </header>
    </>
  );
};

export default Header;
