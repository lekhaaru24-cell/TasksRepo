const amqp = require("amqplib");

const QUEUE = "gov_urls";

async function consumeUrls() {
  const connection = await amqp.connect("amqp://localhost").catch((err) => {
    console.error("Connection error:", err.message);
    process.exit(1);
  });

  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  channel.prefetch(1);
  console.log("Waiting for URLs...\n");

  channel.consume(QUEUE, (msg) => {
    const url = msg.content.toString(); // read URL from queue
    console.log("Received:", url);
    channel.ack(msg); // acknowledge message
  }, { noAck: false });
}

consumeUrls();