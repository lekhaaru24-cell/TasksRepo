const puppeteer = require("puppeteer");
 
(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
 
  const page = await browser.newPage();
 
  await page.goto("https://books.toscrape.com/", {
    waitUntil: "networkidle2"
  });
 
  const books = await page.$$eval(".product_pod", (items) => {
    return items.map((item) => {
      // jQuery-style selectors (CSS selectors)
      const title = item.querySelector("h3 a").getAttribute("title");
      const price = item.querySelector(".price_color").innerText;
 
      return {
        title,
        price
      };
    });
  });
 
  console.log(books);
 
  await browser.close();
})();