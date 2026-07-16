//task6-received the persistent messages
const amqp = require("amqplib");
async function consumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "persistent-queue";

  // Must match producer — durable: true
  await channel.assertQueue(queue, { durable: true });

  console.log(`[Consumer] Checking "${queue}" after restart...\n`);

  let count = 0;

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      count++;
      console.log(`[Consumer] #${count} Received: "${msg.content.toString()}"`);
      channel.ack(msg);

      if (count === 10) {
        console.log("[Consumer] All 10 messages survived the restart.");
      }
    }
  });
}

consumer().catch(console.error);