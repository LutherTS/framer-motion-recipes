"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

let titles = [
  ["Apple's newest iPhone is here", "Watch our July event"],
  [
    "Nintendo's Newsletter for July",
    "Introducing Strike, a 5-on-5 soccer game",
  ],
  ["Your funds have been processed", "See your latest deposit online"],
  ["This Week in Sports", "The finals are heating up"],
  ["Changelog update", "Edge subroutines and more"],
  ["React Hawaii is here!", "Time for fun in the sun"],
];

export default function EmailClientPage() {
  // const [messages, setMessages] = useState([...Array(9).keys()]);
  const [messages, setMessages] = useState([...Array(titles.length).keys()]);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);

  function toggleMessage(mid: number) {
    if (selectedMessages.includes(mid)) {
      setSelectedMessages((messages) => messages.filter((id) => id !== mid));
    } else {
      setSelectedMessages((messages) => [...messages, mid]);
    }
  }

  function addMessage() {
    let newId = (messages.at(-1) || 0) + 1;
    setMessages((messages) => [...messages, newId]);
  }

  function archiveMessages() {
    setMessages((messages) =>
      messages.filter((id) => !selectedMessages.includes(id)),
    );
    setSelectedMessages([]);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center overscroll-y-contain bg-gradient-to-br from-slate-700 to-slate-900 px-6 py-8 font-sans text-slate-600">
      <div className="mx-auto flex w-full max-w-3xl flex-1 overflow-hidden rounded-2xl bg-white">
        <div className="flex w-[45%] flex-col bg-slate-50 py-2">
          <div className="border-b px-5">
            <div className="flex justify-between py-2 text-right">
              <button
                onClick={addMessage}
                className="-mx-2 rounded px-2 py-1 text-slate-400 hover:text-slate-500 active:bg-slate-200"
              >
                <EnvelopeIcon />
              </button>
              <button
                onClick={archiveMessages}
                className="-mx-2 rounded px-2 py-1 text-slate-400 hover:text-slate-500 active:bg-slate-200"
              >
                <ArchiveBoxIcon />
              </button>
            </div>
          </div>
          <ul className="h-full overflow-y-scroll px-3 pt-2">
            <AnimatePresence initial={false}>
              {[...messages].reverse().map((mid) => (
                <motion.li
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  key={mid}
                  transition={{
                    opacity: { duration: 0.2 },
                    height: { duration: 0.3 },
                  }}
                  className="relative"
                >
                  <div className="py-0.5">
                    <button
                      onClick={() => toggleMessage(mid)}
                      className={`${
                        selectedMessages.includes(mid)
                          ? "bg-blue-500"
                          : "hover:bg-slate-200"
                      } block w-full cursor-pointer truncate rounded px-3 py-3 text-left`}
                    >
                      <p
                        className={`truncate text-sm font-medium ${
                          selectedMessages.includes(mid)
                            ? "text-white"
                            : "text-slate-500"
                        }`}
                      >
                        {titles[mid % titles.length][0]}
                      </p>
                      <p
                        className={`truncate text-xs ${
                          selectedMessages.includes(mid)
                            ? "text-blue-200"
                            : "text-slate-400"
                        }`}
                      >
                        {titles[mid % titles.length][1]}
                      </p>
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
        <div className="flex-1 overflow-y-scroll border-l px-8 py-8">
          <h1 className="h-8 rounded bg-slate-100 text-2xl font-bold" />
          <div className="mt-8 space-y-6">
            {[...Array(9).keys()].map((i) => (
              <div key={i} className="space-y-2 text-sm">
                <p className="h-4 w-5/6 rounded bg-slate-100" />
                <p className="h-4 rounded bg-slate-100" />
                <p className="h-4 w-4/6 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
      />
    </svg>
  );
}

function ArchiveBoxIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
  );
}

/* Notes
Basically with Framer Motion, we begin working once a project is already completed. Then we get it animated, by organizing what would be its conditional Tailwind classes into variants, and tweaking the properties of their animations.
AND apparently, the animations remain the same even if the project evolves.
...
Honestly a bad idea to import Heroicons, the README itself is adamant about simply copypasting the JSX: https://github.com/tailwindlabs/heroicons.  
*/
