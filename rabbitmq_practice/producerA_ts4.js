//task4-sharing the same queue with other producer
const amqp = require("amqplib");
async function producerA() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "multi-producer-queue";
  await channel.assertQueue(queue, { durable: true });

  for (let i = 1; i <= 50; i++) {
    const message = `[Producer A] Message ${i}`;
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`[Producer A] Sent: "${message}"`);
  }

  console.log("\n[Producer A] All 50 messages sent.");

  setTimeout(() => {
    connection.close();
  }, 500);
}

producerA().catch(console.error);