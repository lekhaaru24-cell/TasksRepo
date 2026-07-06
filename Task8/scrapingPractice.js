const puppeteer=require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();

  await page.goto("https://quotes.toscrape.com/", {
    waitUntil: "networkidle2"

  });
  const html=await page.content();
  console.log(html);
  browser.close();
})();