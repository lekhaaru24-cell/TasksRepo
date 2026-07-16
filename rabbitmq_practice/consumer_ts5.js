const amqp = require("amqplib");

// Read consumer name from command line → node consumer.js C1
const consumerName = process.argv[2] || "Consumer";

async function consumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "work-queue";
  await channel.assertQueue(queue, { durable: true });

  // Process only 1 message at a time per consumer
  channel.prefetch(1);

  console.log(`[${consumerName}] Started — waiting for messages...\n`);

  let count = 0;

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      count++;
      const text = msg.content.toString();
      console.log(`[${consumerName}] Received #${count}: "${text}"`);
      channel.ack(msg);
    }
  });
}

consumer().catch(console.error);