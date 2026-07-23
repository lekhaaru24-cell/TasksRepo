// const express = require("express");
// const { startWorker, processedMessages } = require("./rabbitmq-node-demo/worker");

// const app  = express();
// const PORT = 3000;

// // Start the worker when server starts
// startWorker();

// // Route to see all processed messages
// app.get("/messages", (req, res) => {
//   res.json({
//     total:    processedMessages.length,
//     messages: processedMessages,
//   });
// });

// // Route to check server status
// app.get("/status", (req, res) => {
//   res.json({
//     status:  "running",
//     total: processedMessages.length,
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
//   console.log(`View messages at http://localhost:${PORT}/messages`);
// });

require('dotenv').config();

const express  = require('express');
const path     = require('path');
const { initializeConnection, consumeMessages } = require('./rabbitmq-node-demo/app');
const { sendUrls } = require('./rabbitmq-node-demo/producer'); // ✅ import like app.js

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/status', (req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
  });
});

async function main() {
  // Step 1 — connect to RabbitMQ
  await initializeConnection();

  // Step 2 — call sendUrls directly — no execFileSync
  console.log('[Server] Running producer...');
  await sendUrls(); //

  // Step 3 — start Express
  app.listen(PORT, () => {
    console.log(`[Server] Express running on http://localhost:${PORT}`);
    console.log(`  GET /status — health check`);
  });

  // Step 4 — start consumer
  await consumeMessages();
}

main().catch((err) => {
  console.error('[Server] Fatal error:', err.message);
  process.exit(1);
});