const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME   = "task_queue";

const processedMessages = [];
let messageCount = 0;
let intervalId   = null;

async function startWorker() {
  try {
    // Create connection
    const connection = await amqp.connect(RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("[RabbitMQ Connection Error]", err.message);
    });

    // ✅ Reconnect when connection closes
    connection.on("close", () => {
      console.error("[RabbitMQ Connection Closed] Reconnecting in 5 seconds...");
      if (intervalId) {
        clearInterval(intervalId); // stop producer interval
        intervalId = null;
      }
      setTimeout(startWorker, 5000); // retry after 5 seconds
    });

    // Create channel
    const channel = await connection.createChannel();

    channel.on("error", (err) => {
      console.error("[RabbitMQ Channel Error]", err.message);
    });

    channel.on("close", () => {
      console.error("[RabbitMQ Channel Closed]");
    });

    // Create queue
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log("[Worker] Connected to RabbitMQ");

    // Consumer
    await channel.consume(QUEUE_NAME, (msg) => {
      if (!msg) return;

      try {
        const content = msg.content.toString();
        const payload = JSON.parse(content);

        console.log("[Consumer] Received:", content);

        processedMessages.push({
          ...payload,
          receivedAt: new Date().toISOString(),
        });

        channel.ack(msg);
      } catch (err) {
        console.error("[Consumer Error]", err);
        channel.nack(msg, false, true);
      }
    });

    console.log("[Consumer] Listening on queue...");

    // Producer
    function sendMessage() {
      try {
        if (messageCount >= 20) {
          clearInterval(intervalId);
          intervalId = null;
          console.log("[Producer] Sent 20 messages. Producer stopped.");
          return;
        }

        messageCount++;

        const message = JSON.stringify({
          id:        messageCount,
          text:      `Hello from producer! Message #${messageCount}`,
          timestamp: new Date().toISOString(),
        });

        const sent = channel.sendToQueue(
          QUEUE_NAME,
          Buffer.from(message),
          { persistent: true }
        );

        if (!sent) {
          console.warn("[Producer] Write buffer is full.");
        } else {
          console.log("[Producer] Sent:", message);
        }
      } catch (err) {
        console.error("[Producer Error]", err.message);
      }
    }

    // Send first message immediately
    sendMessage();

    // Send remaining messages every 3 seconds
    intervalId = setInterval(sendMessage, 2000);

  } catch (err) {
    // Retry on startup error
    console.error("[Worker Startup Error]", err.message);
    console.log("Retrying in 5 seconds...");
    setTimeout(startWorker, 5000);
  }
}

module.exports = {
  startWorker,
  processedMessages,
};