"use client";

import { MouseEventHandler, useEffect, useRef, useState } from "react";
import {
  ReadonlyURLSearchParams,
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
import { useDebouncedCallback } from "use-debounce";

let fullAspectRatio = 3 / 2;
let collapsedAspectRatio = 1 / 3;
let gap = 4; // messed up in Google Chrome
let fullMargin = 12 - gap;

// const IMAGES = "images"; // now hardcoded in useKeypress(numberKeys
const PAGE = "page";
const SCROLLPOSITION = "scrollposition";
const WINDOWWIDTH = "windowwidth";
const NODISTRACTIONS = "nodistractions";
const OBJECTFIT = "objectfit";

const SCROLLID = "to-be-scrolled";
const IMAGEID = "image-";
const CAROUSEL = "carousel";

const clientParamSafeting = (
  condition: boolean,
  key: string,
  value: number,
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
) => {
  if (condition) {
    const params = new URLSearchParams(searchParams);
    params.set(key, value.toString());
    redirect(`${pathname}?${params.toString()}`);
  }
};

const rotateParams = (
  direction: "left" | "right",
  paramsKey: string,
  paramsArray: readonly string[],
  paramsValue: string,
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
  replace: (href: string, options?: NavigateOptions) => void,
) => {
  const params = new URLSearchParams(searchParams);
  if (direction === "right")
    params.set(
      paramsKey,
      paramsArray.at(
        paramsArray.indexOf(paramsValue) + 1 > paramsArray.length - 1
          ? 0
          : paramsArray.indexOf(paramsValue) + 1,
      )!,
    );
  else
    params.set(
      paramsKey,
      // .at() handles rotation on its own for negative values
      paramsArray.at(paramsArray.indexOf(paramsValue) - 1)!,
    );
  replace(`${pathname}?${params.toString()}`);
};

const scrollToTop = () =>
  document.getElementById(SCROLLID)!.scrollTo({ top: 0, behavior: "smooth" });

const scrollToBottom = () =>
  document.getElementById(SCROLLID)!.scrollTo({
    top: document.getElementById(SCROLLID)!.scrollHeight,
    behavior: "smooth",
  });

// Console.logs got printed six times in Carousel sometimes.
// Some inconsistencies with interruptability especially in production. ...Which is probably due to the state lifted to the URL.
export default function Carousel({
  images,
  isDefaultDirectory,
}: {
  images: string[];
  isDefaultDirectory: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push, replace, back, forward } = useRouter(); // push instead of replace to go back and forth in the browser's history, now only for pages, replace for other parameters

  const currentPage = Math.floor(Number(searchParams.get(PAGE))) || 0;
  clientParamSafeting(currentPage < 0, PAGE, 0, searchParams, pathname);
  const maxPage = images.length - 1;
  clientParamSafeting(
    currentPage > maxPage,
    PAGE,
    maxPage,
    searchParams,
    pathname,
  );

  // clientParamSafeting isn't that imperative for currentScrollPosition and currentWindowWidth because the browser and the Web API handle the edge cases correctly and acceptably respectively for both cases

  const currentScrollPosition = Number(searchParams.get(SCROLLPOSITION)) || 0;

  const { width, height } = useWindowSize();

  // const currentWindowWidth = Number(searchParams.get(WINDOWWIDTH)) || 1;
  // hoping for more precision
  const currentWindowWidth = Number(searchParams.get(WINDOWWIDTH))
    ? Number(searchParams.get(WINDOWWIDTH))
    : width
      ? width
      : 1;

  let currentNoDistraction: "false" | "imagesonly" | "chevronsonly" | "true" =
    "false";

  switch (searchParams.get(NODISTRACTIONS)) {
    case "false":
      currentNoDistraction = "false";
      break;
    case "imagesonly":
      currentNoDistraction = "imagesonly";
      break;
    case "chevronsonly":
      currentNoDistraction = "chevronsonly";
      break;
    case "true":
      currentNoDistraction = "true";
      break;
    default:
      break;
  }

  let currentObjectFit: "cover" | "contain" | "scroll" = isDefaultDirectory
    ? "cover"
    : "contain";

  switch (searchParams.get(OBJECTFIT)) {
    case "contain":
      currentObjectFit = "contain";
      break;
    case "scroll":
      currentObjectFit = "scroll";
      break;
    case "cover":
      if (isDefaultDirectory) currentObjectFit = "cover";
      break;
    default:
      break;
  }

  let index = currentPage;
  let scrollPosition = currentScrollPosition;
  let windowWidth = currentWindowWidth;
  let noDistracting = currentNoDistraction;
  let objectFitting = currentObjectFit;

  const paramsingIndex = (index: number) => {
    const params = new URLSearchParams(searchParams);
    if (index !== 0) params.set(PAGE, index.toString());
    else params.delete(PAGE);
    // resetting scrollPosition
    params.delete(SCROLLPOSITION);
    push(`${pathname}?${params.toString()}`);
  };

  const paramsingScrollPosition = (scrollPosition: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(SCROLLPOSITION, scrollPosition.toString());
    // with windowWidth
    params.set(WINDOWWIDTH, width.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  // nothing should work during debounce at this time
  const debouncedParamsingScrollPosition = useDebouncedCallback(
    // function
    (scrollPosition: number) => {
      paramsingScrollPosition(scrollPosition);
    },
    // delay in ms
    100,
  ); // https://www.npmjs.com/package/use-debounce#debounced-callbacks

  const carouselRef = useRef(null);
  const { scrollY } = useScroll({ container: carouselRef });

  useMotionValueEvent(scrollY, "change", (current) => {
    if (animationsSet.size === 0 && objectFitting === "scroll")
      debouncedParamsingScrollPosition(current);
  }); // https://www.framer.com/motion/use-scroll/##element-scroll

  const noDistractings = [
    "false",
    "imagesonly",
    "chevronsonly",
    "true",
  ] as const;

  const objectFittingsWithCover = ["cover", "contain", "scroll"] as const;

  // voluntarily removed cover
  const objectFittingsWithoutCover = ["contain", "scroll"] as const;

  /* FLASH IDEA
  rotateNoDistracting("right") and rotateObjectFitting("right") need to have their own buttons on the top-left and the top-right of the screen respectively, especially for mobile. // DONE.
  */

  const rotateNoDistracting = (direction: "left" | "right") =>
    rotateParams(
      direction,
      NODISTRACTIONS,
      noDistractings,
      noDistracting,
      searchParams,
      pathname,
      replace,
    );

  const rotateObjectFitting = (direction: "left" | "right") => {
    rotateParams(
      direction,
      OBJECTFIT,
      isDefaultDirectory ? objectFittingsWithCover : objectFittingsWithoutCover,
      objectFitting,
      searchParams,
      pathname,
      replace,
    );
  };

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
    event.preventDefault();
    if (debouncedParamsingScrollPosition.isPending()) return;

    // if (event.metaKey) return; // back();
    if (event.metaKey) {
      // The default is the behavior I'm seeking. But since I can't be sure that every browser has the same default as Firefox, I choose to do it manually with the tool provided by Next.js to make sure.
      return back();
    }

    if (event.shiftKey) {
      return rotateNoDistracting("right");
    }

    if (index > 0) {
      if (event.altKey) setIndexMinusTen(index);
      else setIndexMinusOne(index);
    }
  });

  useKeypress("ArrowRight", (event: KeyboardEvent) => {
    event.preventDefault();
    if (debouncedParamsingScrollPosition.isPending()) return;

    if (event.metaKey) {
      return forward();
    }

    if (event.shiftKey) {
      return rotateNoDistracting("left");
    }

    if (index < images.length - 1) {
      if (event.altKey) setIndexPlusTen(index);
      else setIndexPlusOne(index);
    }
  });

  /* FLASH NOTE
  metaKey+"ArrowUp" and metaKey+"ArrowDown" already do scrollToTop and scrollToBottom natively so I could instead scroll to the next portion of the page via the window's height. // DONE.
  There's a rounding to 1 here that's a little confusing (reminds me of my Webflow University lessons) but it's insignificant enough to be ignored.
  And now maybe I can reduce the debounce time to something not humanly noticeable. Nope, it's unrelated. This is something else I'll be able to handle with Framer Motion-based scrolling I hope.
  */

  useKeypress("ArrowUp", (event: KeyboardEvent) => {
    event.preventDefault();
    if (debouncedParamsingScrollPosition.isPending()) return;

    if (event.shiftKey) {
      return rotateObjectFitting("right");
    }

    if (event.altKey) {
      setIndexFirst();
    } else if (event.metaKey) {
      scrollToTop();
    } else {
      const scrollId = document.getElementById(SCROLLID)!;
      if (currentScrollPosition > 0)
        scrollId.scrollTo({
          top: currentScrollPosition - height,
          behavior: "smooth",
        });
    }
  });

  useKeypress("ArrowDown", (event: KeyboardEvent) => {
    event.preventDefault();
    if (debouncedParamsingScrollPosition.isPending()) return;

    if (event.shiftKey) {
      return rotateObjectFitting("left");
    }

    if (event.altKey) {
      setIndexLast();
    } else if (event.metaKey) {
      scrollToBottom();
    } else {
      const scrollId = document.getElementById(SCROLLID)!;
      if (height + currentScrollPosition < scrollId.scrollHeight)
        scrollId.scrollTo({
          top: currentScrollPosition + height,
          behavior: "smooth",
        });
    }
  });

  // useKeypress for selecting image sources

  const numberKeys = Array.from({ length: 10 }, (_, i) => i.toString());

  useKeypress(numberKeys, (event: KeyboardEvent) => {
    event.preventDefault();

    push(`${pathname}?images=${event.key}`);
  });

  // core useEffect // await decoding, rational scroll positioning

  let objectFittingScrollHeight = useMotionValue(height);

  useEffect(() => {
    if (objectFitting === "scroll") {
      const image = document.getElementById(
        `${IMAGEID + index}`,
      ) as HTMLImageElement;
      const imageDecoding = async () => await image.decode();

      imageDecoding()
        .then(() => {
          objectFittingScrollHeight.set(
            document.getElementById(`${IMAGEID + index}`)!.clientHeight,
          );
        })
        .then(() => {
          // I think it works...
          document.getElementById(SCROLLID)!.scrollTo({
            // And with just a bit of math...
            top: Math.floor((scrollPosition * width) / windowWidth),
            behavior: "instant",
          });
        });
    }
  }, [index, objectFitting, width, images]);

  // to hide the top controls and mouse when idle

  const [topControlsVisible, setTopControlsVisible] = useState(true);

  // a tiny bug here where the mouse remains when hovering on the top buttons
  const onIdle = () => {
    setTopControlsVisible(false);
    document.getElementById(CAROUSEL)!.style.cursor = "none";
  };

  const onActive = () => {
    setTopControlsVisible(true);
    document.getElementById(CAROUSEL)!.style.cursor = "auto";
  };

  useIdleTimer({
    timeout: 3_000,
    onIdle,
    onActive,
    events: ["mousemove", "mousedown", "touchstart"],
  });

  // to track when all animations are still active

  const [animationsSet, setAnimationsSet] = useState<Set<string>>(new Set());

  function onStart(definition: AnimationDefinition) {
    const def = JSON.stringify(definition);
    const set = animationsSet;
    set.add(def);
    setAnimationsSet(set);
    scrollToTop();
  }

  function onComplete(definition: AnimationDefinition) {
    const def = JSON.stringify(definition);
    const set = animationsSet;
    set.delete(def);
    setAnimationsSet(set);
  }

  /* NEXT UP WOULD BE:
  - PRODUCTION, Framer Motion interruptability does not work in production, which I'll need to understand.
  For now, the behavior is exactly the same as when pressing the buttons on screen... which honestly is not that big of a deal, currently.

  Now only three fixes to be made:
  1. useDebounce so that I can flush the callback on interrupting page changes. // SOLUTION CHOSEN IS DEACTIVATING CHANGES DURING DEBOUNCE
  2. retrocompatibilize the math of windowWidth especially at the page bottoms // okay for now, it isn't an indispensable feature
  3. ...and some inconsistences when loading at scroll position
  (Scroll position isn't taken into account on mount I think.) // this I really need to understand and hopefully solve though.) // APPARENTLY IT WORKS. MY WORK HERE IS DONE?
  ... The issue only applies to nodistractions=true. After many tests and changes I have zero idea where the idea could be. But it's a minor issue that can be ignored by saving URLs that do not have nodistractions=true.

  In a future remake of the project after further Framer Motion knowledge:
  - remove objectFitting cover // now removed voluntarily
  - making scrollToTop and other in-between-pages scrolling indiscriminate across different page heights // fixed surprisingly
  - keyboard tabbing navigation and focus-visible styles
  (But that's going to be a huge chunk.)
  - an images folder selector based on the folders in /public
  - Or even making the app work locally with any compliant images folder on your computer. Ideal for manga-reading.
  - ...OR even better eventually, use the project as a means to try uploadthing, where users would upload their owns picture folders on the web: https://uploadthing.com/.
  */

  return (
    <div
      id={CAROUSEL}
      className="relative flex h-[100dvh] items-center overflow-y-hidden bg-black"
    >
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <div className="flex h-full flex-col">
          <div className="overflow-x-hidden" id={SCROLLID} ref={carouselRef}>
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
                            "h-[100dvh] object-contain",
                          objectFitting === "cover" &&
                            "h-[100dvh] object-cover",
                          objectFitting === "scroll" && "",
                        )}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            <div
              className={clsx(
                "absolute inset-x-0 top-6",
                !topControlsVisible && "hidden",
              )}
            >
              <ControlButton
                isLeft={true}
                isCenter={false}
                handleClick={() => {
                  // unnecessarily but we never know
                  if (debouncedParamsingScrollPosition.isPending()) return;
                  rotateNoDistracting("right");
                }}
              >
                {noDistracting === "true" ? (
                  <CubeIcon />
                ) : (
                  <CubeTransparentIcon />
                )}
              </ControlButton>
              <ControlButton
                isLeft={false}
                isCenter={false}
                handleClick={() => {
                  if (debouncedParamsingScrollPosition.isPending()) return;
                  rotateObjectFitting("right");
                }}
              >
                {(() => {
                  switch (objectFitting) {
                    case "cover":
                      return <ArrowsPointingInIcon />;
                    case "contain":
                      return <ArrowsPointingOutIcon />;
                    case "scroll":
                      if (isDefaultDirectory) return <PhotoIcon />;
                      else return <ArrowsPointingInIcon />;
                    default:
                      return null;
                  }
                })()}
                {/* https://medium.com/nerd-for-tech/a-case-to-switch-using-switch-statements-in-react-e83e01154f60 */}
              </ControlButton>
            </div>

            {/* no effect on the nodistractions=true scrollposition issue */}
            {/* now it's nodistractions=chevronsonly that has the issue... sometimes... and back to nodistractions=true... weird */}

            {/* {noDistracting === "false" && ( */}
            <div
              className={clsx(
                noDistracting !== "false" &&
                  noDistracting !== "chevronsonly" &&
                  "hidden",
              )}
            >
              <AnimatePresence initial={false}>
                {index > 0 && (
                  <>
                    <ControlButton
                      isLeft={true}
                      isCenter={true}
                      handleClick={() => {
                        if (debouncedParamsingScrollPosition.isPending())
                          return;
                        setIndexMinusOne(index);
                      }}
                    >
                      <ChevronLeftIcon />
                    </ControlButton>
                  </>
                )}
              </AnimatePresence>
              <AnimatePresence initial={false}>
                {index + 1 < images.length && (
                  <ControlButton
                    isLeft={false}
                    isCenter={true}
                    handleClick={() => {
                      if (debouncedParamsingScrollPosition.isPending()) return;
                      setIndexPlusOne(index);
                    }}
                  >
                    <ChevronRightIcon />
                  </ControlButton>
                )}
              </AnimatePresence>
            </div>
            {/* )} */}
          </div>

          {/* {(noDistracting === "false" || noDistracting === "imagesonly") && ( */}
          <div
            className={clsx(
              "absolute inset-x-0 bottom-6 flex h-14 justify-center overflow-x-hidden",
              noDistracting !== "false" &&
                noDistracting !== "imagesonly" &&
                "hidden",
            )}
          >
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
          {/* )} */}
        </div>
      </MotionConfig>
    </div>
  );
}

function ControlButton({
  children,
  isLeft,
  isCenter,
  handleClick,
}: Readonly<{
  children: React.ReactNode;
  isLeft: boolean;
  isCenter: boolean;
  handleClick: MouseEventHandler<HTMLButtonElement>;
}>) {
  return (
    <motion.button
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: isCenter ? 0.6 : 0.3 }}
      exit={{ opacity: 0, pointerEvents: "none" }}
      whileHover={{ opacity: 0.8 }}
      // whileTap here considers pressing Enter to be whileTap, even though I have it with preventDefault() via useKeypress // which is no longer an issue since I'm no longer using Enter or Backspace
      whileTap={{ scale: 0.9, transition: {} }}
      className={clsx(
        `absolute flex size-8 items-center justify-center rounded-full bg-white`,
        isCenter && "top-1/2",
        isLeft && "left-3",
        !isLeft && "right-3",
      )}
      onClick={handleClick}
    >
      {children}
    </motion.button>
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

function ArrowsPointingInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M3.22 3.22a.75.75 0 0 1 1.06 0l3.97 3.97V4.5a.75.75 0 0 1 1.5 0V9a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1 0-1.5h2.69L3.22 4.28a.75.75 0 0 1 0-1.06Zm17.56 0a.75.75 0 0 1 0 1.06l-3.97 3.97h2.69a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0ZM3.75 15a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-2.69l-3.97 3.97a.75.75 0 0 1-1.06-1.06l3.97-3.97H4.5a.75.75 0 0 1-.75-.75Zm10.5 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-2.69l3.97 3.97a.75.75 0 1 1-1.06 1.06l-3.97-3.97v2.69a.75.75 0 0 1-1.5 0V15Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowsPointingOutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CubeTransparentIcon() {
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
        d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
      />
    </svg>
  );
}

function CubeIcon() {
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
        d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
      />
    </svg>
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
PREVIOUS TASKS:
- remembering scroll position in and out of scroll (actually in URL)
  I need to be able to define exactly what I want to do here.
  1. I want to have control over the animation of scrollTo, so that if effective it could match the duration and ease of MotionConfig. This makes me believe that scrollTo should be made with Framer Motion instead of through CSS, JavaScript and the browser.
  2. I want to be able to save the scroll position with a scrollposition params at all times when a user scrolls the page (or rather scrolls SCROLLID)
  3. I want to make sure that this scrollposition is not updated while all current Framer Motion animations on "carousel core" are still ongoing.
  4. Which is why I need to have the list of all // DONE.

    // console.log({
    //   currentScrollPosition,
    //   height,
    //   scrollHeight: scrollId.scrollHeight,
    // });
  
  const scrollToBottom = () =>
    document.getElementById(SCROLLID)!.scrollTo({
      top: document.getElementById(SCROLLID)!.scrollHeight,
      behavior: "smooth",
    });
...
NOT ANYMORE APPARENTLY:
// Just discovered scrollToTop has an issue between pages of different heights.
PREVIOUS:
// const params = new URLSearchParams(searchParams);
// params.set(IMAGES, event.key);
// push(`${pathname}?${params.toString()}`);
REPLACED BY A SWITCH STATEMENT:
// here however, a switch statement could be better
// because each value could have it's own condition where different
if (isDefaultDirectory) {
  searchParams.get(OBJECTFIT) === "contain"
    ? (currentObjectFit = "contain")
    : searchParams.get(OBJECTFIT) === "scroll"
      ? (currentObjectFit = "scroll")
      : searchParams.get(OBJECTFIT) === "cover"
        ? (currentObjectFit = "cover")
        : (currentObjectFit = "cover");
} else {
  searchParams.get(OBJECTFIT) === "contain"
    ? (currentObjectFit = "contain")
    : searchParams.get(OBJECTFIT) === "scroll"
      ? (currentObjectFit = "scroll")
      : searchParams.get(OBJECTFIT) === "cover"
        ? (currentObjectFit = "contain")
        : (currentObjectFit = "contain"); // voluntarily removed cover
// a switch statement is better but I kinda like that for now
// what's more, it goes to show that these options should be limited
// ...No. If for some reason I want to do something with isDefaultDirectory, I'm gonna need to refactor this as a switch statement. So it's best if it's just a if statement to begin with.
const currentNoDistraction =
  searchParams.get(NODISTRACTIONS) === "imagesonly"
    ? "imagesonly"
    : searchParams.get(NODISTRACTIONS) === "chevronsonly"
      ? "chevronsonly"
      : searchParams.get(NODISTRACTIONS) === "true"
        ? "true"
        : searchParams.get(NODISTRACTIONS) === "false"
          ? "false"
          : "false"; // default false
EXTRA CONSOLE.LOGS
// replacing width by window.innerWidth because width begins at 0, but to no avail so far, I believe because animations are still ongoing (animationsSet.size > 0)
// console.log({ width, windowWidth, scrollPosition, animationsSet });
// console.log(window.innerWidth);
// console.log(document.getElementById(SCROLLID));
// the problem was specific to nodistractions=true
*/
