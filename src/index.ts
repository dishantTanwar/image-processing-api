import express from "express";
import path from "path";
import { doExists, resizeImage } from "./imgProcessUtil.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => res.status(200).send("app is running"));
app.get("/api/images", async (req, res) => {
  const filename = req.query.filename as string;
  const width: number = parseInt(req.query.width as string);
  const height: number = parseInt(req.query.height as string);

  if (width < 0 || height < 0) {
    res.status(400).send({
      message: "width and height cannot be negative",
    });
  }

  const imagesDir = path.resolve("images");
  // const imagePath = new URL(`${imagesDir}/${filename}.jpg`, import.meta.url);
  const rawImgPath = path.join(imagesDir, filename + ".jpg");
  const preparedImgPath = path.join(
    imagesDir,
    "prepared",
    filename + `${width}x${height}` + path.extname(rawImgPath)
  );

  // console.log("INFO: imagesDir: " + imagesDir);
  // console.log("INFO: rawImagesPath: " + rawImgPath);
  // console.log("INFO: preparedImgPath: " + preparedImgPath);

  const sendPreparedImage = async (): Promise<void> => {
    //  check if image already prepared
    if (await doExists(preparedImgPath)) {
      try {
        // console.log("DEBUG: sending prepared file");
        res.status(200).sendFile(preparedImgPath);
      } catch (error) {
        // console.log(
        //   "ERROR: while sending prepared file from path: " + preparedImgPath
        // );
      }
    } else {
      // prepare and send image
      if (await doExists(rawImgPath)) {
        try {
          await resizeImage(rawImgPath, width, height, preparedImgPath);
          res.status(200).sendFile(preparedImgPath);
        } catch (error) {
          // console.log("DEBUG: failed to resize image");
          const errMessage = error;
          res.status(500).send({
            message: errMessage,
          });
        }
      } else {
        // image DOES NOT exists
        res.status(404).send({
          message: "image not found in dataset",
        });
      }
    }
  };
  sendPreparedImage();
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});

export default app;
