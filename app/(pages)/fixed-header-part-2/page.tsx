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

const clamp = (
  value: MotionValue<number>,
  newValue: number,
  min: number,
  max: number,
) => {
  value.set(Math.min(Math.max(newValue, min), max));
};

/* Insert notes
Two things here:
- In order to implement a delay, that useBoundedScroll range does not have start at 0.
- In to arrange the speeds, useTransfrom range can integrate more entries.
Actually the delay can be implemented straight on useTransform.
*/

// ...this at this time can still be optimized
// scrollYBoundedDelay and scrollYBoundedOrganized are outside the custom hook because unlike scrollYBounded and scrollYBoundedPercentage, they are customizable
const useBoundedScroll = (start: number, end: number) => {
  let { scrollY } = useScroll();
  let scrollYBounded = useMotionValue(start);
  // originally scrollYBoundedProgress
  let scrollYBoundedPercentage = useTransform(
    scrollYBounded,
    [start, end],
    [0, 1],
  );

  useMotionValueEvent(scrollY, "change", (current) => {
    let previous = scrollY.getPrevious();
    let diff = previous ? current - previous : 0;

    // modified to + to scroll up to the bounds (original name)
    // if we scroll up, current - previous is negative so it goes to the 0 by substracting (10 - 11 = -1)
    // if we scroll down, current - previous is positive so it goes to the bounds by adding (11 - 10 = +1)
    let newScrollYBounded = scrollYBounded.get() + diff;

    // then again, the clamp function ensure that it never goes beyond the 0 as a minimum and the bounds as a maximum, which I'm sure will be modified
    clamp(scrollYBounded, newScrollYBounded, start, end);
  });

  return { scrollYBounded, scrollYBoundedPercentage };
};

export default function FixedHeaderPart2Page() {
  let { scrollYBounded, scrollYBoundedPercentage } = useBoundedScroll(0, 500);
  // originally scrollYBoundedProgressThrottled
  // basically this acts as a intermediary delay transform so that it doesn't need to be applied manually on every property
  let scrollYBoundedDelay = useTransform(
    scrollYBoundedPercentage,
    [0, 0.75, 1],
    [0, 0, 1],
  );
  // This below is not going to be smooth because there's not easy to it. In other words, using this method is fine for delays, for not necessarily for speeds, in which case I presume a function more advanced would need to be used.
  // After testing, its exactly as I said. You can feel the moment when it is going slowly at 0.8, and the aim is for it to no be this abrupt. Or... it's literally possible to pass in an easing function (or a cubicBezier), and even... as an array of easing functions between each interpolation.
  // https://www.framer.com/motion/use-transform/#options
  // https://www.framer.com/motion/transition/##ease
  let scrollYBoundedOrganized = useTransform(
    scrollYBoundedPercentage,
    [0, 0.5, 0.9, 1],
    [0, 0, 0.6, 1],
    { ease: [easeInOut, easeIn, easeOut] },
  );

  // even this, at this time, can be optimized
  // let height = useTransform(scrollYBounded, [0, 50], [80, 50]);
  // let opacity = useTransform(scrollYBounded, [0, 50], [1, 0]);
  let height = useTransform(scrollYBoundedOrganized, [0, 1], [80, 50]);
  let opacity = useTransform(scrollYBoundedOrganized, [0, 1], [1, 0]);
  let scale = useTransform(scrollYBoundedOrganized, [0, 1], [1, 0.9]);
  let backgroundColor = useMotionTemplate`rgb(255 255 255 / ${useTransform(scrollYBoundedOrganized, [0, 1], [1, 0.1])})`;

  useMotionValueEvent(scrollYBounded, "change", (current) => {
    console.log("scrollYBounded", current);
  });

  useMotionValueEvent(scrollYBoundedPercentage, "change", (current) => {
    console.log("scrollYBoundedPercentage", current);
  });

  useMotionValueEvent(scrollYBoundedDelay, "change", (current) => {
    console.log("scrollYBoundedDelay", current);
  });

  useMotionValueEvent(scrollYBoundedOrganized, "change", (current) => {
    console.log("scrollYBoundedOrganized", current);
  });

  /* refactored through useBoundedScroll
  let { scrollY } = useScroll();
  let height = useMotionValue(80);

  useMotionValueEvent(scrollY, "change", (current) => {
    let previous = scrollY.getPrevious();
    let diff = previous ? current - previous : 0;

    let newHeight = height.get() - diff;
    clamp(height, newHeight, 50, 80);
  });
  */

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 overflow-hidden font-sans text-slate-600">
      <div className="z-0 flex-1 overflow-y-scroll">
        <motion.header
          style={{ height, backgroundColor }} // styles always overrides classes
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
            <motion.nav
              style={{ opacity }}
              className="flex space-x-4 font-mono text-xs font-medium text-slate-400"
            >
              <a href="#">News</a>
              <a href="#">Sports</a>
              <a href="#">Culture</a>
            </motion.nav>
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
          </div>
        </main>
      </div>
    </div>
  );
}

/* Notes
And now I can do something that even The New Year, years after this lesson, still cannot have implemented.
*/
