import type { Config } from "tailwindcss";

const flattenColorPalette =
  require("tailwindcss/lib/util/flattenColorPalette").default;

// This plugin adds each Tailwind color as a global CSS variable,
// e.g. var(--gray-200).
const addVariablesForColors = ({
  addBase,
  theme,
}: {
  addBase: any;
  theme: any;
}) => {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([k, v]) => [`--${k}`, v]),
  );

  addBase({
    ":root": newVars,
  });
};

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [addVariablesForColors],
};

/* original function statement before arrow function above
// This plugin adds each Tailwind color as a global CSS variable,
// e.g. var(--gray-200).
function addVariablesForColors({
  addBase,
  theme,
}: {
  addBase: any;
  theme: any;
}) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([k, v]) => [`--${k}`, v]),
  );

  addBase({
    ":root": newVars,
  });
}
*/

export default config;
