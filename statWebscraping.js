const axios = require('axios');
const cheerio = require('cheerio');

const urls = [
 'https://www.fca.org.uk/news/press-releases/commodity-traders-offer-one-million-pounds-crisis-fund-f…',
 'https://www.fca.org.uk/news/press-releases/fca-consults-proposals-support-strong-consistent-standar…',
 'https://www.fca.org.uk/news/press-releases/fca-proposals-help-more-access-mortgages',
 'https://www.fca.org.uk/news/press-releases/investors-get-real-time-view-uk-bond-market-activity-fir…',
 'https://www.fca.org.uk/news/press-releases/fca-decides-fine-carlos-ricardo-fuenmayor-disclosure-fai…',
 'https://www.fca.org.uk/news/press-releases/court-orders-appointment-special-administrators-euro-exc…',
 'https://www.fca.org.uk/news/press-releases/simpler-climate-reporting-rules-could-save-firms-20m-ann…',
 'https://www.fca.org.uk/news/press-releases/consumers-warned-about-misleading-car-finance-money-tips…',
 'https://www.fca.org.uk/news/press-releases/fca-secures-confiscation-order-against-ponzi-scheme-frau…',
 'https://www.fca.org.uk/news/press-releases/fca-imposes-requirements-euro-exchange-securities-uk-lim…'
];

const scrapeArticles = async (urls) => {
 const articles = [];

 for (const url of urls) {
 try {
 const response = await axios.get(url, {
 headers: {
 "User-Agent":
 "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
 }
 });

 const $ = cheerio.load(response.data);

 const title =
 $('h1').first().text().trim() ||
 $('title').first().text().trim() ||
 'No title found';

 let date = null;

 const timeEl = $('time').first();

 if (timeEl.length) {
 date = timeEl.attr('datetime') || timeEl.text() || null;
 if (date) date = date.slice(0, 10);
 }

 // article/main content blocks
 let content = $('article p, main p')
 .map((i, el) => $(el).text())
 .get()
 .join(' ')
 .replace(/\s+/g, ' ')
 .trim();

 // fallback: all paragraphs
 if (!content || content.length < 50) {
 content = $('p')
 .map((i, el) => $(el).text())
 .get()
 .join(' ')
 .replace(/\s+/g, ' ')
 .replace(/\s+/g, ' ')
 .trim();
 }

 articles.push({
 url,
 title,
 date,
 content: content.slice(0, 500)
 });

 console.log(`Scraped: ${url}`);

 } catch (err) {
 console.error(`Error: ${url} -> ${err.message}`);
 }
 }

 console.log("\nFINAL OUTPUT:\n");
 console.log(articles);
};

scrapeArticles(urls);