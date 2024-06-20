"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Page() {
  let [step, setStep] = useState(1);

  return (
    <div className="flex min-h-screen items-start bg-gradient-to-br from-slate-700 to-slate-900 pt-40 font-mono">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white">
        <div className="flex justify-between rounded p-8">
          <Step step={1} currentStep={step} />
          <Step step={2} currentStep={step} />
          <Step step={3} currentStep={step} />
          <Step step={4} currentStep={step} />
        </div>
        <div className="px-8 pb-8">
          <div>
            <div className="mt-2 h-6 w-40 rounded bg-slate-100" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-5/6 rounded bg-slate-100" />
              <div className="h-4 rounded bg-slate-100" />
              <div className="h-4 w-4/6 rounded bg-slate-100" />
            </div>
          </div>

          <div className="mt-10 flex justify-between">
            <button
              onClick={() => setStep(step < 2 ? step : step - 1)}
              className={`rounded px-2 py-1 text-slate-400 ${step === 1 ? "pointer-events-none" : "hover:text-slate-700"}`}
            >
              Back
            </button>
            <button
              onClick={() => setStep(step > 4 ? step : step + 1)}
              className={`flex items-center justify-center rounded-full bg-blue-500 px-3.5 py-1.5 font-medium tracking-tight text-white hover:bg-blue-600 active:bg-blue-700 ${
                step > 4 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ step, currentStep }: { step: number; currentStep: number }) {
  let status: "active" | "inactive" | "complete" =
    currentStep === step
      ? "active"
      : currentStep < step
        ? "inactive"
        : "complete";

  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor:
          status === "complete" ? "var(--blue-500)" : "var(--white)",
        borderColor:
          status === "complete" || status === "active"
            ? "var(--blue-500)"
            : "var(--slate-200)",
        color: status === "active" ? "var(--blue-500)" : "var(--slate-400)",
      }}
      transition={undefined}
      className="flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold"
    >
      <div className="flex items-center justify-center">
        {status === "complete" ? (
          <CheckIcon className="h-6 w-6 text-white" />
        ) : (
          <span>{step}</span>
        )}
      </div>
    </motion.div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* Notes
Because this is simply a tutorial, I'm making the full page a client component. For now. But this is not how I am meant to operate. 
Also normally I I would import the Step and CheckIcon components from different files, but again, not for the sake of this tutorial.
Core lesson here: if you're going to really go hard on animate, conditional classes are better off shifted onto FramerMotion's animate.
*/
