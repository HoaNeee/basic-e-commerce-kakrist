import { SystemSettingModel } from "@/models/settingSystem";
import HeaderClient from "./HeaderClient";
import { HeaderGradient } from "./HeaderAnimations";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const Header = ({
  system_settings,
  jwt_token,
}: {
  system_settings: SystemSettingModel;
  jwt_token: RequestCookie | undefined;
}) => {
  return (
    <header className="flex items-center justify-center w-full z-40 sticky top-0 border-b border-gray-100 dark:border-gray-800 transition-all duration-300 dark:text-white/80">
      <HeaderGradient>
        <HeaderClient system_settings={system_settings} jwt_token={jwt_token} />
      </HeaderGradient>
    </header>
  );
};

export default Header;
