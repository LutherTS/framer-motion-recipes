import * as fs from "node:fs";

import { Suspense } from "react";

import Carousel from "./carousel";

const DEFAULT_DIRECTORY = "./public/images0";

const IMAGES_SET_LIMIT = {
  dev: 9,
  prod: 1,
} as const;

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    images?: string;
  };
}) {
  let imagesSet = Math.floor(Number(searchParams?.images)) || 0;
  if (imagesSet < 0 || imagesSet > IMAGES_SET_LIMIT.prod) imagesSet = 0;

  let images: string[];

  /* FLASH IDEA
  Making a listener to shift between images source on the deployed version... Or rather...
  Limit the image files to 10 so that by pressing 1, 2, 3, etc. I can change the image source at will. Then even pull a boolean that allows cover to be back in there. And then limit the listens on deployment to only 0 and 1, 0 being the default pictures, and 1 being the example with Attack on Titan.
  */ // DONE.

  const directory = `./public/images${imagesSet}`;
  const files = fs.readdirSync(directory);

  const directoryPath = directory.split("/").slice(2).join("/");
  images = files.map((filePath) => `/${directoryPath}/${filePath}`);

  /* Sorting numerically. All files need to have a number format, and should only be of an image format, with no folders inside. Since this is a personal and internal project, I'm not going to handle errors for now. */
  const imagesForSorting: [string, number][] = images.map((e) => [
    e,
    +e.split("/").at(-1)?.split(".").at(0)!,
  ]);
  imagesForSorting.sort((a, b) => a[1] - b[1]);
  images = imagesForSorting.map((e) => e[0]);
  // console.log(images);

  /* Replacing the copypasted multiple images. */
  const imagesDynamized = (x: number) => {
    return Array.from(
      { length: 6 * x },
      (_, i) => `/images0/${(i % 6) + 1}.jpeg?${Math.ceil((i + 1) / 6)}`,
    );
  };

  const isDefaultDirectory = directory === DEFAULT_DIRECTORY;

  if (isDefaultDirectory) images = imagesDynamized(10);
  // console.log(images);

  return (
    <Suspense>
      <Carousel images={images} isDefaultDirectory={isDefaultDirectory} />
    </Suspense>
  );
}

/* Notes
Naturally, importing fs only work on the server, therefore only on server components. This is something I'll have to refactor when doing carousel-galleries.
Something like:
import * as fs from "node:fs";
const directory = "./images";
fs.readdir(directory, (error: NodeJS.ErrnoException | null, files: string[]) => console.log(files.length));
...
I had no idea I could/should do all that fs stuff from inside the component.
*/
