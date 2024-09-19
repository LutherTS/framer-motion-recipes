"use client";

import {
  MotionValue,
  easeIn,
  easeInOut,
  easeOut,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState } from "react";

const clamp = (
  value: MotionValue<number>,
  newValue: number,
  min: number,
  max: number,
) => {
  value.set(Math.min(Math.max(newValue, min), max));
};

const useBoundedScroll = (start: number, end: number) => {
  let { scrollY } = useScroll();
  let scrollYBounded = useMotionValue(start);
  let scrollYBoundedPercentage = useTransform(
    scrollYBounded,
    [start, end],
    [0, 1],
  );

  useMotionValueEvent(scrollY, "change", (current) => {
    console.log("Page scroll: ", current);

    let previous = scrollY.getPrevious();
    let diff = previous ? current - previous : 0;

    let newScrollYBounded = scrollYBounded.get() + diff;
    clamp(scrollYBounded, newScrollYBounded, start, end);
  });

  return { scrollYBounded, scrollYBoundedPercentage };
};

export default function FixedHeaderPartCleanedPage() {
  let { scrollYBoundedPercentage } = useBoundedScroll(0, 450);
  let scrollYBoundedOrganized = useTransform(
    scrollYBoundedPercentage,
    [0, 0.3, 0.8, 0.9, 1],
    [0, 0, 0.7, 1, 1],
    { ease: [easeInOut, easeIn, easeOut, easeInOut] },
  );

  let height = useTransform(scrollYBoundedOrganized, [0, 1], [80, 50]);
  let opacity = useTransform(scrollYBoundedOrganized, [0, 1], [1, 0]);
  let scale = useTransform(scrollYBoundedOrganized, [0, 1], [1, 0.9]);
  let backgroundColor = useMotionTemplate`rgb(255 255 255 / ${useTransform(scrollYBoundedOrganized, [0, 1], [1, 0.1])})`;

  // using state to remove nav from the DOM once it's invisible
  const [isNavHidden, setIsNavHidden] = useState(false);
  useMotionValueEvent(opacity, "change", (current) => {
    if (current > 0.01) setIsNavHidden(false);
    else setIsNavHidden(true);
  });
  // https://youtu.be/qc2kQcicNNc?si=pxr0YyCu5THWIJBB&t=320

  let { scrollYProgress } = useScroll();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 overflow-hidden font-sans text-slate-600">
      <div className="z-0 flex-1 overflow-y-scroll">
        <motion.header
          style={{ height, backgroundColor }}
          className="fixed inset-x-0 flex shadow backdrop-blur-md"
        >
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-8">
            <motion.p
              style={{ scale }}
              className="flex origin-left items-center text-xl font-semibold uppercase"
            >
              <span className="-ml-1.5 inline-block -rotate-90 text-[10px] leading-[0]">
                The
              </span>
              <span className="-ml-1 text-2xl tracking-[-.075em]">
                Daily Bugle
              </span>
            </motion.p>
            {!isNavHidden && (
              <motion.nav
                style={{ opacity }}
                className={`flex space-x-4 font-mono text-xs font-medium text-slate-400`}
              >
                <a href="#">News</a>
                <a href="#">Sports</a>
                <a href="#">Culture</a>
              </motion.nav>
            )}
          </div>
        </motion.header>

        <main className="px-8 pt-28">
          <h1 className="h-10 w-4/5 rounded bg-slate-200 text-2xl font-bold" />
          <div className="mt-8 space-y-6">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="space-y-2 text-sm">
                <p className="h-4 w-5/6 rounded bg-slate-200" />
                <p className="h-4 rounded bg-slate-200" />
                <p className="h-4 w-4/6 rounded bg-slate-200" />
              </div>
            ))}
            <div className="h-64 rounded bg-slate-200"></div>
            {Array.from({ length: 90 }, (_, i) => (
              <div key={i} className="space-y-2 text-sm">
                <p className="h-4 w-5/6 rounded bg-slate-200" />
                <p className="h-4 rounded bg-slate-200" />
                <p className="h-4 w-4/6 rounded bg-slate-200" />
              </div>
            ))}
            <div className="h-8"></div>
          </div>
        </main>
      </div>
      <motion.div
        className="fixed inset-x-0 bottom-0 h-2 origin-left bg-red-500"
        style={{ scaleX: scrollYProgress }}
      ></motion.div>
    </div>
  );
}
