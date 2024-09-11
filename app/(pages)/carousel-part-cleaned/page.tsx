// import * as fs from "node:fs";
import { Suspense } from "react";

import Carousel from "./carousel";

let images: string[];

// const directory = "./public/images4";
// const files = fs.readdirSync(directory);

// const directoryPath = directory.split("/").slice(2).join("/");
// images = files.map((filePath) => `/${directoryPath}/${filePath}`);

/* Sorting numerically. All files need to have a number format, and should only be of an image format, with no folders inside. Since this is a personal and internal project, I'm not going to handle errors for now. */
// const imagesForSorting: [string, number][] = images.map((e) => [
//   e,
//   +e.split("/").at(-1)?.split(".").at(0)!,
// ]);
// imagesForSorting.sort((a, b) => a[1] - b[1]);
// images = imagesForSorting.map((e) => e[0]);
// console.log(images);

/* Replacing the copypasted multiple images. */
const imagesDynamized = (x: number) => {
  return Array.from(
    { length: 6 * x },
    (_, i) => `/images/${(i % 6) + 1}.jpeg?${Math.ceil((i + 1) / 6)}`,
  );
};
images = imagesDynamized(10);
// console.log(images);

export default async function Page() {
  return (
    <Suspense>
      <Carousel images={images} />
    </Suspense>
  );
}

/* Notes
Naturally, importing fs only work on the server, therefore only on server components. This is something I'll have to refactor when doing carousel-galleries.
Something like:
import * as fs from "node:fs";
const directory = "./images";
fs.readdir(directory, (error: NodeJS.ErrnoException | null, files: string[]) => console.log(files.length));
*/
