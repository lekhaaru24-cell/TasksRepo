// automate document link extraction for a specific year events using Puppeteer/Cheerio
const puppeteer = require("puppeteer");
const fs = require("fs");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PAGE_URL = "https://www.ins.gov.co/buscador-eventos/Paginas/Info-Evento.aspx";

// Dynamically get current year and build last 3 years
const CURRENT_YEAR = new Date().getFullYear(); 
const SECTIONS = {
  "Informes de Evento":  [String(CURRENT_YEAR - 2), String(CURRENT_YEAR - 1), String(CURRENT_YEAR)],
  "Tableros de control": [String(CURRENT_YEAR)],
  "Tableros de control de laboratorio":[String(CURRENT_YEAR - 2),String(CURRENT_YEAR-3),String(CURRENT_YEAR-4)]
};

async function openPage() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    // args: ["--start-maximized", "--no-sandbox"],
  });
  const page = await browser.newPage();
  // await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded", timeout: 90000 });
  // await wait(6000);
  console.log("Page loaded.");
  return { browser, page };
}

async function detectWebpartPrefixes(page, sections) {
  return page.evaluate((sectionNames) => {
    // Map WPQ number → section title
    const wpqTitleMap = {};
    document.querySelectorAll("[id^='WebPartWPQ'][id$='_ChromeTitle']").forEach((el) => {
      const num   = el.id.match(/WebPartWPQ(\d+)_ChromeTitle/)?.[1];
      const title = el.querySelector(".ms-webpart-titleText")?.innerText?.trim();
      if (num && title) wpqTitleMap[num] = title;
    });

    // Map tbody prefix → section title 
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

      // Clean up event name
      const eventName = td.innerText
        .replace(/[\u00a0\u200e\u200f\u200b\ufeff]/g, " ") // remove invisible unicode chars
        .replace(/^\s*Evento\s*:\s*/i, "")                  // remove "Evento : " prefix
        .replace(/\s*\(\d+\)\s*$/, "")                      // remove count like "(12)"
        .trim();
      if (!eventName) return;

      // Convert title row ID → body row ID
      const bodyId = titleId.replace("titl", "tbod").replace(/_$/, "__");
      groups.push({ titleId, bodyId, year, section, event: eventName });
    });
    return groups;
  }, prefixMap, sections);

  console.log(`Found ${groups.length} event groups.`);
  return groups;
}

async function collectLinks(page, groups) {
  const results = [];

  for (let i = 0; i < groups.length; i++) {
    const { titleId, bodyId, year, section, event } = groups[i];
    process.stdout.write(`[${i + 1}/${groups.length}] ${section} / ${year} / ${event} ... `);

    // Click the event toggle to expand its rows
    await page.evaluate((id) => {
      document.querySelector(`#${CSS.escape(id)} a`)?.click();
    }, titleId);

    // Give first group extra attempts since page just finished loading
    const maxAttempts = i === 0 ? 60 : 40;

    // Poll every 500ms until links appear
    let links = [];
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await wait(500);
      links = await page.evaluate((id) => {
        return [...(document.getElementById(id)?.querySelectorAll("a[href]") ?? [])]
          .filter((a) => !a.href.includes("/_layouts/") && !a.href.includes("/Forms/"))
          .map((a) => ({ name: a.textContent.trim(), url: a.href }))
          .filter((r) => r.name.length > 2);
      }, bodyId);
      if (links.length > 0) break;
    }

    console.log(`${links.length} file(s)`);
    links.forEach((l) =>
      results.push({ section, year, evento: event, document_name: l.name, url: l.url })
    );
    await wait(200);
  }

  return results;
} 

// Separate function to directly collect links from sections
// that have no event groups — just direct links (e.g. PowerBI links)
async function collectDirectLinks(page, prefixMap, sections) {
  const results = [];

  for (const [section, years] of Object.entries(sections)) {
    const links = await page.evaluate((pMap, sec, yrs) => {
      const links = [];

      // Find the prefix for this section
      const prefix = Object.keys(pMap).find((k) => pMap[k] === sec);
      if (!prefix) return links;

      // Find all year rows for this section
      document.querySelectorAll("td.ms-gb:not(.ms-gb2)").forEach((td) => {
        const tdPrefix = td.closest("tbody")?.id.match(/titl(\d+)-/)?.[1];
        if (tdPrefix !== prefix) return;

        const year = td.innerText.match(/(\d{4})/)?.[1];
        if (!year || !yrs.includes(year)) return;

        // Get the body tbody for this year row
        const titleId = td.closest("tbody")?.id;
        if (!titleId) return;
        const bodyId  = titleId.replace("titl", "tbod").replace(/_$/, "__");
        const bodyEl  = document.getElementById(bodyId);
        if (!bodyEl) return;

        // Collect all direct links inside the body
        [...(bodyEl.querySelectorAll("a[href]") ?? [])]
          .filter((a) => !a.href.includes("/_layouts/"))
          .map((a) => ({ name: a.textContent.trim(), url: a.href, year }))
          .filter((r) => r.name.length > 2)
          .forEach((l) => links.push(l));
      });

      return links;
    }, prefixMap, section, years);

    links.forEach((l) =>
      results.push({ section, year: l.year, evento: "-", document_name: l.name, url: l.url })
    );
    console.log(`  ${section} → ${links.length} direct link(s) found`);
  }

  return results;
}

function saveResults(results) {
  const output = {};
  for (const section of Object.keys(SECTIONS)) {
    output[section] = results.filter((r) => r.section === section);
  }

  fs.writeFileSync("ins_events.json", JSON.stringify(output, null, 2));

  // Print: section → year → evento → file count
  for (const [section, docs] of Object.entries(output)) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(` ${section}`);
    console.log("=".repeat(60));
    const years = [...new Set(docs.map((d) => d.year))].sort();
    for (const yr of years) {
      console.log(`\n  Year: ${yr}`);
      console.log(`  ${"─".repeat(50)}`);
      const yearDocs = docs.filter((d) => d.year === yr);
      const eventoMap = {};
      for (const doc of yearDocs) {
        eventoMap[doc.evento] = (eventoMap[doc.evento] || 0) + 1;
      }
      for (const [evento, count] of Object.entries(eventoMap)) {
        console.log(`  ${evento.padEnd(55)} ${count} file(s)`);
      }
      console.log(`\n  Total for ${yr}: ${yearDocs.length} files`);
    }
  }
  console.log(`\n${"=".repeat(60)}`);
  console.log(` Grand Total: ${results.length} documents → ins_events.json`);
  console.log("=".repeat(60));
}

(async () => {
  const { browser, page } = await openPage();

  const prefixMap = await detectWebpartPrefixes(page, SECTIONS);
  console.log("Detected prefixes:", prefixMap);

  if (Object.keys(prefixMap).length === 0) {
    console.log("ERROR: Could not detect webpart prefixes.");
    await browser.close();
    return;
  }

  // Sections that have event groups
  const EVENT_SECTIONS = {
    "Informes de Evento":  [String(CURRENT_YEAR - 2), String(CURRENT_YEAR - 1), String(CURRENT_YEAR)],
    "Tableros de control": [String(CURRENT_YEAR)],
  };

  // Sections that have direct links only (no event groups)
  const DIRECT_SECTIONS = {
    "Tableros de control de laboratorio": [String(CURRENT_YEAR - 2)],
  };

  await expandYears(page, prefixMap, { ...EVENT_SECTIONS, ...DIRECT_SECTIONS });

  const groups        = await getEventGroups(page, prefixMap, EVENT_SECTIONS);
  const eventResults  = await collectLinks(page, groups);

  console.log("Collecting direct links...");
  const directResults = await collectDirectLinks(page, prefixMap, DIRECT_SECTIONS);

  const results = [...eventResults, ...directResults]; // merge both
  await browser.close();
  saveResults(results);
})();




