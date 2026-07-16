const amqp = require("amqplib");

async function consumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "multi-producer-queue";
  await channel.assertQueue(queue, { durable: true });

  console.log(`[Consumer] Waiting for messages in "${queue}"...\n`);

  let totalCount = 0;
  let countA = 0;
  let countB = 0;

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const text = msg.content.toString();
      totalCount++;

      // Track which producer sent the message
      if (text.includes("[Producer A]")) countA++;
      if (text.includes("[Producer B]")) countB++;

      console.log(`[Consumer] #${totalCount} Received: "${text}"`);
      channel.ack(msg);

      // Print summary when all 100 are received
      if (totalCount === 100) {
        console.log(`[Consumer] All 100 messages received.`);
        console.log(`  From Producer A : ${countA} messages`);
        console.log(`  From Producer B : ${countB} messages`);
        console.log(`  Total           : ${totalCount} messages`);
      
      }
    }
  });
}

consumer().catch(console.error);