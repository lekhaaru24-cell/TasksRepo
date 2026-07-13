/*  To automatically visit the ZBS-GIZ website, extract the names and download URLs of documents 
listed on a page, organize them with their section headings, and save the results as a JSON file. */
const puppeteer = require("puppeteer");
const fs        = require("fs");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page    = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  await page.goto("https://www.zbs-giz.si/ustanovni-akti-in-porocila/", { waitUntil: "domcontentloaded" });
  await wait(5000);
  console.log("Page loaded.");

   
  // Step 1: Extract et_link_options_data and blurb info in one shot
  const results = await page.evaluate(() => {
    const results = [];
    let currentH2 = "";

    // Get URL map from et_link_options_data: { class → url }
    const urlMap = {};
    if (typeof et_link_options_data !== "undefined") {
      et_link_options_data.forEach((item) => {
        urlMap[item.class] = item.url;
      });
    }

    // Loop through blurbs with h2 context
    document.querySelectorAll(".et_pb_blurb, .et_pb_text_inner h2").forEach((el) => {
      if (el.tagName === "H2") {
        currentH2 = el.innerText?.trim().split("(figmeta)")[0].trim();
        return;
      }

      const h4   = el.querySelector("h4.et_pb_module_header");
      const name = h4?.innerText?.trim();
      if (!name) return;

      // Get blurb class name e.g. "et_pb_blurb_3"
      const blurbClass = Array.from(el.classList)
        .find((c) => c.match(/^et_pb_blurb_\d+$/));
        
      // Look up URL from et_link_options_data
      const url = urlMap[blurbClass] || null;
      results.push({ h2: currentH2, document_name: name, url });
    });
    return results;
  });

  console.log(`Found ${results.length} documents.`);
  results.forEach((r, i) => {
    console.log(`[${i + 1}] ${r.h2} / ${r.document_name} → ${r.url || "no url"}`);
  });

  // Step 3: Save
  fs.writeFileSync("task13_results.json", JSON.stringify(results, null, 2));
  console.log(`\nSaved ${results.length} records → zbs_results.json`);

  await browser.close();
})();