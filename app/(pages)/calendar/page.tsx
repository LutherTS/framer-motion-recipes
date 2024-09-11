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
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useState } from "react";
// @ts-ignore
import useKeypress from "react-use-keypress";
import useMeasure from "react-use-measure";
// import { useMeasure } from "@uidotdev/usehooks"; // pretty much works all the same

let daysLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

let motionConfigTransition = { duration: 0.2 };

let baseVariants = {
  enter: (direction: number) => {
    return { x: `${direction * 100}%`, opacity: 0 };
  },
  middle: { x: "0%", opacity: 1 },
  exit: (direction: number) => {
    return { x: `${direction * -100}%`, opacity: 0 };
  },
};

let removeImmediately = { exit: { visibility: "hidden" } };

export default function Page() {
  let [monthString, setMonthString] = useState(format(new Date(), "yyyy-MM"));
  let [direction, setDirection] = useState<number>();
  let [isAnimating, setIsAnimating] = useState(false);
  let [ref, bounds] = useMeasure();
  // let [ref, { height }] = useMeasure();

  let month = parse(monthString, "yyyy-MM", new Date());

  function nextMonth() {
    if (!isAnimating) {
      let next = addMonths(month, 1);

      setMonthString(format(next, "yyyy-MM"));
      setDirection(1);
      setIsAnimating(true);
    }
  }

  function previousMonth() {
    if (!isAnimating) {
      let previous = subMonths(month, 1);

      setMonthString(format(previous, "yyyy-MM"));
      setDirection(-1);
      setIsAnimating(true);
    }
  }

  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  useKeypress("ArrowLeft", () => {
    previousMonth();
  });

  useKeypress("ArrowRight", () => {
    nextMonth();
  });

  return (
    <MotionConfig transition={motionConfigTransition}>
      <div className="flex min-h-screen items-start bg-stone-800 pt-16 font-sans text-stone-900">
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white">
          <div className="py-8">
            <div className="flex flex-col justify-center rounded text-center">
              <motion.div
                animate={{ height: bounds.height > 0 ? bounds.height : null }}
                // animate={{ height: height > 0 ? height : null }}
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: motionConfigTransition.duration * 2,
                }}
              >
                <div ref={ref}>
                  <AnimatePresence
                    initial={false}
                    mode="popLayout"
                    custom={direction}
                    onExitComplete={() => setIsAnimating(false)}
                  >
                    <motion.div
                      key={monthString}
                      initial="enter"
                      animate="middle"
                      exit="exit"
                    >
                      <header className="relative flex justify-between px-8">
                        <motion.button
                          variants={removeImmediately}
                          className="z-10 rounded-full p-1.5 hover:bg-stone-100"
                          onClick={previousMonth}
                        >
                          <ChevronLeftIcon />
                        </motion.button>
                        <motion.p
                          variants={baseVariants}
                          custom={direction}
                          className="absolute inset-0 flex items-center justify-center font-semibold"
                        >
                          {format(month, "MMMM yyyy")}
                        </motion.p>
                        <motion.button
                          variants={removeImmediately}
                          className="z-10 rounded-full p-1.5 hover:bg-stone-100"
                          onClick={nextMonth}
                        >
                          <ChevronRightIcon />
                        </motion.button>
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, white 10%, transparent 30%, transparent 70%, white 90%)",
                          }}
                        ></div>
                      </header>
                      <motion.div
                        variants={removeImmediately}
                        className="mt-6 grid grid-cols-7 gap-y-6 px-8"
                      >
                        {daysLabels.map((dayLabel) => (
                          <span
                            className="font-medium text-stone-500"
                            key={dayLabel}
                          >
                            {dayLabel}
                          </span>
                        ))}
                      </motion.div>
                      <motion.div
                        variants={baseVariants}
                        custom={direction}
                        className="mt-6 grid grid-cols-7 gap-y-6 px-8"
                      >
                        {days.map((day) => (
                          <span
                            className={`font-semibold ${isSameMonth(day, month) ? "" : "text-stone-300"}`}
                            key={format(day, "yyyy-MM-dd")}
                          >
                            {format(day, "d")}
                          </span>
                        ))}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
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
