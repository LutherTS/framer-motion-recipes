import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Framer Motion Recipes",
  description: "Courtesy of BuildUI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // I literally need to have overscroll-none on the HTML for any browser other than Firefox (specifically Safari, Chrome and I think Edge) to respect my carousel.
      className="overscroll-none"
    >
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

/* Notes
npm install @flydotio/dockerfile --save-dev --legacy-peer-deps
npx @flydotio/dockerfile --legacy-peer-deps
To deal with Next.js 15 RC React 19 RC --force issues.
https://community.fly.io/t/cant-launch-a-next-js-15-rc-react-19-rc-app/20915
*/
