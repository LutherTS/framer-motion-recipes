"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { MouseEventHandler, useState } from "react";

let images = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
  "/images/6.jpeg",
];

export default function Page() {
  let [index, setIndex] = useState(0);

  return (
    <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
      <div className="flex min-h-screen items-center bg-black">
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center">
          <div className="relative overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${index * 100}%` }}
              // transition={{ duration: 0.5, ease: "easeInOut" }}
              // transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            >
              {images.map((imageUrl) => {
                return (
                  <img
                    key={imageUrl}
                    src={imageUrl}
                    alt=""
                    className="aspect-[3/2] w-screen object-cover"
                  />
                );
              })}
            </motion.div>
            {/* <img
            src={images[index]}
            className="aspect-[3/2] w-full object-cover"
          /> */}

            <AnimatePresence initial={false}>
              {index > 0 && (
                <>
                  {/* <motion.button
                  initial={{
                    opacity: 0,
                  }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0, pointerEvents: "none" }}
                  whileHover={{ opacity: 0.8 }}
                  className="absolute left-2 top-1/2 -mt-4 flex size-8 items-center justify-center rounded-full bg-white"
                  onClick={() => setIndex(index - 1)}
                >
                  <ChevronLeftIcon />
                </motion.button> */}
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
                // <motion.button
                //   initial={{ opacity: 0 }}
                //   animate={{ opacity: 1 }}
                //   exit={{ opacity: 0 }}
                //   className="absolute right-2 top-1/2 -mt-4 flex size-8 items-center justify-center rounded-full bg-white/60 transition hover:bg-white/80"
                //   onClick={() => setIndex(index + 1)}
                // >
                //   <ChevronRightIcon />
                // </motion.button>
                <ChevronButton
                  isLeft={false}
                  handleClick={() => setIndex(index + 1)}
                >
                  <ChevronRightIcon />
                </ChevronButton>
              )}
            </AnimatePresence>
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
      className={`absolute top-1/2 -mt-4 flex size-8 items-center justify-center rounded-full bg-white ${isLeft ? "left-2" : "right-2"}`}
      onClick={handleClick}
    >
      {children}
    </motion.button>
  );
}
