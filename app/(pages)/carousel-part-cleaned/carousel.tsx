"use client";

import { MouseEventHandler, useEffect, useRef, useState } from "react";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  AnimatePresence,
  AnimationDefinition,
  MotionConfig,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
// @ts-ignore
import useKeypress from "react-use-keypress";
import clsx from "clsx";
import useWindowSize from "@buildinams/use-window-size";
import { useIdleTimer } from "react-idle-timer";
import { randomUUID } from "crypto";

let fullAspectRatio = 3 / 2;
let collapsedAspectRatio = 1 / 3;
let gap = 4;
let fullMargin = 12 - gap;

const PAGE = "page";
// const SCROLLPOSITION = "scrollposition";
const NODISTRACTIONS = "nodistractions";
const OBJECTFIT = "objectfit";

const SCROLLID = "to-be-scrolled";
const IMAGEID = "image-";
const CAROUSEL = "carousel";

// No idea why console.logs get printed six times in Carousel.
// There's also some inconsistencies with interuptability.
export default function Carousel({ images }: { images: string[] }) {
  const pathname = usePathname();
  const { push, replace, back, forward } = useRouter(); // push instead of replace to go back and forth in the browser's history, now only for pages, replace for other parameters
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get(PAGE)) || 0;
  if (currentPage > images.length - 1) {
    const params = new URLSearchParams(searchParams);
    params.set(PAGE, (images.length - 1).toString());
    redirect(`${pathname}?${params.toString()}`); // it works but I'm not convinced about the behavior... redirect is full refresh... but I think it's appropriate because it considers the situation as the error that it is
  }

  // const currentScrollPosition = Number(searchParams.get(SCROLLPOSITION)) || 0;
  // console.log(currentScrollPosition);

  const currentNoDistraction =
    searchParams.get(NODISTRACTIONS) === "imagesonly"
      ? "imagesonly"
      : searchParams.get(NODISTRACTIONS) === "true"
        ? "true"
        : searchParams.get(NODISTRACTIONS) === "false"
          ? "false"
          : "false"; // default false

  // currentObjectFit kept in reference to originally being only contain and cover
  const currentObjectFit =
    searchParams.get(OBJECTFIT) === "contain"
      ? "contain"
      : searchParams.get(OBJECTFIT) === "scroll"
        ? "scroll"
        : searchParams.get(OBJECTFIT) === "cover"
          ? "cover"
          : "cover"; // default cover

  let index = currentPage;
  // let scrollPosition = currentScrollPosition;
  let noDistracting: "false" | "imagesonly" | "true" = currentNoDistraction;
  let objectFitting: "cover" | "contain" | "scroll" = currentObjectFit;

  const paramsingIndex = (index: number) => {
    const params = new URLSearchParams(searchParams);
    if (index !== 0) params.set(PAGE, index.toString());
    else params.delete(PAGE);
    // resetting scrollPosition to 0 (still not enough)
    // params.delete(SCROLLPOSITION);
    push(`${pathname}?${params.toString()}`);
  };

  // const paramsingScrollPosition = (scrollPosition: number) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set(SCROLLPOSITION, scrollPosition.toString());
  //   replace(`${pathname}?${params.toString()}`);
  // };

  const carouselRef = useRef(null);
  const { scrollY } = useScroll({ container: carouselRef });

  useMotionValueEvent(scrollY, "change", (current) => {
    // console.log({ current });
    // paramsingScrollPosition(current);
  }); // https://www.framer.com/motion/use-scroll/##element-scroll

  const paramsingNoDistracting = () => {
    const params = new URLSearchParams(searchParams);
    if (noDistracting === "true") params.set(NODISTRACTIONS, "false");
    else if (noDistracting === "false")
      params.set(NODISTRACTIONS, "imagesonly");
    else params.set(NODISTRACTIONS, "true");
    replace(`${pathname}?${params.toString()}`);
  };

  const reverseParamsingNoDistracting = () => {
    const params = new URLSearchParams(searchParams);
    if (noDistracting === "true") params.set(NODISTRACTIONS, "imagesonly");
    else if (noDistracting === "imagesonly")
      params.set(NODISTRACTIONS, "false");
    else params.set(NODISTRACTIONS, "true");
    replace(`${pathname}?${params.toString()}`);
  };

  const paramsingObjectFitting = () => {
    const params = new URLSearchParams(searchParams);
    if (objectFitting === "cover") params.set(OBJECTFIT, "contain");
    else if (objectFitting === "contain") params.set(OBJECTFIT, "scroll");
    else {
      params.set(OBJECTFIT, "cover");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const reverseParamsingObjectFitting = () => {
    const params = new URLSearchParams(searchParams);
    if (objectFitting === "cover") params.set(OBJECTFIT, "scroll");
    else if (objectFitting === "scroll") {
      params.set(OBJECTFIT, "contain");
    } else params.set(OBJECTFIT, "cover");
    replace(`${pathname}?${params.toString()}`);
  };

  const scrollToTop = () =>
    document.getElementById(SCROLLID)!.scrollTo({ top: 0, behavior: "smooth" });

  const scrollToBottom = () =>
    document.getElementById(SCROLLID)!.scrollTo({
      top: document.getElementById(SCROLLID)!.scrollHeight,
      behavior: "smooth",
    });

  // setIndexFunctionNames kept in reference to original state lifted to URL
  const setIndexPlusOne = (index: number) => paramsingIndex(index + 1);
  const setIndexMinusOne = (index: number) => paramsingIndex(index - 1);
  const setIndexPlusTen = (index: number) =>
    paramsingIndex(Math.min(images.length - 1, index + 10));
  const setIndexMinusTen = (index: number) =>
    paramsingIndex(Math.max(0, index - 10));
  const setIndexFirst = () => paramsingIndex(0);
  const setIndexLast = () => paramsingIndex(images.length - 1);
  const setIndexSelected = (i: number) => paramsingIndex(i);

  useKeypress("ArrowLeft", (event: KeyboardEvent) => {
    // if (event.metaKey) return; // back();
    if (event.metaKey) {
      // The default is the behavior I'm seeking. But since I can't be sure that every browser has the same default as Firefox, I choose to do it manually with the tool provided by Next.js to make sure.
      event.preventDefault();
      return back();
    }

    event.preventDefault();
    if (index > 0) {
      if (event.shiftKey) setIndexMinusTen(index);
      else setIndexMinusOne(index);
      scrollToTop();
    }
  });

  useKeypress("ArrowRight", (event: KeyboardEvent) => {
    if (event.metaKey) {
      event.preventDefault();
      return forward();
    }

    event.preventDefault();
    if (index < images.length - 1) {
      if (event.shiftKey) setIndexPlusTen(index);
      else setIndexPlusOne(index);
      scrollToTop();
    }
  });

  useKeypress("ArrowUp", (event: KeyboardEvent) => {
    event.preventDefault();

    if (event.shiftKey) {
      setIndexFirst();
      scrollToTop();
    } else {
      scrollToTop();
    }
  });

  useKeypress("ArrowDown", (event: KeyboardEvent) => {
    event.preventDefault();

    if (event.shiftKey) {
      setIndexLast();
      scrollToTop();
    } else {
      console.log(document.getElementById(SCROLLID)!.scrollTop);
      scrollToBottom();
    }
  });

  useKeypress("Backspace", (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.shiftKey) reverseParamsingNoDistracting();
    else paramsingNoDistracting();
  });

  useKeypress("Enter", (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.shiftKey) reverseParamsingObjectFitting();
    else paramsingObjectFitting();
  });

  const { width, height } = useWindowSize();
  let objectFittingScrollHeight = useMotionValue(height);

  useEffect(() => {
    if (objectFitting === "scroll") {
      const image = document.getElementById(
        `${IMAGEID + index}`,
      ) as HTMLImageElement;
      const imageDecoding = async () => await image.decode();
      imageDecoding().then(() => {
        objectFittingScrollHeight.set(
          document.getElementById(`${IMAGEID + index}`)!.clientHeight,
        );
      });
    }
  }, [index, objectFitting, width, images]);

  const onIdle = () => {
    document.getElementById(CAROUSEL)!.style.cursor = "none";
  };

  const onActive = () => {
    document.getElementById(CAROUSEL)!.style.cursor = "auto";
  };

  useIdleTimer({
    timeout: 2_000,
    onIdle,
    onActive,
    events: ["mousemove"],
  });

  /* NEXT UP WOULD BE:
  - PRODUCTION, Framer Motion interruptability does not work in production, which I'll need to understand.
  For now, the behavior is exactly the same as when pressing the buttons on screen... which honestly is not that big of a deal, currently.

  - remembering scroll position in and out of scroll (actually in URL)
  I need to be able to define exactly what I want to do here.
  1. I want to have control over the animation of scrollTo, so that if effective it could match the duration and ease of MotionConfig. This makes me believe that scrollTo should be made with Framer Motion instead of through CSS, JavaScript and the browser.
  2. I want to be able to save the scroll position with a scrollposition params at all times when a user scrolls the page (or rather scrolls SCROLLID)
  3. I want to make sure that this scrollposition is not updated while all current Framer Motion animations on "carousel core" are still ongoing.
  4. Which is why I need to have the list of all 

  - keyboard tabbing navigation and focus-visible styles
  (But that's going to be a huge chunk.)

  - a images folder selector based on the folders in /public
  - Or even making the app work locally with any compliant images folder on your computer. Ideal for manga-reading.
  */

  const [animationsSet, setAnimationsSet] = useState<Set<string>>(new Set());

  function onStart(definition: AnimationDefinition) {
    const def = JSON.stringify(definition);
    console.log("Started animating", def);
    const set = animationsSet;
    set.add(def);
    setAnimationsSet(set);
    console.log({ animationsSet });
  }

  function onComplete(definition: AnimationDefinition) {
    const def = JSON.stringify(definition);
    console.log("Completed animating", def);
    const set = animationsSet;
    set.delete(def);
    setAnimationsSet(set);
    console.log({ animationsSet });
  }

  return (
    <div
      id={CAROUSEL}
      // removed max-h-screen
      className="flex items-center overflow-y-hidden bg-black"
    >
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        {/* removed mx-auto */}
        <div className="flex h-full flex-col">
          <div
            className="h-screen overflow-x-hidden"
            id={SCROLLID}
            ref={carouselRef}
          >
            <div className="overflow-hidden">
              <motion.div
                className={`flex`}
                animate={{ x: `-${index * 100}%` }}
                style={{
                  height:
                    objectFitting === "scroll"
                      ? objectFittingScrollHeight
                      : "auto",
                }}
                onAnimationStart={(definition: AnimationDefinition) =>
                  onStart(definition)
                }
                onAnimationComplete={(definition: AnimationDefinition) =>
                  onComplete(definition)
                }
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
                      className="flex h-fit w-full shrink-0"
                    >
                      <img
                        id={`${IMAGEID + i}`}
                        src={imageUrl}
                        alt=""
                        className={clsx(
                          "w-full",
                          objectFitting === "contain" &&
                            "h-screen object-contain",
                          objectFitting === "cover" && "h-screen object-cover",
                          objectFitting === "scroll" && "",
                        )}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {noDistracting === "false" && (
              <AnimatePresence initial={false}>
                {index > 0 && (
                  <>
                    <ChevronButton
                      isLeft={true}
                      handleClick={() => {
                        setIndexMinusOne(index);
                        scrollToTop();
                      }}
                    >
                      <ChevronLeftIcon />
                    </ChevronButton>
                  </>
                )}
              </AnimatePresence>
            )}

            {noDistracting === "false" && (
              <AnimatePresence initial={false}>
                {index + 1 < images.length && (
                  <ChevronButton
                    isLeft={false}
                    handleClick={() => {
                      setIndexPlusOne(index);
                      scrollToTop();
                    }}
                  >
                    <ChevronRightIcon />
                  </ChevronButton>
                )}
              </AnimatePresence>
            )}
          </div>
          {(noDistracting === "false" || noDistracting === "imagesonly") && (
            <div className="absolute inset-x-0 bottom-6 flex h-14 justify-center overflow-x-hidden">
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
                      {(objectFitting === "contain" ||
                        objectFitting === "scroll") && (
                        // For accessibility, that will need to be a button, preferrably for all objectFittings.
                        <img
                          src={imageUrl}
                          alt=""
                          className="h-full cursor-pointer object-cover"
                          onClick={() => setIndexSelected(i)}
                        />
                      )}
                      {objectFitting === "cover" && (
                        <button
                          className={`h-full w-full bg-cover bg-center`}
                          style={{
                            backgroundImage: `url("${imageUrl}")`,
                          }}
                          onClick={() => setIndexSelected(i)}
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
      // whileTap here considers pressing Enter to be whileTap, even though I have it with preventDefault() via useKeypress
      whileTap={{ scale: 0.9, transition: {} }}
      className={`absolute top-1/2 -mt-4 flex size-8 items-center justify-center rounded-full bg-white ${isLeft ? "left-3" : "right-3"}`}
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
Previous inline comments:
That responsive width is going to be complicated, but not impossible. The buttons are still rightfully placed at w-64 for example, and the animate x does move to 100% the size of the images, but now it's the images whose size is not being responsive (Well, with full on images just worked just fine.)
I'll have to test but... Now problem solved.
magic w-[80rem] matching max-w-7xl above
w-full fixed all of my responsive problems it seems
no overflow-x-auto because it messes up the calculations
and I'm actually not down with scrolling though, I'd rather Shift does the speeding
...
Well, my work here is done. Apple trackpad does not finger touch events.
https://forums.developer.apple.com/forums/thread/88109
https://www.reddit.com/r/learnjavascript/comments/18qer5x/how_to_detect_when_the_user_starts_and_ends/
Remove max-w-7xl. "left-1.5" : "right-1.5" instead of 2.
...
Lifting page number to the URL.
Making a button for contain or cover. Done via Enter.
...
I'll stick to img. Next/Image's width and height properties are getting on my nerves for now, and I'm pretty sure it is not intrinsically designed to animate with Framer Motion.
...
Putting this in the back...
// objectFittingScrollHeight.set(
//   document.getElementById(`${IMAGEID + index}`)!.clientHeight,
// );

// console.log("That timeout...");
// const timeoutId = setTimeout(() => {
//   console.log("Delayed for 1O milliseconds.");
//   objectFittingScrollHeight.set(
//     document.getElementById(`${IMAGEID + index}`)!.clientHeight,
//   );
// }, 10);
// console.log(timeoutId);
// return () => {
//   console.log("We clearin'.");
//   clearTimeout(timeoutId);
// };
...
This is where I should admit I got defeated and I should take Emil Kowalski's class on animations.
PREVIOUS REFLECTIONS:
  // Incredible that this is now my first useState, since I'm adamant about saving this specifically in the state and not the URL.
  // const [scrollPosition, setScrollPosition] = useState(0);
  // I want to have scroll position in the URL.
  // but first, let's start by using router.replace() for all not-page-related URL updates.
  // DECIDED. Scroll position is going to the URL.
  // It's only the page is changed to scrollposition will be reset to 0.
  // What could be done is keeping in a state the previous scrollposition and the page with it, so that if someone on a page goes back to the previous page and it's the one that is kept in state, then we can lead them back to their previous scrollposition. (Instead of having a full array in the URL of your positions on all the pages.)

  // console.log("Page scroll: ", latest);
  // I think useMotionValueEvent debounces on its own. So nice.
  // Actually it doesn't, Firefox does.
  // It will be something to optimize later.
  // paramsingScrollPosition(latest);
  // The problem is, therefore and indeed, a matter of debouncing.
  // Or rather I need to deactivate paramsingScrollPosition while the page is transitioning, which means I need paramsingIndex to use some kind of useTransition. Or I need to do something onFramerMotionAntionComplete.
  // Does the scrollTop has the same speed as the transition? It doesn't it's duration in independent. First, I want it to be the same.
  // ...
  // OK the first thing I want to do is, match the scrollTop speed with that of the motion config. If that works, it's a good start.
*/
