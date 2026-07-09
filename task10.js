const puppeteer = require("puppeteer");
const fs = require("fs");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PAGE_URL = "https://www.ins.gov.co/buscador-eventos/Paginas/Info-Evento.aspx";

const SECTIONS = {
  "Informes de Evento":  ["2025", "2026"],
  "Tableros de control": ["2026"],
};

async function openPage() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--start-maximized", "--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded", timeout: 90000 });
  await wait(6000);
  console.log("Page loaded.");
  return { browser, page };
}

async function detectWebpartPrefixes(page, sections) {
  return page.evaluate((sectionNames) => {
    // Step 1: map WPQ number → title  e.g. "1" → "Informes de Evento"
    const wpqTitleMap = {};
    document.querySelectorAll("[id^='WebPartWPQ'][id$='_ChromeTitle']").forEach((el) => {
      const num   = el.id.match(/WebPartWPQ(\d+)_ChromeTitle/)?.[1];
      const title = el.querySelector(".ms-webpart-titleText")?.innerText?.trim();
      if (num && title) wpqTitleMap[num] = title;
    });

    // Step 2: map WPQ number → tbody prefix  e.g. "1" → "387"
    const map = {};
    document.querySelectorAll("[id^='WebPartWPQ']:not([id*='_'])").forEach((el) => {
      const num    = el.id.match(/WebPartWPQ(\d+)$/)?.[1];
      if (!num) return;
      const prefix = el.querySelector("tbody[id^='titl']")?.id.match(/titl(\d+)-/)?.[1];
      if (!prefix) return;
      const title  = wpqTitleMap[num];
      if (title && sectionNames.includes(title)) map[prefix] = title;
    });

    return map;
  }, Object.keys(sections));
}

async function expandYears(page, prefixMap, sections) {
  await page.evaluate((pMap, sectionYears) => {
    document.querySelectorAll("td.ms-gb:not(.ms-gb2)").forEach((td) => {
      const prefix = td.closest("tbody")?.id.match(/titl(\d+)-/)?.[1];
      if (!prefix || !pMap[prefix]) return;
      const year = td.innerText.match(/(\d{4})/)?.[1];
      if (sectionYears[pMap[prefix]].includes(year))
        td.querySelector('a[onclick*="ExpCollGroup"]')?.click();
    });
  }, prefixMap, sections);
  await wait(5000);
  console.log("Years expanded.");
}

async function getEventGroups(page, prefixMap, sections) {
  const groups = await page.evaluate((pMap, sectionYears) => {
    const groups = [];
    document.querySelectorAll("td.ms-gb2").forEach((td) => {
      const tbody   = td.closest("tbody");
      if (!tbody) return;
      const titleId = tbody.id;
      const m = titleId.match(/titl(\d+)-(\d+)_(\d+)_$/);
      if (!m) return;
      const prefix  = m[1];
      const yrIdx   = m[2];
      const section = pMap[prefix];
      if (!section) return;
      const yearTd = document.getElementById(`titl${prefix}-${yrIdx}_`)?.querySelector("td.ms-gb");
      const year   = yearTd?.innerText.match(/(\d{4})/)?.[1];
      if (!year || !sectionYears[section].includes(year)) return;

      // Strip non-breaking space (160), LRM (8206) and "Evento : " prefix
      const eventName = td.innerText
        .replace(/[\u00a0\u200e\u200f\u200b\ufeff]/g, " ")
        .replace(/^\s*Evento\s*:\s*/i, "")
        .replace(/\s*\(\d+\)\s*$/, "")
        .trim();
      if (!eventName) return;

      const bodyId = titleId.replace("titl", "tbod").replace(/_$/, "__");
      groups.push({ titleId, bodyId, year, section, event: eventName });
    });
    return groups;
  }, prefixMap, sections);

  console.log(`Found ${groups.length} event groups.`);
  return groups;
}

