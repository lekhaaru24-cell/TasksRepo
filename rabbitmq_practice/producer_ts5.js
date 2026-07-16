const amqp = require("amqplib");

async function producer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "work-queue";
  await channel.assertQueue(queue, { durable: true });

  for (let i = 1; i <= 30; i++) {
    const message = `Message ${i}`;
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`[Producer] Sent: "${message}"`);
  }

  console.log("\n[Producer] All 30 messages sent.");

  setTimeout(() => {
    connection.close();
  }, 500);
}

producer().catch(console.error);