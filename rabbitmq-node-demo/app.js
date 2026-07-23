require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const amqp    = require('amqplib');
const axios   = require('axios');
const cheerio = require('cheerio');

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE        = process.env.QUEUE;

let connection    = null;
let channel       = null;
let totalUrls     = 0;
let receivedCount = 0;

const wait = (ms) => new Promise(res => setTimeout(res, ms));

// ── 1. INITIALIZE CONNECTION
async function initializeConnection() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel    = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });
    await channel.purgeQueue(QUEUE);
    console.log('[App] Queue purged. Starting fresh.');
    console.log('[App] Connected to RabbitMQ');

    connection.on('close', async () => {
      console.warn('[App] RabbitMQ disconnected. Reconnecting in 5s...');
      channel    = null;
      connection = null;
      await wait(5000);
      await initializeConnection();
      await consumeMessages();
    });

    connection.on('error', (err) => {
      console.error('[App] Connection error:', err.message);
    });

  } catch (err) {
    console.error('[App] Could not connect:', err.message);
    throw err; // ✅ bubble up to server.js main() catch block
  }
}

// ── 2. PRODUCER — sends article URLs one by one 
async function produceMessages(urls) {
  for (const url of urls) {
    if (!channel) {
      console.warn('[Producer] Channel not ready. Waiting...');
      await wait(5000);
    }
    channel.sendToQueue(QUEUE, Buffer.from(url), { persistent: true });
    console.log('[Producer] Sent to queue:', url);
    await wait(2000);
  }
  console.log(`\n[Producer] All ${urls.length} URLs sent to queue.`);
}

// ── 3. CONSUMER 
async function consumeMessages() {
  console.log('[Consumer] Waiting for messages from queue...');
  channel.prefetch(1);

  // STEP 1: pull the search page URL using channel.get()
  let searchMsg = null;

  // keep trying until search URL arrives in queue
  while (!searchMsg) {
    searchMsg = await channel.get(QUEUE, { noAck: false });
    if (!searchMsg) await wait(1000);
  }

  const searchUrl = searchMsg.content.toString();
  console.log('\n[Consumer] Received search page URL:', searchUrl);
  console.log('[Consumer] Fetching page...');

  try {
    const response = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $    = cheerio.load(response.data);
    const urls = [];

    // STEP 2: extract all article URLs into array
    $('.gem-c-document-list__item a').each((_, element) => {
      let href = $(element).attr('href');
      if (!href) return;
      if (href.startsWith('/')) href = 'https://www.gov.uk' + href;
      urls.push(href);
    });

    console.log(`[Consumer] Extracted ${urls.length} URLs from search page.`);

    totalUrls     = urls.length;
    receivedCount = 0;

    channel.ack(searchMsg);

    // STEP 3: send all article URLs to queue via produceMessages
    await produceMessages(urls);

    // STEP 4: read article URLs one by one using setInterval
    console.log('\n[Consumer] Now reading article URLs from queue...');

    const articleInterval = setInterval(async () => {
      if (!channel) return;

      const msg = await channel.get(QUEUE, { noAck: false });
      if (!msg) return;

      const articleUrl = msg.content.toString();
      receivedCount++;
      console.log(`[Consumer] Received article URL (${receivedCount}/${totalUrls}):`, articleUrl);
      channel.ack(msg);

      // STEP 5: stop once all article URLs are received
      if (receivedCount >= totalUrls) {
        console.log(`\n[Consumer] All ${totalUrls} article URLs received successfully.`);
        clearInterval(articleInterval); 
      }

    }, 1000);

  } catch (err) {
    console.error('[Consumer] Error:', err.message);
    channel.nack(searchMsg, false, true);
  }
}

// ── 4. getChannel
function getChannel() {
  if (!channel) throw new Error('[App] Channel not initialized. Call initializeConnection() first.');
  return channel;
}

module.exports = { initializeConnection, produceMessages, consumeMessages, getChannel };