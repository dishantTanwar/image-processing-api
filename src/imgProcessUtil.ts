import { constants, promises as fsPromises } from "fs";
import path from "path";
import sharp from "sharp";

const resizeImage = async (
  imgPath: string,
  width: number,
  height: number,
  targetPath: string
): Promise<void> => {
  const filename = path.basename(imgPath);
  // console.log("DEBUG: trying to resize and save file: " + imgPath);
  // console.log("to location: " + targetPath);

  await sharp(imgPath)
    .resize(width as number, height as number)
    .toFile(targetPath)
    .then(() => {
      console.log("INFO: file demensioned and saved suuccessfully");
    });
};

const doExists = async (imgPath: string): Promise<boolean> => {
  try {
    await fsPromises.access(imgPath, constants.F_OK);
    // console.log(`${imgPath} exists`);
    return true;
  } catch (error) {
    // console.log("message");
    // console.log(`${imgPath} does not exists.\n DEBUG: return doExists: false`);
    return false;
  }
};

export { resizeImage, doExists };
