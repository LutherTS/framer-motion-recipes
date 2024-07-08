import * as fs from "node:fs";

import Carousel from "./carousel";

const directory = "./public/images7";
const files = fs.readdirSync(directory);

const directoryPath = directory.split("/").slice(2).join("/");
let images = files.map((filePath) => `/${directoryPath}/${filePath}`);

/* Sorting numerically. All files need to have a number format, and should only be of an image format, with no folders inside. Since this is a personal and internal project, I'm not going to handle errors for now. */
const imagesForSorting: [string, number][] = images.map((e) => [
  e,
  +e.split("/").at(-1)?.split(".").at(0)!,
]);
imagesForSorting.sort((a, b) => a[1] - b[1]);
images = imagesForSorting.map((e) => e[0]);
console.log(images);

// images = [
//   "/images/1.jpeg",
//   "/images/2.jpeg",
//   "/images/3.jpeg",
//   "/images/4.jpeg",
//   "/images/5.jpeg",
//   "/images/6.jpeg",
//   "/images/1.jpeg?2",
//   "/images/2.jpeg?2",
//   "/images/3.jpeg?2",
//   "/images/4.jpeg?2",
//   "/images/5.jpeg?2",
//   "/images/6.jpeg?2",
//   "/images/1.jpeg?3",
//   "/images/2.jpeg?3",
//   "/images/3.jpeg?3",
//   "/images/4.jpeg?3",
//   "/images/5.jpeg?3",
//   "/images/6.jpeg?3",
//   "/images/1.jpeg?4",
//   "/images/2.jpeg?4",
//   "/images/3.jpeg?4",
//   "/images/4.jpeg?4",
//   "/images/5.jpeg?4",
//   "/images/6.jpeg?4",
//   "/images/1.jpeg?5",
//   "/images/2.jpeg?5",
//   "/images/3.jpeg?5",
//   "/images/4.jpeg?5",
//   "/images/5.jpeg?5",
//   "/images/6.jpeg?5",
//   "/images/1.jpeg?6",
//   "/images/2.jpeg?6",
//   "/images/3.jpeg?6",
//   "/images/4.jpeg?6",
//   "/images/5.jpeg?6",
//   "/images/6.jpeg?6",
//   "/images/1.jpeg?7",
//   "/images/2.jpeg?7",
//   "/images/3.jpeg?7",
//   "/images/4.jpeg?7",
//   "/images/5.jpeg?7",
//   "/images/6.jpeg?7",
//   "/images/1.jpeg?8",
//   "/images/2.jpeg?8",
//   "/images/3.jpeg?8",
//   "/images/4.jpeg?8",
//   "/images/5.jpeg?8",
//   "/images/6.jpeg?8",
//   "/images/1.jpeg?9",
//   "/images/2.jpeg?9",
//   "/images/3.jpeg?9",
//   "/images/4.jpeg?9",
//   "/images/5.jpeg?9",
//   "/images/6.jpeg?9",
//   "/images/1.jpeg?10",
//   "/images/2.jpeg?10",
//   "/images/3.jpeg?10",
//   "/images/4.jpeg?10",
//   "/images/5.jpeg?10",
//   "/images/6.jpeg?10",
// ];

// const images = Array.from({ length: 6 }, (_, i) => `/images/${i + 1}.jpeg`);

export default async function Page() {
  return (
    <div className="flex max-h-screen items-center overflow-y-hidden bg-black">
      <Carousel images={images} objectFit="contain" />
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
