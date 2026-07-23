const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE        = 'url_queue';
const SEARCH_URL   = 'https://www.gov.uk/search/news-and-communications?organisations%5B%5D=hm-treasury&order=updated-newest';

async function sendUrls() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel    = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });

    channel.sendToQueue(QUEUE, Buffer.from(SEARCH_URL), { persistent: true });
    console.log('[Producer] Sent URL to queue:', SEARCH_URL);

    await channel.close();   
    await connection.close(); 

  } catch (err) {
    console.error('[Producer] Error:', err.message);
    throw err;
  }
}

module.exports = { sendUrls };