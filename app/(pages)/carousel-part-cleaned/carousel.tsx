"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { MouseEventHandler, useState } from "react";
// @ts-ignore
import useKeypress from "react-use-keypress";

let fullAspectRatio = 3 / 2;
let collapsedAspectRatio = 1 / 3;
let gap = 4;
let fullMargin = 12 - gap;

export default function Carousel({
  images,
  objectFit,
}: {
  images: string[];
  objectFit?: "cover" | "contain";
}) {
  let [index, setIndex] = useState(0);
  let [noDistractions, setNoDistractions] = useState(false);

  useKeypress("ArrowLeft", (event: KeyboardEvent) => {
    event.preventDefault();
    if (index > 0)
      if (event.shiftKey) setIndex(Math.max(0, index - 10));
      else setIndex(index - 1);
  });

  useKeypress("ArrowRight", (event: KeyboardEvent) => {
    event.preventDefault();
    if (index < images.length - 1)
      if (event.shiftKey) setIndex(Math.min(images.length - 1, index + 10));
      else setIndex(index + 1);
  });

  useKeypress("ArrowUp", (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.shiftKey) setIndex(0);
  });

  useKeypress("ArrowDown", (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.shiftKey) setIndex(images.length - 1);
  });

  useKeypress("Backspace", (event: KeyboardEvent) => {
    event.preventDefault();
    setNoDistractions(!noDistractions);
  });

  // console.log(noDistractions);

  return (
    <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center">
        <div className="relative overflow-hidden">
          <motion.div
            className="flex h-screen items-center"
            animate={{ x: `-${index * 100}%` }}
          >
            {images.map((imageUrl, i) => {
              let image = index === i ? "full" : "collapsed";

              return (
                <motion.div
                  animate={image}
                  variants={{
                    full: {},
                    collapsed: {
                      opacity: 0.3,
                    },
                  }}
                  key={imageUrl}
                  src={imageUrl}
                  className="flex h-full w-[80rem] shrink-0 items-center justify-center"
                  // magic w-[80rem] matching max-w-7xl above
                >
                  <img
                    src={imageUrl}
                    className={`h-full w-full ${objectFit === "contain" ? "object-contain" : "object-cover"}`}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {!noDistractions && (
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
          )}

          {!noDistractions && (
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
          )}
        </div>
        {!noDistractions && (
          <div
            className="absolute inset-x-0 bottom-6 flex h-14 justify-center overflow-x-hidden"
            // no overflow-x-auto because it messes up the calculations
            // and I'm actually not down with scrolling though, I'd rather Shift does the speeding
          >
            <motion.div
              initial={false}
              // ...There COULD a way to handle all the math with layout... I think.
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
                  <motion.div
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
                    className="flex shrink-0 justify-center"
                  >
                    {objectFit === "contain" ? (
                      <img
                        src={imageUrl}
                        className="h-full cursor-pointer object-cover"
                        onClick={() => setIndex(i)}
                      />
                    ) : (
                      <button
                        className={`h-full w-full bg-cover bg-center`}
                        style={{
                          backgroundImage: `url("${imageUrl}")`,
                        }}
                        onClick={() => setIndex(i)}
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}
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
      whileTap={{ scale: 0.9, transition: {} }}
      className={`absolute top-1/2 -mt-4 flex size-8 items-center justify-center rounded-full bg-white ${isLeft ? "left-2" : "right-2"}`}
      onClick={handleClick}
    >
      {children}
    </motion.button>
  );
}

/* Notes
Naturally, importing fs only work on the server, therefore only on server components. This is something I'll have to refactor when doing carousel-galleries.
Something like:
import * as fs from "node:fs";
const directory = "./images";
fs.readdir(directory, (error: NodeJS.ErrnoException | null, files: string[]) => console.log(files.length));
...
In order to use this carousel as I intend to, with images of a fixed height or even with different yet-to-be defined ambitions altogether, I'll have to genuinely start it and think it from scratch. 
Nope. Done.
className="h-full w-[70rem]" // It's like I can't declare a width that goes beyond the image's natural aspect ratio.
...
So. 
What's next is: 
1. Two-finger swiping, with animations and setIndex at threshold.
2. A thought on responsiveness.
3. And maybe actually... turn that img into a button.
className="flex shrink-0 justify-center"
There's a lot I could work on again. I guess I'll just do so while experimenting.
But now I understand better how to work on the front. It is a painstaking process, just don't let videos fool you, they only show you the part where they already did the work. Frontend is just like backend, simply that since it's visual the lack of reward is more painful to bear. 
Long story short, this too takes time. 
*/
