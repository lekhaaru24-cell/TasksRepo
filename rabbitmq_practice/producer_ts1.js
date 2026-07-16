// task 1
const amqp = require("amqplib");

async function producer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  
  const queue = "hello-queue";
  await channel.assertQueue(queue, { durable: true }); // ← changed
  
  const message = "Hello RabbitMQ";
  channel.sendToQueue(queue, Buffer.from(message), { persistent: true }); // ← added persistent
  
  console.log(`[Producer] Sent: "${message}"`);
  
  setTimeout(() => {
    connection.close();
  }, 500);
}

producer().catch(console.error);