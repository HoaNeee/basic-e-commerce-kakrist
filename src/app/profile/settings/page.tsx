"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RootState } from "@/redux/store";
import { patch } from "@/utils/requets";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import lodash from "lodash";
import { updateSetting } from "@/redux/reducer/authReducer";
import { changeTheme } from "@/redux/reducer/settingReducer";

const Settings = () => {
  const [settingNotify, setSettingNotify] = useState<{
    notification: boolean;
    emailNotification: boolean;
  }>({
    emailNotification: true,
    notification: true,
  });

  const auth = useSelector((state: RootState) => state.auth.auth);
  const setting = useSelector((state: RootState) => state.setting.setting);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth?.setting) {
      setSettingNotify({
        notification: auth.setting.notification,
        emailNotification: auth.setting.emailNotification,
      });
    }
  }, [auth.setting]);

  const handleChangeSwitch = async ({
    notification,
    emailNotification,
  }: {
    notification: boolean;
    emailNotification: boolean;
  }) => {
    try {
      const payload = {
        notification,
        emailNotification,
      };

      const api = "/auth/profile/change-setting";
      await patch(api, payload);
      dispatch(updateSetting(payload));
    } catch (error) {
      console.log(error);
    }
  };

  const debounceChange = React.useRef(
    lodash.debounce(
      ({
        notification,
        emailNotification,
      }: {
        notification: boolean;
        emailNotification: boolean;
      }) => handleChangeSwitch({ notification, emailNotification }),
      600
    )
  ).current;

  const handleToggleTheme = (theme: string) => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.classList.add("light"); // optional
    } else {
      html.classList.remove("light"); // optional
      html.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
    dispatch(changeTheme(theme));
  };

  return (
    <div className="w-full h-full xl:pr-10">
      <div className="flex flex-col gap-1 dark:text-white/70">
        <div
          className={`flex justify-between border-b-2 border-muted items-center transition-all duration-200 rounded py-4 px-2 relative`}
          onClick={() => {}}
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold">Appearance</p>
              <p className="text-sm text-gray-400 tracking-wider">
                Customize how your theme looks on your device
              </p>
            </div>
          </div>
          <div className="tracking-wider text-sm">
            <Select
              value={setting.theme}
              onValueChange={(e) => handleToggleTheme(e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Appearance" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div
          className={`flex justify-between border-b-2 border-muted items-center transition-all duration-200 rounded py-4 px-2 relative `}
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold">Language</p>
              <p className="text-sm text-gray-400 tracking-wider">
                Select your language
              </p>
            </div>
          </div>
          <div className="tracking-wider text-sm">
            <Select defaultValue={"english"} disabled>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="vietnamese">Vietnamese</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {auth.provider === "google" && (
          <div
            className={`flex justify-between border-b-2 border-muted items-center transition-all duration-200 rounded py-4 px-2 relative `}
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-bold">Account Login</p>
                <p className="text-sm text-gray-400 tracking-wider">
                  Your account Login
                </p>
              </div>
            </div>
            <div className="tracking-wider text-sm">
              <Select defaultValue={"google"} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Social" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="google">Google</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <div
          className={`flex justify-between border-b-2 border-muted items-center transition-all duration-200 rounded py-4 px-2 relative `}
          onClick={() => {}}
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold">Push Notifications</p>
              <p className="text-sm text-gray-400 tracking-wider">
                Receive push notification
              </p>
            </div>
          </div>
          <div className="tracking-wider text-sm">
            <Switch
              className="h-7 w-12"
              thumbClassName="h-6 w-6 data-[state=checked]:translate-x-5"
              checked={settingNotify.notification}
              onCheckedChange={(e) => {
                const data = {
                  ...settingNotify,
                  notification: e,
                };
                setSettingNotify(data);
                debounceChange(data);
              }}
            />
          </div>
        </div>
        <div
          className={`flex justify-between border-b-2 border-muted items-center transition-all duration-200 rounded py-4 px-2 relative `}
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold">Email Notifications</p>
              <p className="text-sm text-gray-400 tracking-wider">
                Receive email notification
              </p>
            </div>
          </div>
          <div className="tracking-wider text-sm">
            <Switch
              className="h-7 w-12"
              thumbClassName="h-6 w-6 data-[state=checked]:translate-x-5"
              checked={settingNotify.emailNotification}
              onCheckedChange={(e) => {
                const data = {
                  ...settingNotify,
                  emailNotification: e,
                };
                setSettingNotify(data);
                debounceChange(data);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
