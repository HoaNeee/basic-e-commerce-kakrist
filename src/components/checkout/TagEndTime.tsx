/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { type Duration, intervalToDuration } from "date-fns";

interface Props {
  isProceed?: boolean;
  onCancel?: () => void;
  currentEndTime?: Date;
}

const TagEndTime = ({ isProceed, onCancel, currentEndTime }: Props) => {
  const [intervalEndTransaction, setIntervalEndTransaction] =
    useState<Duration>();

  useEffect(() => {
    let interval: any;
    if (currentEndTime && isProceed) {
      interval = setInterval(() => {
        const intervalCurrent = intervalToDuration({
          start: new Date(),
          end: currentEndTime,
        });
        setIntervalEndTransaction(intervalCurrent);
      }, 1000);

      if (currentEndTime.getTime() < new Date().getTime()) {
        onCancel?.();
        clearInterval(interval);
      }
    } else if (!isProceed) {
      clearInterval(interval);
    } else if (!currentEndTime) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [currentEndTime, isProceed, intervalEndTransaction]);

  const add0toNumber = (num: number) => {
    if (num < 10) {
      return `0${num}`;
    }
    return num;
  };

  const renderTime = (interval?: Duration) => {
    if (!interval) return <div>00 : 00</div>;

    return (
      <div className="flex gap-2 items-center">{`${add0toNumber(
        interval.minutes || 0
      )}m : ${add0toNumber(interval.seconds || 0)}s`}</div>
    );
  };

  return (
    <div
      className={`fixed right-5 top-25 w-40 bg-white rounded-sm text-sm shadow-lg p-4 z-50 ${
        isProceed
          ? "opacity-100 visible pointer-events-auto"
          : "opacity-0 pointer-events-none invisible"
      }  transition-all duration-300`}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white">
        Time Remaining
      </h3>
      <div className="text-gray-600 dark:text-gray-400">
        {renderTime(intervalEndTransaction)}
      </div>
    </div>
  );
};

export default TagEndTime;
