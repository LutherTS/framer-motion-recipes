import Carousel from "./carousel";

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

// const images = Array.from({ length: 6 }, (_, i) => `/images/${i + 1}.jpeg`);

export default async function Page() {
  return (
    <div className="flex max-h-screen items-center overflow-y-hidden bg-black">
      <Carousel images={images} />
    </div>
  );
}

/* Notes
Naturally, importing fs only work on the server, therefore only on server components. This is something I'll have to refactor when doing carousel-galleries.
Something like:
import * as fs from "node:fs";
const directory = "./images";
fs.readdir(directory, (error: NodeJS.ErrnoException | null, files: string[]) => console.log(files.length));
*/
