const axios   = require("axios");
const cheerio = require("cheerio");

const URL = "http://oscbulletin.carswell.com/bb/osc/bb/4905/on4905.htm";

const SKIP = ["Registrar","Subscribe","capitalmarketstribunal","For Media","For General","1-877","inquiries@"];

const clean   = t  => t.replace(/\s+/g, " ").trim();
const isSkip  = t  => SKIP.some(s => t.includes(s));
const isTitle = $el => $el.find("a[href='#toc'] b, a[href='#toc'] strong").length > 0;

async function scrape() {
  const { data } = await axios.get(URL, {
    headers: { "User-Agent": "Mozilla/5.0 Chrome/124.0", "Referer": URL }
  });

  const $      = cheerio.load(data);
  const result = {};
  let chapter, section, entry;

  function saveEntry() {
    if (!entry || !chapter || !section) return;
    const content = entry.lines.filter(l => l && !isSkip(l)).join("\n");
    if (content) result[chapter][section].push({ title: entry.title, content });
    entry = null;
  }

  $("h3, h4, p").each((_, el) => {
    const $el = $(el);
    const tag = el.tagName;
    const txt = clean($el.text());

    if (tag === "h3") {
      saveEntry();
      const anchor = $el.find("a[name]").attr("name") || "";
      chapter      = `${txt} (${URL}${anchor ? "#" + anchor : ""})`;
      section      = null;
      entry        = null;
      result[chapter] = {};

    } else if (tag === "h4") {
      if (entry)             entry.lines.push(txt);          // sub-heading inside entry → content
      else if (txt.length < 60) {                             // short h4 → real section header
        saveEntry();
        section = txt;
        result[chapter][section] ??= [];
      }

    } else if (tag === "p" && chapter && section) {
      if (isTitle($el)) {
        saveEntry();
        entry = { title: clean($el.find("b, strong").first().text()) || txt, lines: [] };
      } else if (entry && txt) {
        entry.lines.push(txt);
      }
    }
  });

  saveEntry();
  return result;
}

scrape()
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err  => console.error("Error:", err.message));