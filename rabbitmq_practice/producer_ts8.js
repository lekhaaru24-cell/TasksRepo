const amqp = require("amqplib");
const axios = require("axios");
const cheerio = require("cheerio");

const SEARCH_URL =
  "https://www.gov.uk/search/news-and-communications?organisations%5B%5D=hm-treasury&order=updated-newest";
  
const QUEUE = "gov_urls";
async function sendUrls() {
  // Connect to RabbitMQ
  const connection = await amqp.connect("amqp://localhost");
  const channel    = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  // Scrape and push directly to queue
  const response = await axios.get(SEARCH_URL);
  const $        = cheerio.load(response.data);
  let count      = 0;

  $(".gem-c-document-list__item a").each((_, element) => {
    let href = $(element).attr("href");
    if (!href) return;

    // Add base URL if relative
    if (href.startsWith("/")) {
      href = "https://www.gov.uk" + href;
    }

    // Push directly to queue
    channel.sendToQueue(QUEUE, Buffer.from(href), { persistent: true });
    console.log("Sent:", href);
    count++;
  });

  console.log(`\nSent ${count} URLs to queue.`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}
sendUrls();