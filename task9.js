const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");

// PART 1: open the browser and navigate to the page
async function openBrowser() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
        "https://www.hkex.com.hk/Services/Circulars-and-Notices/Participant-and-Members-Circulars?sc_lang=en",
        { waitUntil: "networkidle2" }
    );

    return { browser, page };
}

// PART 2: listen for API response and collect records
async function collectRecords(page) {

    let records = [];

    // Listen for API response
    page.on("response", async (response) => {
        const url = response.url();

        if (url.includes("DisplayNewsCentreDetailsLoad")) {
            try {
                const data = await response.json();
                const html = data.d;
                const $ = cheerio.load(html);

                $(".whats_on_tdy_row").each((index, element) => {

                    // Get all the text values
                    const departmentCode = $(element).find(".whats_on_tdy_text_1 a").text().trim();
                    const linkText       = $(element).find(".whats_on_tdy_text_2 a").text().trim();
                    const date           = $(element).find(".whats_on_tdy_ball").text().trim();
                    const refNumber      = $(element).find(".whats_on_tdy_text_3").text().replace("Ref Number: ","").trim();

                    // Get the link
                    let link = $(element).find(".whats_on_tdy_text_2 a").attr("href");

                    // Add full URL if link is relative
                    if (link && link.startsWith("/")) {
                        link = "https://www.hkex.com.hk" + link;
                    }

                    // Save the record
                    records.push({ linkText, link, date, refNumber, departmentCode });
                    console.log("Collected:", records.length);

                });

            } catch (error) {
                console.log("Response parsing error:", error.message);
            }
        }
    });

    let previousCount = 0;
    let stuckCount = 0;
    const maxStuckAttempts = 10;

    // Keep scrolling until 250 records are collected
    while (records.length < 250) {

        // Scroll to the bottom of the page
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Wait for new data to load
        await new Promise(resolve => setTimeout(resolve, 2500));

        console.log("Current total:", records.length);

        // Check if records count has increased
        if (records.length === previousCount) {
            stuckCount++;
            console.log(`No new records. Attempt ${stuckCount}/${maxStuckAttempts}`);

            // Break if stuck for too long
            if (stuckCount >= maxStuckAttempts) {
                console.log("No more new records loading. Stopping.");
                break;
            }

        } else {
            // Reset stuck counter if new records were found
            stuckCount = 0;
            previousCount = records.length;
        }
    }

    // Keep only first 250 records
    return records.slice(0, 250);
}
// PART 3: save the results and close the browser
async function saveResult(records, browser) {

    // Write JSON file
    fs.writeFileSync("hkex_results.json", JSON.stringify(records, null, 4));
    console.log("Completed. Saved", records.length, "records.");

    await browser.close();
}

// main function
async function main() {
    const { browser, page } = await openBrowser();
    const records = await collectRecords(page);
    await saveResult(records, browser);
}

main();