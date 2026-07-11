const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const indexURL = "https://www.incredibleindia-tourism.org/state-in-india/state-in-india.html";

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();

    await page.goto(indexURL, {
        waitUntil: "networkidle2"
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    let result = [];

    $("a").each((i, el) => { 

        const linkData = $(el).text().trim().toLowerCase();

        if (linkData.includes("read more")) {

            const content = $(el).closest("p");

            // Remove the "read more" link and get only the paragraph text
            const about = content
                .children("a")
                .remove()
                .end()
                .text()
                .trim();

            const stateName = content
                .prevAll("p.shortbreaks")
                .first()
                .find("a")
                .text()
                .trim();

            result.push({
                stateName,
                about
            });
        }
    });

    console.log(result);

    await browser.close();
})();

