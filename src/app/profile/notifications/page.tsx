/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import { formatDistanceStrict } from "date-fns";
import { get, patch } from "@/utils/requets";
import { NotificationModel } from "@/models/notificationModel";
import Link from "next/link";
import { Bell } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      setIsLoading(true);
      const api = `/notifications`;
      const response = await get(api);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRead = async (noti_id: string) => {
    try {
      const api = `/notifications/read/${noti_id}`;
      await patch(api, undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = (item: NotificationModel) => {
    return item.type === "profile" ? (
      <Link
        href={"/profile"}
        key={item._id}
        className={`flex justify-between border-b-2 border-muted items-center transition-all duration-200 rounded py-4 px-2 relative ${
          item.isRead
            ? "hover:bg-gray-100/40 dark:hover:bg-neutral-800"
            : "bg-gray-100 dark:bg-neutral-800/90"
        }`}
        onClick={() => handleRead(item._id)}
      >
        <div className="flex md:items-center justify-between md:flex-row flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-13">
              <AvatarImage src={item.image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="font-bold">{item.title}</p>
              <p className="text-sm text-gray-400 tracking-wider">
                {item.body}
              </p>
            </div>
          </div>
          <p className="tracking-wider text-gray-400 text-sm">
            {formatDistanceStrict(new Date(item.createdAt), new Date(), {
              addSuffix: true,
            })}
          </p>
        </div>

        {!item.isRead && (
          <div className="absolute top-2 rounded-full right-2 w-1.5 h-1.5 bg-red-500" />
        )}
      </Link>
    ) : (
      <Link
        href={`${item.ref_link}#${item.ref_id}`}
        key={item._id}
        className={`flex justify-between border-b-2 border-muted items-center transition-all duration-200 rounded py-4 px-2 relative ${
          item.isRead
            ? "hover:bg-gray-100/40 dark:hover:bg-neutral-800"
            : "bg-gray-100 dark:bg-neutral-800/90"
        }`}
        onClick={() => {
          handleRead(item._id);
        }}
      >
        <div className="flex md:items-center justify-between md:flex-row flex-col gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`md:size-13 md:max-w-auto max-w-2/9 md:w-auto w-full`}
            >
              <div
                className={`w-[54px] h-[54px] rounded-full overflow-hidden flex items-center justify-center ${
                  item.isRead ? "bg-gray-100 " : "bg-gray-300"
                }`}
              >
                <img src={item.image} className="w-6 h-6 object-cover" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold">{item.title}</p>
              <p className="text-sm text-gray-400 tracking-wider">
                {item.body}
              </p>
            </div>
          </div>
          <p className="tracking-wider text-gray-400 text-sm">
            {formatDistanceStrict(new Date(item.createdAt), new Date(), {
              addSuffix: true,
            })}
          </p>
        </div>

        {!item.isRead && (
          <div className="absolute top-2 rounded-full right-2 w-1.5 h-1.5 bg-red-500" />
        )}
      </Link>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="w-full pb-5 border-b-2 border-muted flex items-center justify-between animate-pulse"
          >
            <div className="text-sm space-y-1.5">
              <div className="h-6 bg-gray-200 dark:bg-neutral-600/90 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-neutral-600/90 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-neutral-600/90 rounded w-1/2"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-8 bg-gray-200 dark:bg-neutral-600/90 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full xl:pr-10">
      {notifications && notifications.length > 0 ? (
        <div className="flex flex-col gap-1">
          {notifications.map((item) => renderItem(item))}
        </div>
      ) : (
        <div className="py-16 flex items-center justify-center">
          <div className="flex flex-col w-full h-full items-center justify-center">
            <div className="w-25 h-25 mx-auto mb-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center dark:bg-neutral-600/90 dark:text-gray-300">
              <Bell className="size-13 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2">
              No notifications found
            </h3>
            <p className="text-center text-neutral-500">
              You will see your notifications here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
