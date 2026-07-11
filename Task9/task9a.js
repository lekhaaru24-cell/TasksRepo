// This task is about web scraping a dynamic website using browser automation with Puppeteer.
const puppeteer = require("puppeteer");
const issuanceTypes = ["Circulars", "Memoranda", "Circular Letters"];

// PART 1: open the browser and navigate to the page
async function openBrowser() {
  const browser = await puppeteer.launch({ headless: false});
  const page = await browser.newPage();

  await page.goto(
    "https://www.bsp.gov.ph/SitePages/Regulations/RegulationsList.aspx?TabId=1",
    { waitUntil: "networkidle2" }
  );
  await page.waitForSelector("#RegTable tbody tr");
  return { browser, page };
}

// PART 2: apply filters and fetch all URLs from all pages
async function fetchUrls(page, issuanceType) {
  await page.evaluate((type) => {
    $("#cboReportType").val(type).trigger("change");
  }, issuanceType);

  await page.evaluate(() => {
    $("#divdtFrom").datepicker("setDate", new Date(2024, 0, 1));
    $("#divdtTo").datepicker("setDate", new Date(2026, 11, 31));
  });

  await page.evaluate(() => {
    $("#btnRefresh").trigger("click");
  });

  await new Promise(resolve => setTimeout(resolve, 3000));
  await page.waitForSelector("#RegTable tbody tr");

  const urls = [];

  while (true) {
    const pageUrls = await page.evaluate(() => {
      const links = [...document.querySelectorAll("table tbody tr td a[href]")];
      return [...new Set(links.map(a => a.href))];
    });

    urls.push(...pageUrls);

    const isLastPage = await page.evaluate(() => {
      return document.querySelector("#RegTable_next")?.classList.contains("disabled") ?? true;
    });

    if (isLastPage) break;

    const firstLink = pageUrls[0];

    await page.click("#RegTable_next");

    await page.waitForFunction(
      (prevLink) => {
        const firstRow = document.querySelector("#RegTable tbody tr");
        const link = firstRow?.querySelector("a")?.href;
        return link && link !== prevLink;
      },
      {},
      firstLink
    );
  }

  return urls;
}

// PART 3: print the results and close the browser
async function returnResult(type, urls, browser) {
  console.log(`\n--- ${type} ---`);
  console.log(`Found ${urls.length} URLs total`);
  console.log(urls);
  await browser.close();
}

// main function — accepts a single issuance type
async function main(issuanceType) {
  const { browser, page } = await openBrowser();        
  const urls = await fetchUrls(page, issuanceType);     
  await returnResult(issuanceType, urls, browser);      
}
main(issuanceTypes[2]);  
