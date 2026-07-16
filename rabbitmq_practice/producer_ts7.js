//task7-purge-queue-deletes teh messages but keeps queue intact
const amqp = require("amqplib");

async function producer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "purge-queue";
  await channel.assertQueue(queue, { durable: true });

  for (let i = 1; i <= 100; i++) {
    const message = `Message ${i}`;
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`[Producer] Sent: "${message}"`);
  }

  console.log("\n[Producer] All 100 messages sent.");
  console.log("[Producer] Go to RabbitMQ UI and purge the queue.");

  setTimeout(() => {
    connection.close();
  }, 500);
}

producer().catch(console.error);
