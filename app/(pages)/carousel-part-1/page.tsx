"use client";

import { useState } from "react";

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
    <div className="flex min-h-screen items-center bg-black">
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center">
        <div className="relative">
          <img
            src={images[index]}
            className="aspect-[3/2] w-full object-cover"
          />

          {index > 0 && (
            <button
              className="absolute left-2 top-1/2 -mt-4 flex size-8 items-center justify-center rounded-full bg-white/60 transition hover:bg-white/80"
              onClick={() => setIndex(index - 1)}
            >
              <ChevronLeftIcon />
            </button>
          )}

          {index + 1 < images.length && (
            <button
              className="absolute right-2 top-1/2 -mt-4 flex size-8 items-center justify-center rounded-full bg-white/60 transition hover:bg-white/80"
              onClick={() => setIndex(index + 1)}
            >
              <ChevronRightIcon />
            </button>
          )}
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
