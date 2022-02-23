import fsPromises from "fs/promises";
import path from "path";
import supertest from "supertest";
import { doExists } from "../imgProcessUtil.js";
import app from "../index.js";
// import { constants, promises as fsPromises } from "fs";
// describe suit defination
describe("suite description", () => {
  const request = supertest(app);

  it("test if server is running", (done: DoneFn) => {
    request.get("/").expect(200);
    done();
  });

  it("test image not found message", async function () {
    const message = await request.get(
      `/api/images?filename=xfjord&width=10&height=20`
    );
    expect(message.statusCode).toEqual(404);
    expect(message.body.message).toEqual("image not found in dataset");
  });

  it("test if new image is resized and cached", async function () {
    const imagePath = path.resolve("images/prepared/fjord10x20.jpg");
    const message = await request.get(
      `/api/images?filename=fjord&width=10&height=20`
    );
    expect(message.statusCode).toEqual(200);
    doExists(imagePath).then((result) => {
      expect(result).toBeTruthy();
    });
  });

  it("tests if cached image is used", async () => {
    const imagePath = path.resolve("images/prepared/fjord10x20.jpg");
    const message = await request.get(
      `/api/images?filename=fjord&width=10&height=20`
    );
    expect(message.statusCode).toEqual(200);
    doExists(imagePath).then((result) => {
      expect(result).toBeTruthy();
      fsPromises.unlink(imagePath);
    });
  });
});
