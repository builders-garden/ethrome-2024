"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

const defaultStreak: Date[] = [
  new Date("2024-10-08T22:00:00.000Z"),
  new Date("2024-10-24T22:00:00.000Z"),
  new Date("2024-10-11T22:00:00.000Z"),
  new Date("2024-10-14T22:00:00.000Z"),
  new Date("2024-10-28T23:00:00.000Z"),
  new Date("2024-10-06T22:00:00.000Z"),
  new Date("2024-10-07T22:00:00.000Z"),
  new Date("2024-10-09T22:00:00.000Z"),
  new Date("2024-10-16T22:00:00.000Z"),
  new Date("2024-10-18T22:00:00.000Z"),
  new Date("2024-10-20T22:00:00.000Z"),
  new Date("2024-10-22T22:00:00.000Z"),
  new Date("2024-10-27T23:00:00.000Z"),
  new Date("2024-10-26T22:00:00.000Z"),
];

const CalendarStreak = () => {
  const [streak, setStreak] = useState<Date[]>(defaultStreak);

  const handleDayClick = (day: Date) => {
    const isSelected = streak.some((d) => d.getTime() === day.getTime());
    if (!isSelected) {
      setStreak((prevStreak) => [...prevStreak, day]);
    } else {
      setStreak((prevStreak) =>
        prevStreak.filter((d) => d.getTime() !== day.getTime()),
      );
    }
  };

  return (
    <div className="flex flex-col w-full px-4 rounded-xl gap-4">
      <h1 className="text-xl font-medium">Month Recap</h1>
      <Calendar
        mode="multiple"
        onDayClick={handleDayClick}
        modifiers={{ selected: streak }}
        className="flex items-center justify-center w-full"
      />
    </div>
  );
};

export default CalendarStreak;
