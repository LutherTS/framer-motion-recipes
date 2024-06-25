"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useState } from "react";

export default function Page() {
  let [monthString, setMonthString] = useState(format(new Date(), "yyyy-MM"));
  let month = parse(monthString, "yyyy-MM", new Date());

  function nextMonth() {
    let next = addMonths(month, 1);

    setMonthString(format(next, "yyyy-MM"));
  }

  function previousMonth() {
    let previous = subMonths(month, 1);

    setMonthString(format(previous, "yyyy-MM"));
  }

  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  let daysLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="flex min-h-screen items-start bg-stone-800 pt-16 font-sans text-stone-900">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white">
        <div className="py-8">
          <div className="flex flex-col justify-center rounded text-center">
            <header className="relative flex justify-between px-8">
              <button
                className="z-10 rounded-full p-1.5 hover:bg-stone-100"
                onClick={previousMonth}
              >
                <ChevronLeftIcon />
              </button>
              <p className="absolute inset-0 flex items-center justify-center font-semibold">
                {format(month, "MMMM yyyy")}
              </p>
              <button
                className="z-10 rounded-full p-1.5 hover:bg-stone-100"
                onClick={nextMonth}
              >
                <ChevronRightIcon />
              </button>
            </header>
            <div className="mt-6 grid grid-cols-7 gap-y-6 px-8">
              {daysLabels.map((dayLabel) => (
                <span className="font-medium text-stone-500" key={dayLabel}>
                  {dayLabel}
                </span>
              ))}
              {days.map((day) => (
                <span
                  className={`font-semibold ${isSameMonth(day, month) ? "" : "text-stone-300"}`}
                  key={format(day, "yyyy-MM-dd")}
                >
                  {format(day, "d")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}
