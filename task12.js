// automate document link extraction for a specific year events using Puppeteer/Cheerio-optimized code 
const puppeteer = require("puppeteer");
const cheerio   = require("cheerio");
const fs        = require("fs");

const wait  = (ms) => new Promise((r) => setTimeout(r, ms));
const CURRENT_YEAR = new Date().getFullYear();
const TARGET_YEAR  = [String(CURRENT_YEAR), String(CURRENT_YEAR - 1), String(CURRENT_YEAR - 2)];

// Phase 1: Open browser
async function openPage() {
  const browser = await puppeteer.launch({ headless: false });
  const page    = await browser.newPage();
  await page.goto("https://www.ins.gov.co/buscador-eventos/Paginas/Info-Evento.aspx", { waitUntil: "domcontentloaded", timeout: 90000 });
  console.log("Page loaded.");
  return { browser, page };
}

// Phase 2: Expand target year rows across all 3 tables
async function expandCurrentYear(page) {
  await page.evaluate((targetYears) => {
    document.querySelectorAll("tbody[id^='titl']").forEach((tbody) => {
      if (!tbody.id.match(/^titl\d+-\d+_$/)) return;
      const year = tbody.querySelector("td.ms-gb")?.textContent.match(/(\d{4})/)?.[1];
      if (targetYears.includes(year))
        tbody.querySelector("a[onclick*='ExpCollGroup']")?.click();
    });
  }, TARGET_YEAR);

  console.log(`Expanded years: ${TARGET_YEAR.join(", ")}`); // to show all target years
}

// Phase 3: Use cheerio to filter evento rows from expanded page HTML
async function filterRows(page) {
  const html = await page.content();
  const $    = cheerio.load(html);
  const rows = [];

  $("tbody[id^='titl']").each((i, yearTbody) => { //call function
    const titleId = $(yearTbody).attr("id");
    const m = titleId?.match(/^titl(\d+)-(\d+)_$/);
    if (!m) return;

    const prefix = m[1];
    const yrIdx  = m[2];

    const year = $(yearTbody).find("td.ms-gb").first().text().match(/(\d{4})/)?.[1];
    if (!TARGET_YEAR.includes(year)) return;

    const section = $(yearTbody).closest("[class*='col-md']")
                                .find(".ms-webpart-titleText")
                                .first()
                                .text()
                                .trim();

    const eventoPattern = new RegExp(`^titl${prefix}-${yrIdx}_(\\d+)_$`);
    $(`tbody[id^='titl${prefix}-${yrIdx}_']`).each((j, eventoTbody) => {
      const eventoId = $(eventoTbody).attr("id");
      const em       = eventoId?.match(eventoPattern);
      if (!em) return;

      const eventoIdx = em[1];

      const event = $(eventoTbody).find("td.ms-gb2").first().text()
        .replace(/[\u00a0\u200e\u200f\u200b\ufeff]/g, " ")
        .replace(/^\s*Evento\s*:\s*/i, "")
        .replace(/\s*\(\d+\)\s*$/, "")
        .trim();
      if (!event) return;

      const bodyId = `tbod${prefix}-${yrIdx}_${eventoIdx}__`;
      rows.push({ titleId: eventoId, bodyId, section, year, event });
    });
  });

  console.log(`Found ${rows.length} evento rows.`);
  return rows;
}

// Phase 4: Click each evento and collect doc URLs using cheerio
async function collectLinks(page, rows) {
  const results = [];

  for (let i = 0; i < rows.length; i++) {
    const { titleId, bodyId, section, year, event } = rows[i];
    process.stdout.write(`[${i + 1}/${rows.length}] ${section} / ${year} / ${event} ... `); //console.log()

    await page.evaluate((id) => {
      document.getElementById(id)?.querySelector("td.ms-gb2 a")?.click();
    }, titleId);

    await page.waitForFunction(
      (id) => document.getElementById(id)?.getAttribute("isloaded") === "true",
      { timeout: 15000 }, bodyId
    ).catch(() => {});

    const bodyHTML = await page.evaluate((id) => {
      return document.getElementById(id)?.innerHTML ?? "";
    }, bodyId);

    const $     = cheerio.load(bodyHTML);
    const links = [];

    $("a[href]").each((index, element) => {
      const url  = $(element).attr("href");
      const name = $(element).text().trim();
      if (!url)                       return;
      if (url.includes("/_layouts/")) return; //don't skip
      if (url.includes("/Forms/"))    return;
      if (name.length <= 2)           return;
      links.push({ name, url });
    });

    console.log(`${links.length} doc(s)`);
    links.forEach((l) =>
      results.push({ section, year, evento: event, document_name: l.name, url: l.url })
    );
    await wait(1000);
  }

  return results;
}

// Phase 5: Save results
function saveResults(records) {
  fs.writeFileSync("ins_events.json", JSON.stringify(records, null, 2));
  console.log(`\nSaved ${records.length} records → ins_events.json`);
}

// Main
(async () => {
  const { browser, page } = await openPage();
  await expandCurrentYear(page);
  const rows    = await filterRows(page);
  const records = await collectLinks(page, rows);
  await browser.close();
  saveResults(records);
})();
