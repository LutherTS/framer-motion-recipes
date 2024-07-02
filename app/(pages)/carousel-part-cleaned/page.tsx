"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { MouseEventHandler, useState } from "react";
// @ts-ignore
import useKeypress from "react-use-keypress";

let images = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
  "/images/6.jpeg",
  "/images/1.jpeg?2",
  "/images/2.jpeg?2",
  "/images/3.jpeg?2",
  "/images/4.jpeg?2",
  "/images/5.jpeg?2",
  "/images/6.jpeg?2",
  "/images/1.jpeg?3",
  "/images/2.jpeg?3",
  "/images/3.jpeg?3",
  "/images/4.jpeg?3",
  "/images/5.jpeg?3",
  "/images/6.jpeg?3",
  "/images/1.jpeg?4",
  "/images/2.jpeg?4",
  "/images/3.jpeg?4",
  "/images/4.jpeg?4",
  "/images/5.jpeg?4",
  "/images/6.jpeg?4",
];

let fullAspectRatio = 3 / 2;
let collapsedAspectRatio = 1 / 3;
let gap = 4;
let fullMargin = 12 - gap;

export default function Page() {
  let [index, setIndex] = useState(0);

  useKeypress("ArrowLeft", (event: KeyboardEvent) => {
    if (index > 0)
      if (event.shiftKey) setIndex(Math.max(0, index - 10));
      else setIndex(index - 1);
  });

  useKeypress("ArrowRight", (event: KeyboardEvent) => {
    if (index < images.length - 1)
      if (event.shiftKey) setIndex(Math.min(images.length - 1, index + 10));
      else setIndex(index + 1);
  });

  return (
    <div className="flex max-h-screen items-center overflow-y-hidden bg-black">
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center">
          <div className="relative overflow-hidden">
            <motion.div className="flex" animate={{ x: `-${index * 100}%` }}>
              {images.map((imageUrl, i) => {
                let image = index === i ? "full" : "collapsed";

                return (
                  <motion.img
                    animate={image}
                    variants={{
                      full: {},
                      collapsed: {
                        opacity: 0.3,
                      },
                    }}
                    key={imageUrl}
                    src={imageUrl}
                    className="aspect-[3/2] object-cover"
                  />
                );
              })}
            </motion.div>

            <AnimatePresence initial={false}>
              {index > 0 && (
                <>
                  <ChevronButton
                    isLeft={true}
                    handleClick={() => setIndex(index - 1)}
                  >
                    <ChevronLeftIcon />
                  </ChevronButton>
                </>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {index + 1 < images.length && (
                <ChevronButton
                  isLeft={false}
                  handleClick={() => setIndex(index + 1)}
                >
                  <ChevronRightIcon />
                </ChevronButton>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute inset-x-0 bottom-6 flex h-14 justify-center">
            <motion.div
              initial={false}
              animate={{
                x: `-${index * 100 * (collapsedAspectRatio / fullAspectRatio) + fullMargin + index * gap}%`,
              }}
              style={{ aspectRatio: fullAspectRatio, gap: `${gap}%` }}
              className="flex"
            >
              {images.map((imageUrl, i) => {
                let image = index === i ? "full" : "collapsed";
                let imageHover = index === i ? "fullHover" : "collapsedHover";
                let imageTap = index === i ? "fullTap" : "collapsedTap";

                return (
                  <motion.button
                    key={imageUrl}
                    initial={false}
                    animate={image}
                    whileHover={imageHover}
                    whileTap={imageTap}
                    variants={{
                      full: {
                        aspectRatio: fullAspectRatio,
                        marginLeft: `${fullMargin}%`,
                        marginRight: `${fullMargin}%`,
                        opacity: 1,
                      },
                      collapsed: {
                        aspectRatio: collapsedAspectRatio,
                        marginLeft: 0,
                        marginRight: 0,
                        opacity: 0.5,
                      },
                      fullHover: {},
                      collapsedHover: {
                        opacity: 0.8,
                        transition: { duration: 0.1 },
                      },
                      fullTap: {},
                      collapsedTap: {
                        opacity: 0.9,
                        transition: { duration: 0.1 },
                      },
                    }}
                    className="shrink-0"
                    onClick={() => setIndex(i)}
                  >
                    <img src={imageUrl} className={`h-full object-cover`} />
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </div>
      </MotionConfig>
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
      className="size-6"
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
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}

function ChevronButton({
  children,
  isLeft,
  handleClick,
}: Readonly<{
  children: React.ReactNode;
  isLeft: boolean;
  handleClick: MouseEventHandler<HTMLButtonElement>;
}>) {
  return (
    <motion.button
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: 0.6 }}
      exit={{ opacity: 0, pointerEvents: "none" }}
      whileHover={{ opacity: 0.8 }}
      whileTap={{ scale: 0.9, transition: {} }}
      className={`absolute top-1/2 -mt-4 flex size-8 items-center justify-center rounded-full bg-white ${isLeft ? "left-2" : "right-2"}`}
      onClick={handleClick}
    >
      {children}
    </motion.button>
  );
}
