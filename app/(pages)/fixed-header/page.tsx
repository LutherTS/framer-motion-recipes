"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  // useTransform,
} from "framer-motion";

export default function FixedHeaderPage() {
  let { scrollY } = useScroll();
  let height = useMotionValue(80);

  // my take on opacity
  let navOpacity = useMotionValue(1);

  // let height = useTransform(scrollY, (value) => Math.max(80 - value, 50));
  // console.log({ height });

  useMotionValueEvent(scrollY, "change", (current) => {
    let previous = scrollY.getPrevious();
    let diff = previous ? current - previous : 0;
    console.log({ current, previous, diff });

    let newHeight = height.get() - diff;

    /* refactored below
    if (diff > 0) height.set(Math.max(newHeight, 50));
    else height.set(Math.min(newHeight, 80));
    */

    height.set(Math.min(Math.max(newHeight, 50), 80));

    // it works but I can't manually make it match with the height animations
    let newNavOpacity = navOpacity.get() - diff * 0.03;
    navOpacity.set(Math.min(Math.max(newNavOpacity, 0), 1));
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 overflow-hidden font-sans text-slate-600">
      <div className="z-0 flex-1 overflow-y-scroll">
        <motion.header
          style={{ height }} // styles always overrides classes
          className="fixed inset-x-0 flex h-20 bg-white shadow"
        >
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-8">
            <p className="flex origin-left items-center text-xl font-semibold uppercase">
              <span className="-ml-1.5 inline-block -rotate-90 text-[10px] leading-[0]">
                The
              </span>
              <span className="-ml-1 text-2xl tracking-[-.075em]">
                Daily Bugle
              </span>
            </p>
            <motion.nav
              style={{ opacity: navOpacity }}
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
