const amqp = require("amqplib");

async function consumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "order-queue";
  await channel.assertQueue(queue, { durable: true });

  console.log(`[Consumer] Waiting for messages in "${queue}"...`);

  let count = 0;

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      count++;
      console.log(`[Consumer] #${count} Received: "${msg.content.toString()}"`);
      channel.ack(msg);
    }
  });
}

consumer().catch(console.error);