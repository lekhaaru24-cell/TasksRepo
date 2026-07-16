const amqp = require("amqplib");

async function consumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "monitor-queue";
  await channel.assertQueue(queue, { durable: true });

  console.log(`[Consumer] Started — draining "${queue}"...`);
  console.log("[Consumer] Watch the queue depth drop at http://localhost:15672\n");

  channel.consume(queue, (msg) => {
    if (msg !== null) {
  
      console.log(`[Consumer] Processed "${msg.content.toString()}"`);
      channel.ack(msg);
    }
  });
}

consumer().catch(console.error);