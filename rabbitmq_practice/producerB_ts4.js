const amqp = require("amqplib");

async function producerB() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "multi-producer-queue";
  await channel.assertQueue(queue, { durable: true });

  for (let i = 1; i <= 50; i++) {
    const message = `[Producer B] Message ${i}`;
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`[Producer B] Sent: "${message}"`);
  }

  console.log("\n[Producer B] All 50 messages sent.");

  setTimeout(() => {
    connection.close();
  }, 500);
}

producerB().catch(console.error);