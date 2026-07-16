// AMLC- NEWS & ANNOUNCEMENTS
const axios = require("axios");
const fs = require("fs");
const https = require("https");

const BASE_URL = "https://www.amlc.gov.ph";
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function getNewsUrls() {
  const { data } = await axios.get(`${BASE_URL}/api/news`, {
    httpsAgent,
  });
 console.log(data);

  const urls = data.data.slice(0,6).map((item) => ({
    id: item.id,
    title: item.title,
    date: item.publicationDate,
    author: item.author,
    url: `${BASE_URL}/news-and-announcements/${item.slug}?type=news`,
  }));

  urls.forEach((item, i) => {
    console.log(`${i + 1}. [${item.date}] ${item.title}`);
    console.log(`   ${item.url}\n`);
  });

  fs.writeFileSync("amlc_news_urls.json", JSON.stringify(urls, null, 2));
  console.log(`Total URLs: ${urls.length}`);
  console.log("Results saved to amlc_news_urls.json");

  return urls;
}

getNewsUrls().catch(console.error);

