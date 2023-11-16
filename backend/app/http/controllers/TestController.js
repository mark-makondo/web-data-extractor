import asyncHandler from "express-async-handler";
import puppeteer from "puppeteer";

export const testURL = asyncHandler(async (req, res, next) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://google.com", { waitUntil: "networkidle2" });
  const data = await page.evaluate(() => document.querySelector("*").outerHTML);

  console.log(data);
});

export default {
  testURL,
};
