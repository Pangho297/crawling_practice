import * as puppeteer from "puppeteer";
require("dotenv").config();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const page = await browser.newPage();
  await page.goto(process.env.CRAWLING_URL);
  await page.waitForTimeout(200);

  const tableContainer = await page.$(".igc-crosshair-overlay");
  const { x, width } = await tableContainer.boundingBox();

  const crawlingComposite = async (x: number, width: number) => {
    let newArr: { date: string; value: string }[] = [];
    let currentX = x;
    for (let i = 0; i <= width; i++) {
      await page.mouse.move(currentX + i, width);
      const tooltipText = await page.$eval(
        ".tt_value",
        (element) => element.textContent
      );
      newArr = [
        ...newArr,
        {
          date: tooltipText.split(": ")[0],
          value: tooltipText.split(": ")[1],
        },
      ];
    }
    console.log(newArr);
    return newArr;
  };
  crawlingComposite(x, width);
})();
