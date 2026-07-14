//opdp-fetching the content from each urls
const axios   = require("axios");
const cheerio = require("cheerio");

const PAGE_URL = "https://www.fda.gov/about-fda/center-drug-evaluation-and-research-cder/completed-research-projects-office-prescription-drug-promotion-opdp-research";

const NAV_HEADINGS = new Set([
  "Featured", "Products", "Topics", "Information For",
  "Content current as of:", "Regulated Product(s)"
]);

async function main() {
  const { data } = await axios.get(PAGE_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; research-scraper/1.0)" },
  });

  const $ = cheerio.load(data);
  const results = [];

  $("h2").each((_, el) => {
    const $h2   = $(el);
    const title = $h2.text().trim();

    if (NAV_HEADINGS.has(title)) return;

    // Stop at next h2, hr, OR any element containing "More information"
    const content = $h2.nextUntil((_, node) => {
      const text = $(node).text().trim();
      return $(node).is("h2, hr") || text.startsWith("More information");
    })
    .text()
    .replace(/\s+/g, " ")
    .trim();

    if (!content) return;

    results.push({ title, content });
  });

  results.sort((a, b) => a.title.localeCompare(b.title));

  const final = results.map((r, i) => ({ id: i + 1, title: r.title, content: r.content }));

  console.log(JSON.stringify(final, null, 2));
}

main().catch(console.error);