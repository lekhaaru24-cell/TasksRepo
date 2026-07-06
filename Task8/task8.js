const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "https://www.bsp.gov.ph/SitePages/Regulations/RegulationsList.aspx?TabId=1",
    { waitUntil: "networkidle2" }
  );

  // wait for table to be present first
  await page.waitForFunction(
    () => document.querySelectorAll("#RegTable tbody tr").length > 0
  );

  // fill issuance type dropdown using jQuery
  await page.evaluate(() => {
    $("#cboReportType").val("Memoranda").trigger("change");
  });

  // fill date using jQuery datepicker
  await page.evaluate(() => {
    $("#divdtFrom").datepicker("setDate", new Date(2024, 0, 1));
    $("#divdtTo").datepicker("setDate", new Date(2026, 11, 31));
  });

  // click OK using jQuery trigger
  await page.evaluate(() => {
    $("#btnRefresh").trigger("click");
  });
  await new Promise(resolve => setTimeout(resolve, 3000));

  // wait for results table to reload
  await page.waitForFunction(
    () => document.querySelectorAll("#RegTable tbody tr").length > 0
  );

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

    const firstLinkBeforeClick = pageUrls[0];

    await page.click("#RegTable_next");

    await page.waitForFunction(
      (prevLink) => {
        const firstRow = document.querySelector("#RegTable tbody tr");
        const link = firstRow?.querySelector("a")?.href;
        return link && link !== prevLink;
      },
      {},
      firstLinkBeforeClick
    );
  }

  console.log(`Found ${urls.length} URLs total`);
  console.log(urls);

  await browser.close();
})();