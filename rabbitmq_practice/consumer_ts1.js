//task 1 create a first queue
const amqp = require("amqplib");

async function consumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  
  const queue = "hello-queue";
  await channel.assertQueue(queue, { durable: true }); // ← changed
  
  console.log(`[Consumer] Waiting for messages in "${queue}"...`);
  
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log(`[Consumer] Received: "${msg.content.toString()}"`);
      channel.ack(msg);
    }
  });
}

consumer().catch(console.error);