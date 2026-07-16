const amqp = require("amqplib");

async function producer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "monitor-queue";
  await channel.assertQueue(queue, { durable: true });

  // Send 100 messages
  for (let i = 1; i <= 100; i++) {
    const message = `Message ${i}`;
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`[Producer] Sent: "${message}"`);
  }

  console.log("\n[Producer] All 100 messages sent.");
  console.log("[Producer] Now open RabbitMQ UI → http://localhost:15672");
  setTimeout(() => {
    connection.close();
  }, 500);
}

producer().catch(console.error);