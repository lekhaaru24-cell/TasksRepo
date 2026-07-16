//task7-persistent queue-survival restart
const amqp = require("amqplib");
async function producer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "persistent-queue";

  // durable: true → queue survives RabbitMQ restart
  await channel.assertQueue(queue, { durable: true });

  for (let i = 1; i <= 10; i++) {
    const message = `Persistent Message ${i}`;

    // persistent: true → message survives RabbitMQ restart
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`[Producer] Sent: "${message}"`);
  }

  console.log("\n[Producer] All 10 messages sent.");
  console.log("[Producer] Now restart RabbitMQ and run consumer to verify.");

  setTimeout(() => {
    connection.close();
  }, 500);
}

producer().catch(console.error);