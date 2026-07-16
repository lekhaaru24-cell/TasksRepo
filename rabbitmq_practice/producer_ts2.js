//task2-send Multiple Messages Queue FIFO
const amqp = require("amqplib");

async function producer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "order-queue";
  await channel.assertQueue(queue, { durable: true });

  // Send 20 messages in a loop
  for (let i = 1; i <= 20; i++) {
    const message = `Message ${i}`;
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`[Producer] Sent: "${message}"`);
  }

  setTimeout(() => {
    connection.close();
  }, 500);
}

producer().catch(console.error);